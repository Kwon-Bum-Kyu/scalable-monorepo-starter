# Rate Limit — Redis 레시피

기본 구성은 `express-rate-limit`의 in-memory store를 사용한다. 멀티 인스턴스 배포 또는 영속 카운터가 필요한 경우 Redis 기반 스토어로 교체한다.

## 1. 언제 이 옵션을 선택하는가

- 배포 환경에서 API 인스턴스가 2대 이상으로 확장될 때.
- 슬라이딩 윈도우/세분화된 키(사용자/IP/엔드포인트별) 카운터가 필요할 때.
- 재시작 후에도 한도 카운터를 유지하고 싶을 때.

## 2. 의존성 설치

```bash
npm i -w api rate-limit-redis ioredis
```

버전은 latest stable.

## 3. 환경변수 추가

`.env.example` / `.env`:

```
REDIS_URL=redis://localhost:6379
RATE_LIMIT_PREFIX=rl:
```

`apps/api/src/config/env.ts`의 `cleanEnv` 호출에 `REDIS_URL: str()`, `RATE_LIMIT_PREFIX: str({ default: "rl:" })`를 추가.

## 4. config/rate-limit.ts 교체

새 파일 `apps/api/src/config/rate-limit.ts`로 분리하거나 기존 미들웨어 조립부에서 store만 교체.

```typescript
import { rateLimit } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import IORedis from "ioredis";
import { env } from "./env";
import { AppError } from "../errors/app-error";
import { ERROR_CODES } from "../errors/error-codes";

const redis = new IORedis(env.REDIS_URL, { lazyConnect: true });

export const apiRateLimit = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args) as Promise<unknown>,
    prefix: env.RATE_LIMIT_PREFIX,
  }),
  handler: (_request, _response, next) => {
    next(
      new AppError(
        "요청 한도를 초과했습니다.",
        429,
        ERROR_CODES.RATE_LIMIT_EXCEEDED,
      ),
    );
  },
});
```

`createApp()`에서 `app.use(apiRateLimit)`로 부착.

## 5. 테스트 추가 가이드

- 단위: in-memory store로 동일 함수를 호출하면 충분. Redis 직접 의존 회피를 위해 store만 분리해 inject 하는 구조 권장.
- 통합: testcontainers 또는 docker-compose로 Redis 띄운 뒤 Supertest로 동일 IP에서 한도 + 1회 호출 → 429 + `RATE_LIMIT_EXCEEDED`를 검증.

## 6. 알려진 한계

- Redis 장애 시 무한 허용으로 fail-open 또는 강제 거부로 fail-close 정책을 명시해야 한다 (`rate-limit-redis`는 기본 fail-open).
- 멀티 리전 배포 시 카운터 동기화 지연으로 임시 초과 허용이 발생할 수 있다.
