---
name: architecture-guard
description: scalable-monorepo-starter의 8가지 아키텍처 불변 규칙 + shadcn 마이그레이션 보강 가드(배럴 export, cn 사용, prop mutation)를 정적 스캔으로 검증하는 스킬. 아키텍처 검증, 레이어 위반 확인, 불변 규칙 스캔, SQL 격리 점검, @/ 별칭 검증, Tailwind 하드코딩 탐지, shadcn 배럴 누락 확인, 모듈 완료 후 가드, QA 직전 가드 시 반드시 사용. "아키텍처 검증해줘", "레이어 위반 찾아줘", "불변 규칙 확인", "가드 돌려줘", "하드코딩 체크" 같은 표현에 트리거된다.
---

# architecture-guard

## 목적

shadcn 마이그레이션 후 shared-types 경계·@/ 별칭·Tailwind 토큰 규칙 위반이 코드베이스에 스며들기 쉽다. 이 스킬은 런타임 이전에 정적 스캔만으로 위반을 탐지하고, 수정은 개발자에게 위임한다. 위반 탐지는 `.claude/rules/monorepo-invariants.md`의 단일 사실 출처를 따른다.

## 언제 실행하는가

- **모듈 완료 직후** (점진적): 개발자가 태스크 완료 보고 시, 변경된 파일셋에 한정해 scope=`module`
- **QA 직전** (전면): 전체 QA 진입 시 전체 워크스페이스 scope=`full`

## 스캔 체크리스트

### 1. 앱 간 직접 import 금지

```bash
# apps/web 에서 apps/api 참조
Grep pattern: from\s+['"]\.\.\/\.\.\/api
Grep pattern: from\s+['"]@\/\.\.\/api

# apps/api 에서 apps/web 참조
Grep pattern: from\s+['"]\.\.\/\.\.\/web
```

**P0 — 발견 시 즉시 차단.** 공유는 `packages/*` 경유.

#### 정적 자산 dev 서버 매핑 화이트리스트 (R-FF-10 완화)

다음 패턴은 ts/tsx 의 `import` 문이 아닌 도구 설정의 정적 자산 매핑이며, 본 #1 규칙의 "앱 간 직접 import 금지" 검사에서 제외한다 (false positive 차단):

| 도구 | 파일 | 패턴 |
| --- | --- | --- |
| Storybook | `apps/storybook/.storybook/main.ts` | `staticDirs: [...]` |
| Vite | `apps/*/vite.config.ts` | `publicDir` |
| Next.js | `next.config.js` / `next.config.ts` | `assetPrefix` / `publicDir` |

조건: SSOT (`apps/web/public/` 등) 를 유지하며 도구가 동일 자산을 dev 서버에 노출하는 경우에 한해 허용. FE/BE 빌드 의존성에 영향을 주지 않는다.

본 화이트리스트는 `.claude/rules/monorepo-invariants.md` §1 의 예외 단락과 동일 의미이며, **양쪽이 동기화된 상태로 유지되어야 한다** (룰: 인간 가독 / 스킬: 자동 스캔). 동기화 검증:

```bash
# 양쪽 파일에 staticDirs 키워드가 모두 존재해야 함
grep -c "staticDirs" .claude/rules/monorepo-invariants.md  # ≥ 1
grep -c "staticDirs" .claude/skills/architecture-guard/SKILL.md  # ≥ 1
```

### 2. shared-types 런타임 코드 금지

```bash
path: packages/shared-types/src/**/*.ts
Grep pattern: ^(export\s+)?(const|class|function|let|var)\s
Grep pattern: from\s+['"]zod['"]
```

**P0** — 타입(`type`, `interface`) 외 코드 발견 시. import만 `type` 키워드 없이 사용한 건도 P1.

### 3. SQL 격리

```bash
path: apps/api/src/controllers/**/*.ts, apps/api/src/services/**/*.ts
Grep pattern: prisma\.
Grep pattern: \$queryRaw
Grep pattern: \$executeRaw
Grep pattern: (SELECT|INSERT|UPDATE|DELETE)\s+(?!.*--)[A-Z]
```

**P0** — Repository 경유로 이동 필요.

### 4. 파라미터화 쿼리 필수

```bash
path: apps/api/**/*.ts
Grep pattern: \$queryRawUnsafe
Grep pattern: \$executeRawUnsafe
```

**P0** — 존재 자체가 SQL Injection 리스크.

### 5. 마이그레이션 파일 불변

