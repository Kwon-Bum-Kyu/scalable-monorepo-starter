# Auth 슬롯 — Lucia 레시피

`apps/api/src/middlewares/require-auth.ts`의 빈 슬롯을 [Lucia](https://lucia-auth.com/) 기반 세션 검증으로 교체한다.

## 1. 언제 이 옵션을 선택하는가

- 라이브러리가 작고 명시적인 API를 원할 때.
- 세션 저장소를 직접 통제하고 싶을 때(Prisma adapter 사용 가능).
- OAuth는 별도 패키지(`arctic`)로 조립하는 방식을 선호할 때.

## 2. 의존성 설치

```bash
npm i -w api lucia @lucia-auth/adapter-prisma
```

버전은 latest stable.

## 3. 환경변수 추가

`.env.example` / `.env`:

```
SESSION_COOKIE_NAME=session
SESSION_COOKIE_DOMAIN=localhost
```

`apps/api/src/config/env.ts`에 `str({ default: "session" })` 등으로 등록.

## 4. require-auth.ts 교체

```typescript
import type { RequestHandler } from "express";
import { AppError } from "../errors/app-error";
import { ERROR_CODES } from "../errors/error-codes";
import { lucia } from "../lib/lucia"; // 새로 추가하는 lucia 인스턴스

export const requireAuth: RequestHandler = async (request, _response, next) => {
  try {
    const sessionId = lucia.readSessionCookie(request.headers.cookie ?? "");
    if (!sessionId) {
      throw new AppError("인증이 필요합니다.", 401, ERROR_CODES.UNAUTHORIZED);
    }

    const { user, session } = await lucia.validateSession(sessionId);
    if (!session) {
      throw new AppError("세션이 만료되었습니다.", 401, ERROR_CODES.SESSION_EXPIRED);
    }

    request.context = {
      ...(request.context ?? {}),
      auth: {
        user: { id: user.id, email: user.email },
        session: { id: session.id, userId: user.id, expiresAt: session.expiresAt.toISOString() },
      },
    };
    next();
  } catch (error) {
    next(error);
  }
};
```

## 5. 테스트 추가 가이드

- 단위: `lucia.validateSession`을 mock 처리. mock 최대 2개. (1) 세션 유효 (2) 만료 (3) 쿠키 누락.
- 통합: `Cookie: session=...` 헤더와 함께 Supertest 호출. CSRF 토큰 검증 흐름은 본 미들웨어 외부에서 다룬다.

## 6. 알려진 한계

- Lucia v3는 OAuth provider helper를 자체 제공하지 않는다 — `arctic` 별도 도입 필요.
- 세션 갱신(rolling expiry)은 응답 직전 set-cookie 처리가 필요하므로 별도 응답 미들웨어를 추가해야 한다.
