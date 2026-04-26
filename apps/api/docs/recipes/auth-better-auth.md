# Auth 슬롯 — better-auth 레시피

`apps/api/src/middlewares/require-auth.ts`의 빈 슬롯을 [better-auth](https://www.better-auth.com/) 기반 세션 검증으로 교체한다.

## 1. 언제 이 옵션을 선택하는가

- 자체 호스팅 인증을 원할 때 (DB는 본 프로젝트의 PostgreSQL 그대로 사용).
- 이메일/비밀번호 + OAuth 동시 지원이 필요한 경우.
- Prisma 스키마와 통합되는 라이브러리를 선호할 때.

## 2. 의존성 설치

```bash
npm i -w api better-auth
```

버전은 latest stable. 특정 버전 고정 금지.

## 3. 환경변수 추가

`.env.example` / `.env`:

```
BETTER_AUTH_SECRET=replace-me
BETTER_AUTH_URL=http://localhost:4000
```

`apps/api/src/config/env.ts`의 `cleanEnv` 호출에 두 변수를 `str()`로 추가.

## 4. require-auth.ts 교체

```typescript
import type { RequestHandler } from "express";
import { AppError } from "../errors/app-error";
import { ERROR_CODES } from "../errors/error-codes";
import { auth } from "../lib/better-auth"; // 새로 추가하는 better-auth 인스턴스

export const requireAuth: RequestHandler = async (request, _response, next) => {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      throw new AppError("인증이 필요합니다.", 401, ERROR_CODES.UNAUTHORIZED);
    }

    request.context = {
      ...(request.context ?? {}),
      auth: {
        user: { id: session.user.id, email: session.user.email },
        session: { id: session.session.id, userId: session.user.id, expiresAt: session.session.expiresAt },
      },
    };
    next();
  } catch (error) {
    next(error);
  }
};
```

## 5. 테스트 추가 가이드

- 단위: `test/unit/middlewares/require-auth.test.ts` 를 갱신해 `auth.api.getSession`을 mock 처리하고 (1) 세션 유효 → next 호출, (2) 세션 없음 → UNAUTHORIZED, (3) 세션 만료 → SESSION_EXPIRED.
- 통합: 보호된 라우트에 Supertest로 요청해 401/200 응답을 검증한다. mock은 1개 이내로 유지.

## 6. 알려진 한계

- better-auth는 자체 마이그레이션을 요구한다. `prisma/schema.prisma`에 `User`/`Session`/`Account` 모델을 추가하고 새 마이그레이션을 생성해야 한다. 기존 마이그레이션 수정 금지.
- Edge runtime 미지원. Node 22+ 필수.
