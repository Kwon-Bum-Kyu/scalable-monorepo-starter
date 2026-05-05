---
name: be-implementation
description: apps/api 백엔드 구현 스킬. Express + Prisma + PostgreSQL 스택에서 Route→Controller→Service→Repository 레이어드 아키텍처, Zod 검증, ApiResponse 엔벨로프, envalid 환경변수, Prisma 마이그레이션 규칙을 적용한다. BE 개발 시 반드시 사용.
---

# be-implementation

## 목적

BE 개발 태스크를 레이어드 아키텍처와 SQL 격리·Prisma 필수·마이그레이션 불변 규칙에 맞춰 구현한다.

## 왜 중요한가

- 계층 건너뛰기(Controller→Prisma)는 비즈니스 로직이 HTTP에 종속되게 만든다
- SQL 문자열이 Service에 있으면 테스트하려면 실제 DB가 필요해진다
- 기존 마이그레이션 수정은 배포 환경에서 복구 불가능한 divergence를 일으킨다

## 구현 순서 (계층 바텀업)

### 1. prisma/schema.prisma

변경 사항 정의:

```prisma
model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  user      User     @relation(fields: [userId], references: [id])

  @@index([userId])
}
```

### 2. 마이그레이션 생성

```bash
# apps/api 디렉토리에서
npm run migrate
# 또는 turbo run migrate --filter=api
```

마이그레이션 파일명에 기능명 포함 (예: `20260419_add_session.sql`).

**기존 마이그레이션 파일 수정 절대 금지.** 필요 시 새 마이그레이션 생성.

### 3. Repository (apps/api/src/repositories/)

SQL 격리의 유일한 장소. Prisma Client 사용.

```typescript
// apps/api/src/repositories/sessionRepository.ts
import { prisma } from "@/lib/prisma";

export const SessionRepository = {
  async create(userId: string, token: string, expiresAt: Date) {
    return prisma.session.create({
      data: { userId, token, expiresAt },
    });
  },

  async findByToken(token: string) {
    return prisma.session.findUnique({ where: { token } });
  },
};
```

Controller, Service에 `prisma.*` 직접 호출 금지.

### 4. Service (apps/api/src/services/)

비즈니스 로직만. HTTP·DB 세부사항 없음.

```typescript
// apps/api/src/services/authService.ts
import { SessionRepository } from "@/repositories/sessionRepository";
import { UserRepository } from "@/repositories/userRepository";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

export const AuthService = {
  async login(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error("USER_NOT_FOUND");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new Error("INVALID_CREDENTIALS");

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await SessionRepository.create(user.id, token, expiresAt);

    return { token, expiresAt: expiresAt.toISOString() };
  },
};
```

### 5. Controller (apps/api/src/controllers/)

Zod 검증 → Service 호출 → ApiResponse 포맷.

```typescript
// apps/api/src/controllers/authController.ts
import { Request, Response } from "express";
import { z } from "zod";
import { AuthService } from "@/services/authService";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const AuthController = {
  async login(req: Request, res: Response) {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: { message: "잘못된 입력입니다", code: "INVALID_INPUT" },
      });
    }

    try {
      const result = await AuthService.login(parsed.data.email, parsed.data.password);
      return res.json({ success: true, data: result });
    } catch (err) {
      const message = err instanceof Error ? err.message : "UNKNOWN";
      return res.status(401).json({
        success: false,
        error: { message: "로그인에 실패했습니다", code: message },
      });
    }
  },
};
```

### 6. Route (apps/api/src/routes/)

```typescript
// apps/api/src/routes/auth.ts
import { Router } from "express";
import { AuthController } from "@/controllers/authController";

export const authRouter = Router();
authRouter.post("/login", AuthController.login);
```

## 규칙

### Zod는 api 내부에만

`packages/shared-types`에는 Zod 스키마 금지 (런타임 코드 금지 규칙).
api 내부에서 shared-types의 타입을 import하고, 그 shape에 맞춰 Zod 스키마를 api 내에 별도 정의.

### ApiResponse 엔벨로프

모든 응답:

```typescript
{ success: true, data: T }
{ success: false, error: { message: string, code: string } }
```

### envalid 환경변수

```typescript
// apps/api/src/config/env.ts
import { cleanEnv, str, port } from "envalid";

export const env = cleanEnv(process.env, {
  DATABASE_URL: str(),
  PORT: port({ default: 4000 }),
  NODE_ENV: str({ choices: ["development", "production", "test"] }),
});
```

`process.env.*` 직접 접근 금지.

### 이모지/console.log 금지

로깅이 필요하면 로거 모듈 사용.

## 테스트

### 통합 테스트 (Supertest + 실제 테스트 DB)

```typescript
// apps/api/test/integration/auth.test.ts
import request from "supertest";
import { app } from "@/app";

describe("POST /auth/login", () => {
  it("올바른 자격증명으로 로그인하면 토큰을 반환한다", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "a@b.com", password: "password123" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });
});
```

### 단위 테스트 (Service, Prisma mock)

```typescript
// apps/api/test/unit/authService.test.ts
import { AuthService } from "@/services/authService";
import { UserRepository } from "@/repositories/userRepository";

vi.mock("@/repositories/userRepository");

it("비밀번호가 틀리면 로그인에 실패한다", async () => {
  vi.mocked(UserRepository.findByEmail).mockResolvedValue({
    id: "u1", email: "a@b.com", passwordHash: "hashed",
  } as any);
  await expect(AuthService.login("a@b.com", "wrong")).rejects.toThrow("INVALID_CREDENTIALS");
});
```

테스트당 mock ≤2 유지.

## 완료 보고 포맷

```
[be-developer] T-01 완료
- 변경 파일:
  - prisma/schema.prisma (Session 추가)
  - prisma/migrations/20260419_add_session/migration.sql (신규)
  - apps/api/src/repositories/sessionRepository.ts (신규)
  - apps/api/src/services/authService.ts (신규)
  - apps/api/src/controllers/authController.ts (신규)
  - apps/api/src/routes/auth.ts (신규)
- 마이그레이션: 신규 1건
- 테스트:
  - test/integration/auth.test.ts (4건 pass)
  - test/unit/authService.test.ts (3건 pass)
- 커버리지: 91% (statements)
- 이슈: 없음
```

## 체크리스트

- [ ] 계층 순서(Prisma→Repository→Service→Controller→Route) 준수
- [ ] SQL은 Repository에만
- [ ] Prisma Client 사용, raw SQL 없음
- [ ] 기존 마이그레이션 수정 없음
- [ ] Zod 검증은 Controller에
- [ ] ApiResponse 엔벨로프 적용
- [ ] envalid 환경변수, process.env 직접 접근 없음
- [ ] 테스트 커버리지 80% 이상, mock ≤2
- [ ] 이모지/console.log 없음
