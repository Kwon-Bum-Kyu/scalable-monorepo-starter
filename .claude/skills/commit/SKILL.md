---
name: commit
description: scalable-monorepo-starter 프로젝트의 변경사항을 Conventional Commits 타입별로 분할하여 한국어 메시지로 커밋하는 스킬. `/commit` 슬래시 커맨드로 호출되며, 사용자가 "커밋해줘", "변경사항 커밋", "지금까지 작업 커밋" 등을 요청할 때 사용한다. Claude author나 Co-Authored-By 라인을 절대 포함하지 않는다.
---

# commit

## 목적

현재 워킹 트리의 변경사항을 **Conventional Commits 타입별로 분할**해 **한국어 단문 메시지**로 커밋한다. Claude author/Co-Authored-By 표기는 절대 포함하지 않는다.

## 왜 이렇게 하는가

- **타입별 분할:** 한 커밋에 fix와 feat가 섞이면 릴리스 노트 자동 생성·revert가 깨진다. 타입별로 쪼개면 히스토리를 변경 의도 단위로 읽을 수 있다.
- **한국어 단문:** 팀이 한국어 기반이고, 기존 히스토리(`feat(shared): API 공통 응답 구조 및 시스템 타입 정의` 등)가 이미 이 스타일이다. body를 덧붙이면 짧은 변경에 노이즈가 된다.
- **Claude author 금지:** 커밋 주체는 실제 작성자(git config user.name)여야 한다. 자동화 도구의 attribution은 히스토리 신호를 오염시킨다.

## 메시지 형식

```
<type>: <한국어 설명>
```

- **scope 없음.** `feat: JWT 기반 인증 구현` O, `feat(auth): ...` X
- **body 없음.** 제목 한 줄로 끝낸다
- **마침표 없음**
- **설명은 한국어**, 기술 용어·코드 식별자는 원문 유지 (예: `Prisma`, `useApi`)

### 예시

```
feat: JWT 기반 인증 구현
fix: vercel 배포 시 prisma 인식 실패 수정
refactor: 백엔드 레이어드 아키텍처 도입
docs: 워크스페이스별 CLAUDE.md 추가
chore: .env.example에 DATABASE_URL 기본값 추가
test: user repository 통합 테스트 추가
perf: 홈 화면 초기 로딩 번들 분할
ci: turbo 캐시 키에 node 버전 포함
```

## 타입 분류 기준

| 타입 | 언제 쓰는가 | 대표 변경 |
|------|------------|-----------|
| `feat` | 사용자가 체감하는 새 기능/API 추가 | 새 엔드포인트, 새 컴포넌트, 새 페이지 |
| `fix` | 버그 수정 | 런타임 에러, 잘못된 동작, 빌드/배포 실패 |
| `refactor` | 동작 변경 없는 내부 구조 개선 | 파일 이동, 함수 분리, 네이밍 변경 |
| `docs` | 문서만 변경 | `*.md`, 주석 블록, JSDoc |
| `test` | 테스트 코드만 추가/수정 | `*.test.ts`, `*.spec.ts`, `tests/**` |
| `chore` | 의존성·설정·빌드 도구 등 운영성 변경 | `package.json`, `.gitignore`, `tsconfig` |
| `perf` | 성능 개선 (동작은 동일) | 번들 분할, 쿼리 최적화, 캐시 추가 |
| `ci` | CI 파이프라인 변경 | `.github/workflows/`, turbo 설정 |
| `style` | 포맷팅만 (로직 변화 없음) | prettier, eslint --fix 결과 |

### 판정 원칙

- **한 파일이 여러 타입에 걸치면** 우선순위: `fix` > `feat` > `refactor` > `perf` > `test` > `docs` > `chore` > `ci` > `style`
- **확신이 안 서면** 사용자에게 묻는다. 추측으로 잘못된 타입을 붙이지 않는다.
- `*.md` 파일 변경은 기본 `docs`. 단, 해당 문서가 설정 파일 역할이면 `chore`

## 실행 절차

### 1단계 — 현황 파악

병렬로 실행:

```bash
git status --short
git diff --stat
git diff --cached --stat
```

- untracked / modified / staged 모두 파악
- 파일별 변경량 확인

### 2단계 — 타입별 그룹화

변경 파일들을 타입별로 분류해 사용자에게 계획을 제시한다.

```
변경사항을 다음 3개 커밋으로 분할합니다:

1. docs: 워크스페이스별 CLAUDE.md 추가
   - apps/api/CLAUDE.md
   - apps/web/CLAUDE.md
   - packages/ui/CLAUDE.md
   - packages/shared-types/CLAUDE.md
   - apps/api/src/services/CLAUDE.md
   - apps/api/src/repositories/CLAUDE.md

2. fix: useApi 훅 타입 추론 오류 수정
   - apps/web/src/hooks/useApi.ts

3. chore: vitest 커버리지 임계값 조정
   - packages/vitest-config/base.ts

진행할까요?
```

