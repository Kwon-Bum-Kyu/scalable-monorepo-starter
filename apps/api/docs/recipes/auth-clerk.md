# Auth 슬롯 — Clerk 레시피

`apps/api/src/middlewares/require-auth.ts`의 빈 슬롯을 [Clerk](https://clerk.com/) 기반 세션 검증으로 교체한다.

## 1. 언제 이 옵션을 선택하는가

- 인증/사용자 관리 자체를 외부 서비스에 위임하고 싶을 때.
- OAuth, 비밀번호, 매직 링크, 패스키 등 다양한 인증 방식을 즉시 사용하고 싶을 때.
- 운영 부담(이메일 전송, 비밀번호 정책 등)을 줄이고 싶을 때.

## 2. 의존성 설치

```bash
npm i -w api @clerk/express
```

버전은 latest stable.

## 3. 환경변수 추가

`.env.example` / `.env`:

```
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

`apps/api/src/config/env.ts`에서 두 키를 `str()`로 검증. 시크릿 노출 주의.

## 4. require-auth.ts 교체

```typescript
import type { RequestHandler } from "express";
import { clerkClient, requireAuth as clerkRequireAuth, getAuth } from "@clerk/express";
import { AppError } from "../errors/app-error";
import { ERROR_CODES } from "../errors/error-codes";

export const requireAuth: RequestHandler = (request, response, next) => {
  return clerkRequireAuth()(request, response, async (error) => {
    if (error) return next(error);
    const { userId, sessionId } = getAuth(request);
    if (!userId || !sessionId) {
      return next(new AppError("인증이 필요합니다.", 401, ERROR_CODES.UNAUTHORIZED));
    }

    const user = await clerkClient.users.getUser(userId);
    request.context = {
      ...(request.context ?? {}),
      auth: {
        user: { id: userId, email: user.primaryEmailAddress?.emailAddress },
        session: { id: sessionId, userId, expiresAt: new Date(user.lastActiveAt ?? Date.now()).toISOString() },
      },
    };
    next();
  });
};
```

`createApp()`에서는 `clerkMiddleware()`를 `app.use`로 먼저 부착해야 `getAuth()`가 동작한다.

## 5. 테스트 추가 가이드

- 단위: `getAuth`만 mock 처리해 (1) 익명 → UNAUTHORIZED, (2) userId 존재 → next. mock 최대 2개.
- 통합: Clerk 테스트 토큰을 발급받아 `Authorization: Bearer ...` 헤더로 호출. CI에서는 `@clerk/testing` 또는 별도 mock router 사용.

## 6. 알려진 한계

- 외부 서비스 의존 — Clerk 다운 시 인증이 정지된다. `/health/ready` 검사에 Clerk ping을 추가하는 것을 검토.
- 사용자 데이터 일부가 Clerk에 저장된다. 자체 DB와 동기화 정책을 별도로 설계해야 한다.