```bash
Bash: git diff --name-status HEAD~1 -- apps/api/prisma/migrations/
# 상태 M(modified)인 기존 migration.sql 있으면 위반
# 상태 A(added)로 신규 디렉터리만 허용
```

**P0** — 기존 파일 수정 감지 시 즉시 되돌리기 요청.

### 6. `@/` 별칭 필수 (apps/web)

```bash
path: apps/web/src/**/*.{ts,tsx}
Grep pattern: from\s+['"]\.\.\/
# (from "./" 는 허용, from "../"만 위반)
```

**P1** — 같은 디렉터리 내 `./`는 예외.

### 7. TDD 준수 (테스트 존재 확인)

```bash
# 신규 파일 탐지
Bash: git diff --name-only HEAD~1 -- apps/web/src apps/api/src packages/ui/src
# 각 신규 .ts/.tsx가 대응 테스트 파일을 가지는지 확인
# - apps/web: tests/unit/**/<name>.test.*
# - apps/api: test/unit/**/<name>.test.ts
# - packages/ui: tests/**/<name>.test.tsx
```

**P1** — 없으면 위반 보고. tdd-guide에 재안내.

### 8. Tailwind 하드코딩 금지

```bash
path: apps/web/**/*.{ts,tsx}, packages/ui/**/*.{ts,tsx}
Grep pattern: className=['"][^'"]*\[#[0-9a-fA-F]
Grep pattern: className=['"][^'"]*\[(\d+)(px|rem|em)\]
Grep pattern: className=['"][^'"]*bg-\[
Grep pattern: className=['"][^'"]*text-\[(?!var)
```

**P1** — 하드코딩 제거, 필요 시 @theme 토큰 추가 요청.

### 9. packages/ui 배럴 export 검증 (shadcn 보강)

```bash
# 신규 디렉터리
Bash: git diff --name-only HEAD~1 -- packages/ui/src/components/
# 각 <Name>/ 디렉터리가 packages/ui/src/index.ts에 re-export 있는지 확인
Grep pattern: from\s+['"]\.\/components\/<Name>
```

**P1** — 누락 시 index.ts 갱신 요청.

### 10. cn 유틸 사용 (shadcn 보강)

```bash
path: packages/ui/src/components/**/*.tsx
# 조건부 className(삼항·&& 등)을 사용하는데 cn( 호출이 없는 경우
Grep pattern: className=\{[^}]*(\?|&&)[^}]*\}
# cn 사용 확인
Grep pattern: cn\(
```

**P2** — 명시적 권고.

### 11. React 단방향 데이터 흐름 (shadcn 보강)

```bash
path: apps/web/src/view/**/*.{ts,tsx}, packages/ui/src/components/**/*.tsx
Grep pattern: props\.[a-zA-Z_]+\s*=\s
```

**P1** — prop mutation은 위반.

## 리포트 템플릿

```markdown
# Architecture Guard Report — {slug} — {YYYY-MM-DD HH:MM}

## 메타
- Scope: {module|full}
- 대상 파일: {count}
- 기준 룰셋: .claude/rules/monorepo-invariants.md (+ shadcn 보강 3종)

## 결과 요약
| 심각도 | 건수 |
| ---- | ---- |
| P0 | N |
| P1 | N |
| P2 | N |

## 위반 상세
### [P0] 규칙 3: SQL 격리
- `apps/api/src/services/user.service.ts:42` — `prisma.user.findMany(...)` 호출 발견
- 수정 가이드: `repositories/user.repository.ts`로 쿼리 이동, 서비스는 리포지토리 주입받아 호출

### [P1] 규칙 6: @/ 별칭
- `apps/web/src/view/Home/index.tsx:5` — `from "../../components/Button"`
- 수정 가이드: `from "@/components/Button"`로 치환

## 다음 액션
- P0/P1 위반: 해당 워크스페이스 개발자에게 위임
- P2: 백로그 기록
```

위반 0건이면 `## 결과: PASS` 섹션만 남긴다.

## 스킬-에이전트 연결

- 호출 주체: `architecture-guard` 에이전트
- 호출 시점: 모듈 완료 직후 / 전체 QA 진입 직전

## 체크리스트

- [ ] Grep·Bash만 사용, 코드 수정 금지
- [ ] 8 불변 + shadcn 보강 3종 모두 스캔
- [ ] P0/P1/P2 분류 명시
- [ ] 위반은 본 스킬에서 직접 수정하지 않고 호출자(또는 사용자)에 보고
- [ ] arch-guard.md append (덮어쓰기 금지)
- [ ] PASS 시에도 리포트 생성 (감사 추적)