사용자 승인을 받고 진행한다. 단, 모든 변경이 **단일 타입**에 속하면 확인 없이 바로 단일 커밋으로 진행해도 된다 (단순 작업의 마찰 최소화).

### 3단계 — 커밋 실행

각 타입 그룹에 대해 순서대로:

1. **해당 파일만 스테이징**
   ```bash
   git add <파일1> <파일2> ...
   ```
   - **`git add -A` / `git add .` 절대 금지** — 다른 타입 파일까지 끌려온다
   - 파일명에 공백 있으면 반드시 따옴표

2. **커밋 생성**
   ```bash
   git commit -m "<type>: <한국어 설명>"
   ```
   - **`-m` 한 번만 사용** (body 없음)
   - **`--author` 옵션 금지** — 로컬 git config의 user.name/email을 그대로 사용
   - **`Co-Authored-By:` 라인 금지**
   - **`🤖 Generated with Claude Code` 같은 푸터 금지**
   - **`--amend` 금지** — 항상 새 커밋

3. **검증**
   ```bash
   git log -1 --pretty=format:"%an <%ae>%n%s%n%b"
   ```
   - author가 `KBK` (또는 프로젝트 git user) 인지 확인
   - body에 Claude 관련 문구 없는지 확인

### 4단계 — 마무리

- 모든 커밋 완료 후 `git status`로 작업트리 정리 여부 확인
- 남은 변경이 있으면 왜 남았는지 사용자에게 보고
- **push는 사용자가 명시적으로 요청할 때만** 수행

## 절대 금지 사항

| 금지 | 이유 |
|------|------|
| `Co-Authored-By: Claude <noreply@anthropic.com>` | 사용자가 명시적으로 금지 |
| `🤖 Generated with [Claude Code]...` 푸터 | 위와 동일 |
| `--author "Claude <...>"` 플래그 | author는 git config 기본값 사용 |
| `--amend` | 히스토리 변조. 타입별 분할 목적과 충돌 |
| `--no-verify` | 훅 실패는 원인을 고쳐야 함 |
| `git add -A` / `git add .` | 타입별 분할이 깨짐 |
| body(두 번째 `-m`) 추가 | 사용자가 body 없음으로 지정 |
| scope (`feat(api):`) | 사용자가 scope 없음으로 지정 |
| 영어 커밋 메시지 | 사용자가 한국어로 지정 |
| 이모지 | 프로젝트 룰 (`CLAUDE.md`): "코드·주석·문서에 이모지 금지" |

## 엣지 케이스

### 변경이 전혀 없을 때
커밋하지 않는다. 사용자에게 "변경사항이 없습니다"라고 알린다. 빈 커밋 생성 금지.

### 이미 스테이징된 파일과 미스테이징 파일이 섞여 있을 때
스테이징 상태를 무시하고 파일 전체를 재분류해 타입별로 새로 스테이징한다. 기존 스테이징 의도가 있을 수 있으므로 진행 전 사용자에게 확인.

### 민감 파일 감지 (`.env`, `credentials.*`, `*.pem`, `id_rsa` 등)
즉시 중단하고 사용자에게 경고. `.gitignore` 추가 또는 제외를 제안. 사용자 명시 요청 없이는 커밋하지 않는다.

### 한 파일이 두 가지 의도를 담고 있을 때 (예: 버그 수정 + 리팩토링 혼재)
- 기본: 사용자에게 "이 파일을 어떻게 분류할지" 묻는다
- 필요하면 `git add -p`로 hunk 단위 분할 제안

### pre-commit 훅 실패 시
- 실패 원인(lint, typecheck, 포맷 등)을 그대로 보고
- 자동 수정 가능하면 수정 후 재스테이징·재커밋 (새 커밋, amend 아님)
- 수정 불가면 사용자에게 위임. **절대 `--no-verify`로 우회 금지**

### 커밋 도중 에러 → 일부 커밋만 성공한 상태
- `git status`로 현재 상태 보고
- 이미 성공한 커밋은 그대로 두고, 실패 지점부터 재개
- 자동으로 reset/revert 금지 (사용자 승인 필요)

## 자가 점검 체크리스트

커밋 후 반드시 확인:

- [ ] `git log -1 --format="%an"` 출력이 Claude가 아님
- [ ] 커밋 메시지에 `Co-Authored-By` 문자열 없음
- [ ] 커밋 메시지가 `<type>: <한국어>` 형식
- [ ] 메시지에 이모지·영어 설명·scope 없음
- [ ] body 없음 (제목 한 줄)
- [ ] 각 커밋이 단일 타입만 포함
