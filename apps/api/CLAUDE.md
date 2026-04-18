# apps/api

Express + Prisma + PostgreSQL 백엔드 (port 4000). 레이어드 아키텍처 엄격 준수.

## 레이어드 흐름

```
Route → (validateRequest) → Controller → Service → Repository → Prisma Client
                                                     ↑
                                            모든 SQL은 여기에만
```

각 레이어 책임·금지 사항은 해당 디렉터리의 `CLAUDE.md` 참조.

## 디렉터리 역할

| 디렉터리 | 역할 |
| --- | --- |
| `src/app.ts` | Express app 조립 (미들웨어·라우터 마운트) |
| `src/index.ts` | 진입점 (서버 구동) |
| `src/config/` | `env.ts` (envalid 환경변수 검증), `app.ts` (앱 메타) |
| `src/controllers/` | HTTP 요청 파싱 → Service 호출 → 응답 (상세: `controllers/CLAUDE.md`) |
| `src/services/` | 비즈니스 로직 (상세: `services/CLAUDE.md`) |
| `src/repositories/` | SQL·DB 접근 전담 (상세: `repositories/CLAUDE.md`) |
| `src/routes/` | Express 라우터 조립 + `validateRequest` 미들웨어 |
| `src/schemas/` | Zod 입력 검증 스키마 (`z.infer`로 타입 추출) |
| `src/middlewares/` | `error-handler`, `not-found-handler`, `validate-request` |
| `src/errors/` | `AppError` 클래스 (`statusCode`, `code`, `toApiError()`) |
| `src/lib/` | `prisma.ts` (Prisma Client 싱글턴), `http-response.ts` (`sendSuccess`/`sendError`) |

## 핵심 규칙

- **응답 형식**: `sendSuccess(res, data)` / `sendError(res, apiError, statusCode)` 사용. `res.json()` 직접 호출 금지.
- **에러 throw**: 도메인 에러는 `AppError` 인스턴스로 throw. 글로벌 `error-handler`가 `ApiResponse` 형태로 변환.
- **Zod 검증**: 입력은 반드시 `validateRequest({ query/body/params: schema })` 미들웨어로 검증. 컨트롤러는 `response.locals.validated`에서 꺼내 사용.
- **공유 타입**: `@repo/shared-types`의 `ApiResponse<T>`, `ApiError` 등 사용.
- **SQL 격리**: Controller·Service에 SQL 문자열·Prisma 호출 금지.

## 테스트 경로

- 단위: `test/unit/**/*.test.ts` — Prisma Mock, 서비스 단위 테스트
- 통합: `test/integration/**/*.test.ts` — Supertest + 실제 테스트 DB

## 마이그레이션

- `prisma/migrations/` 내 기존 파일 수정 금지
- 변경 시 `npm run migrate -- --name <description>`으로 새 마이그레이션 생성
