# Backend API Setup & Development Guide

## Prerequisites

- Node.js >= 22.13.0
- PostgreSQL >= 18 (또는 Neon)
- Docker (선택 — 로컬 DB 부트스트랩용)

## Getting Started

### 1. Database Setup

루트에서 `npm run dev` 가 PostgreSQL Docker 컨테이너(`docker-compose.yml`)를 자동으로 띄운 뒤 마이그레이션까지 적용한다. 컨테이너만 별도로 띄우려면:

```bash
docker run --name local-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=myapp \
  -p 5432:5432 \
  -d postgres:18
```

### 2. Environment Variables

루트의 `.env.example` 을 `.env` 로 복사한다.

```bash
cp ../../.env.example ../../.env
# DATABASE_URL 등 필수 값 확인
```

`DATABASE_URL` 예시:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/myapp
```

배포 환경(Vercel·Render 등)에서는 Neon 등의 호스팅 PostgreSQL connection string 을 사용한다.

### 3. Run Migrations

```bash
npm run migrate
```

신규 마이그레이션 생성:

```bash
npm run migrate -- --name <description>
```

### 4. Start Server

```bash
npm run dev
```

기본 포트는 4000. 헬스체크는 `GET /api/health`.

## Architecture

레이어드 아키텍처 + Repository 패턴.

```
Route → (validateRequest) → Controller → Service → Repository → Prisma Client
                                                     ↑
                                            모든 SQL 은 여기에만
```

- **Controllers** (`src/controllers`): HTTP 요청 파싱·응답
- **Services** (`src/services`): 비즈니스 로직
- **Repositories** (`src/repositories`): DB 접근 전담 (Prisma)
- **Routes** (`src/routes`): API 엔드포인트 정의
- **Schemas** (`src/schemas`): Zod 입력 검증 스키마
- **Middlewares** (`src/middlewares`): error-handler·validate-request·rate-limiter 등

상세 규칙은 `src/CLAUDE.md`, `src/services/CLAUDE.md`, `src/repositories/CLAUDE.md` 참조.

## Testing

```bash
npm run test
```

- 단위 테스트: `test/unit/**/*.test.ts` — Prisma Mock 기반
- 통합 테스트: `test/integration/**/*.test.ts` — Supertest + 실제 테스트 DB

루트에서 워크스페이스 단위 실행:

```bash
turbo run test --filter=api
```
