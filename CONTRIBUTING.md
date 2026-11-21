# Contributing

이 프로젝트에 기여해주셔서 감사합니다. 본 문서는 개발 환경 셋업, 작업 흐름, 코드 스타일, 커밋·PR 규칙을 정리합니다.

## 개발 환경 셋업

[README.md](./README.md#quickstart) 의 Quickstart 섹션을 따른다.

## 작업 흐름 (TDD 강제)

scalable-monorepo-starter는 **모든 기능 구현·버그 수정에 TDD를 강제한다**.

### Red → Green → Refactor

1. **RED** — 실패하는 테스트를 먼저 작성한다 (행동 기준, 구현 기준 아님).
2. **GREEN** — 테스트를 통과하는 최소 구현을 작성한다 (하드코딩 허용).
3. **REFACTOR** — 테스트가 통과한 상태에서 코드를 정리한다.
4. **삼각측량** — 두 번째 테스트 케이스를 추가해 하드코딩을 제거한다.

상세: [.claude/rules/tdd-korean-bdd.md](./.claude/rules/tdd-korean-bdd.md)

### 한국어 BDD 네이밍

테스트 이름은 한국어 행동 중심 패턴을 따른다.

```typescript
// GOOD
it("상태가 active인 사용자만 반환한다", () => {});
it("disabled 상태이면 클릭할 수 없다", () => {});
it("비밀번호가 8자 미만일 때 저장에 실패한다", () => {});

// BAD
it("repository.findAll을 호출한다", () => {}); // 구현 테스트
it("getUserById 테스트", () => {});             // 모호함
```

### Mock 전략

Classicist — 실제 객체를 최대한 사용. Mock은 외부 경계에만 허용.

| Mock 허용 | Mock 금지 |
| --------- | -------- |
| Prisma Client | 도메인 로직 / 서비스 |
| 외부 HTTP API | 유틸리티 |
| 파일 시스템 | 동일 레이어 모듈 |
| `Date.now()`, 타이머 | DTO / 타입 객체 |

**테스트당 Mock 최대 2개.** 초과 시 책임 분리 리팩토링.

## 변경 불가 규칙 (9가지)

위반 시 PR 반려. 상세는 [.claude/rules/monorepo-invariants.md](./.claude/rules/monorepo-invariants.md).

1. **앱 간 직접 import 금지** — 공유 코드는 `packages/*` 경유
2. **`packages/shared-types`에 런타임 코드 금지** — 순수 타입만
3. **SQL 격리** — Repository 계층에만 위치
4. **파라미터화 쿼리 필수** — Prisma Client 경유
5. **마이그레이션 파일 불변** — 새 마이그레이션 생성
6. **import 경로** — `apps/web` 은 `@/` 별칭 필수
7. **TDD 필수**
8. **Tailwind 테마 변수** — `@theme` 토큰만 사용
9. **파일명 컨벤션** — React 컴포넌트 PascalCase, 훅·유틸 camelCase, API 레이어·shadcn 생성물 kebab-case

## 코드 스타일

- TypeScript: `any` 금지(외부 입력은 `unknown`으로 받고 narrowing)
- 불변성: spread 연산자로 새 객체 생성, in-place 변경 금지
- 입력 검증: Zod 사용 (단, `packages/shared-types` 에는 금지)
- 에러 처리: 모든 레이어에서 명시적 처리, 조용한 swallow 금지
- 프로덕션 코드에 `console.log` 금지 — pino 등 로거 사용
- 코드·주석·문서에 이모지 금지

## 커밋 컨벤션

[Conventional Commits](https://www.conventionalcommits.org/) + 한국어 메시지.

```
<type>: <한국어 설명>
```

**타입:** `feat` · `fix` · `refactor` · `docs` · `test` · `chore` · `perf` · `ci` · `style`

**규칙:**
- scope·body 사용 금지 (단문 한 줄)
- Co-Authored-By 라인 추가 금지
- 이모지 금지
- `--no-verify` 금지 — 훅 실패 시 원인 수정 후 새 커밋

**예시:**
```
feat: 사용자 인증 미들웨어 추가
fix: examples 라우터의 envelope 언래핑 누락 수정
refactor: ApiClient envelope 단일 처리로 정리
docs: README Quickstart 섹션 추가
test: 라운드 3a 컴포넌트 정본 사양 단언 추가
chore: ESLint flat config 마이그레이션
ci: PR 게이트에 typecheck/lint/build/test 추가
```

## Pull Request 절차

### 사전 체크리스트

PR을 열기 전 다음을 모두 통과시킨다.

```bash
npm run typecheck   # 전체 타입 검사
npm run lint        # 전체 ESLint (warning 0 강제)
npm run check:parity  # web 화면 코드와 desktop renderer 사본 일치 검사
npm run test        # 전체 단위/통합 테스트
npm run build       # 전체 빌드
```

E2E (해당 변경 시):

```bash
cd apps/web
npx playwright test --project=chromium
```

### PR 본문

[.github/PULL_REQUEST_TEMPLATE.md](./.github/PULL_REQUEST_TEMPLATE.md) 가 자동으로 들어간다. 다음 항목을 채운다:

1. **변경 요약** — 무엇을 바꿨고 왜 바꿨는가
2. **관련 이슈** — `Closes #123` 등
3. **테스트 방법** — 리뷰어가 검증할 수 있는 절차
4. **체크리스트** — typecheck / lint / test / 9 불변 위반 여부

### 리뷰 기준

- CRITICAL / HIGH 지적은 머지 전 반드시 해결
- MEDIUM은 가능한 범위에서 처리, 후속 이슈로 분리 가능
- LOW는 백로그로 기록

## Issue 작성

[.github/ISSUE_TEMPLATE](./.github/ISSUE_TEMPLATE) 의 템플릿을 사용한다.

- **버그 리포트**: 재현 단계 / 기대 동작 / 실제 동작 / 환경 정보
- **기능 제안**: 목표 / 제안 / 대안 / 영향 범위 (FE/BE/shared)

## 릴리스

첫 배포 이후에는 버전을 올린 PR을 병합하고 그 커밋에 태그를 푸시하면 자동 배포가 진행된다. `<v>`에는 앞에 `v`를 붙이지 않은 버전 번호를 넣는다.

### 버전 정책

| 변경 종류                                                                 | 올리는 자리 |
| ------------------------------------------------------------------------- | ----------- |
| 버그 수정, 문서 수정, 의존성 갱신, CLI 문구 수정                          | 수(patch)   |
| 앱 추가, 플래그 추가, 템플릿의 기능 추가                                  | 부(minor)   |
| 플래그 삭제나 의미 변경, 요구 Node 버전 상향, 생성물의 구조를 바꾸는 변경 | 주(major)   |

프리릴리스는 `1.3.0-rc.1`처럼 하이픈을 넣는다. 자동 배포는 프리릴리스에 `next` 태그를 붙이고 정식 버전에 `latest`를 사용한다.

### 두 번째 배포부터

1. 저장소 루트에서 버전을 올리고 릴리스 PR을 만든다. 이 명령은 루트와 CLI 패키지의 `version`, `package-lock.json`을 함께 바꾼다.

   ```bash
   npm version <v> --no-git-tag-version --workspace=create-scalable-monorepo-starter --include-workspace-root
   git checkout -b chore/release-<v>
   git commit -am "chore: v<v> 릴리스 준비"
   ```

2. PR의 CI가 통과하면 main에 병합한다. 버전이 한쪽만 바뀌면 자기 일관성 테스트가 실패한다.
3. 병합된 main 커밋에 태그를 붙여 푸시한다.

   ```bash
   git checkout main && git pull
   git tag v<v> && git push origin v<v>
   ```

4. GitHub Actions에서 `Release` 실행이 끝까지 성공했는지 확인한다. 워크플로는 다음 단계를 순서대로 실행한다.

| 순서 | 단계                   | 실패하면                               |
| ---- | ---------------------- | -------------------------------------- |
| 1    | 1. 버전 검사           | 아무것도 배포되지 않는다               |
| 2    | 2. 전체 검증           | 아무것도 배포되지 않는다               |
| 3    | 3. 패키지 내용 검사    | 아무것도 배포되지 않는다               |
| 4    | 4. 배포 전 종단 시험   | 아무것도 배포되지 않는다               |
| 5    | 5. npm 배포            | npm에는 올라가지 않고 태그만 남는다    |
| 6    | 6. 배포 직후 연기 시험 | npm에는 올라가고 GitHub Release는 없다 |
| 7    | 7. GitHub Release 생성 | npm 패키지는 정상이고 Release만 없다   |

### trusted publisher 설정

npmjs.com의 패키지 설정에서 GitHub Actions trusted publisher를 등록한다. 소유자는 `Kwon-Bum-Kyu`, 저장소는 `scalable-monorepo-starter`, 워크플로 파일 이름은 확장자를 포함한 `release.yml`이고 환경 이름은 비워 둔다. 값은 대소문자까지 정확해야 하며 CLI 패키지 `package.json`의 `repository.url`도 같은 저장소를 가리켜야 한다. 등록 뒤 2일 안에 첫 자동 배포를 성공해야 하므로 다음 릴리스 PR을 준비한 뒤 등록한다.

배포 job은 Node 24와 npm 11.5.1 이상에서 `id-token: write` 권한으로 실행한다. trusted publishing이 출처 증명을 자동으로 붙이므로 npm 토큰 비밀 값과 `--provenance`는 사용하지 않는다.

자동 배포가 막히면 해당 태그의 커밋을 체크아웃하고 다음 명령으로 손 배포한 뒤 실패한 job을 다시 실행한다.

```bash
npm publish --workspace=create-scalable-monorepo-starter --access public --otp=<코드>
```

프리릴리스 태그를 손 배포할 때는 `--tag next`를 붙인다. 빼면 `latest`가 프리릴리스로 옮겨간다.

### 배포 직후 확인

저장소 루트의 `.npmrc`가 캐시를 우선하므로 저장소 밖의 빈 폴더에서 `--prefer-online`으로 확인한다.

```bash
cd "$(mktemp -d)"
npm view create-scalable-monorepo-starter@<v> version --prefer-online
npx --prefer-online create-scalable-monorepo-starter@<v> smoke-app --apps api --no-install --no-git --yes
test -f smoke-app/apps/api/package.json
```

### 한쪽만 성공했을 때의 복구

| 상태                                                                | 사용자에게 보이는 것                                 | 복구                                                                                                                                                                                                                                             |
| ------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 태그는 있는데 1. 버전 검사에서 멈췄다                               | 변화 없음. `@latest`는 이전 버전이다                 | 태그를 지우고 버전을 맞추는 PR을 병합한 뒤 태그를 다시 붙인다. `git push --delete origin v<v>`와 `git tag -d v<v>`를 사용한다                                                                                                                    |
| 태그는 있는데 2. 전체 검증부터 4. 배포 전 종단 시험 사이에서 멈췄다 | 변화 없음                                            | 일시적 실패면 실패한 job을 다시 실행한다. 코드 문제면 태그를 지우고 고친 커밋에 같은 번호로 다시 붙인다                                                                                                                                          |
| 태그는 있는데 5. npm 배포가 실패했다                                | 변화 없음. 그 버전은 npm에서 실행할 수 없다          | 레지스트리, trusted publisher, npm 버전 문제를 고치고 실패한 job을 다시 실행한다. 바로 고칠 수 없으면 위 손 배포 명령을 실행한 뒤 워크플로를 다시 실행한다                                                                                       |
| npm에 올라갔는데 6. 배포 직후 연기 시험이 실패했다                  | 그 버전이 정식이면 `@latest`로 나가 있다             | 먼저 job을 다시 실행한다. 실제 결함이면 `npm deprecate create-scalable-monorepo-starter@<v> "다음 수정 버전을 사용해 주세요"`로 표시하고 `npm dist-tag add create-scalable-monorepo-starter@<이전 버전> latest`로 되돌린 뒤 새 버전을 릴리스한다 |
| npm에 올라갔는데 7. GitHub Release 생성이 실패했다                  | CLI는 정상 동작하고 Releases 화면에만 그 버전이 없다 | 실패한 job을 다시 실행하거나 `gh release create v<v> --verify-tag --generate-notes`를 직접 실행한다                                                                                                                                              |
| npm에는 있는데 태그가 없다                                          | CLI가 해당 버전의 템플릿을 찾지 못하고 끝난다        | 배포에 쓴 바로 그 커밋에 태그를 붙여 푸시한다                                                                                                                                                                                                    |

npm에 올라가기 전의 태그는 지우고 다시 붙여도 되고 올라간 뒤의 태그는 손대지 않는다.

## 행동 강령

기여자·메인테이너 모두 서로 존중하며 기술적 토론에 집중한다. 인신공격·차별 발언은 금지.
