# 개발 문서

이 문서는 `create-scalable-monorepo-starter` 패키지를 고치거나 릴리스하는 메인테이너를 위한 것이다. 사용법은 [README.md](./README.md)에 있다. 이 문서는 npm 패키지에 포함되지 않는다(`package.json`의 `files`에 없다).

## 폴더 구조

```
packages/create-scalable-monorepo-starter/
├── package.json              # name, version, bin, files, engines
├── starter.manifest.json     # 앱, 패키지, 조건부 경로의 목록 (CLI와 setup이 함께 읽는다)
├── src/
│   ├── cli/                  # 사용자가 실행하는 CLI
│   │   ├── index.mjs         # 진입점. 인자 해석, 질문, 내려받기, setup 호출, 설치, 완료 안내
│   │   ├── parseCliArgs.mjs  # 플래그 해석과 FLAG_TABLE (--help의 표가 이 표를 쓴다)
│   │   ├── preflight.mjs     # 질문 전에 판정하는 검증 (Node, npm, 이름, 앱 id)
│   │   ├── prompts.mjs       # 이름, 앱, examples 질문
│   │   ├── fetchTemplate.mjs # 템플릿 내려받기와 개발용 로컬 복사
│   │   ├── runSetup.mjs      # 내려받은 사본 안의 setup 실행
│   │   ├── postSteps.mjs     # npm install, git init
│   │   ├── workDir.mjs       # 임시 폴더 생성, 정리, 대상 폴더로 이름 바꾸기
│   │   ├── help.mjs          # --help 화면
│   │   └── completion.mjs    # 완료 안내
│   └── setup/                # 앱 정리와 이름 반영 (내려받은 템플릿 안에서 실행된다)
│       └── run.mjs           # 저장소 루트의 `npm run setup`도 이 파일을 쓴다
└── tests/
    ├── unit/{cli,setup}/     # 단위 테스트
    ├── integration/          # CLI 전체 흐름과 실패 경로
    ├── consistency/          # 매니페스트, 버전, 배포 필드의 자기 일관성
    └── helpers/
```

CLI와 setup은 같은 `starter.manifest.json`을 읽는다. 앱 목록, 기본 선택, 완료 안내의 명령과 주소는 모두 이 파일에서 나오므로 코드에 앱 이름을 적지 않는다.

## 로컬에서 CLI 실행하기

저장소 루트에서 `npm install`을 한 뒤, 만들 폴더가 생길 곳으로 빈 임시 폴더를 쓴다. 저장소 안에서 실행하면 생성물이 작업 트리에 섞인다.

```bash
cd "$(mktemp -d)"
STARTER_TEMPLATE_DIR=<저장소 경로> node <저장소 경로>/packages/create-scalable-monorepo-starter/src/cli/index.mjs my-app --apps api,web --yes --no-install --no-git
```

`--help`와 `--version`은 환경 변수 없이 실행된다.

### 개발용 환경 변수

사용자용 문서(README, `--help`)에는 싣지 않는다. 쓰면 "CLI 버전과 템플릿 버전이 같다"는 전제가 깨지기 때문이다. 둘 중 하나가 설정되어 있으면 첫 줄 아래에 `개발용 템플릿을 사용합니다: <값>`이 나와 실수로 켜진 것을 알 수 있다.

| 환경 변수                              | 의미                                                     | 쓰는 곳                                           |
| -------------------------------------- | -------------------------------------------------------- | ------------------------------------------------- |
| `STARTER_TEMPLATE_DIR=<경로>`          | 내려받지 않고 로컬 폴더를 복사한다                       | 로컬 개발, CLI 통합 테스트, 조합 검증 워크플로    |
| `STARTER_TEMPLATE_REF=<태그나 브랜치>` | 자기 버전의 태그 대신 지정한 ref를 GitHub에서 내려받는다 | 태그를 올리기 전에 실제 내려받기 경로를 확인할 때 |

`STARTER_TEMPLATE_DIR`의 복사 규칙은 폴더 상태에 따라 다르다.

- 폴더의 루트에 `.git`이 있으면(git 작업 트리) `git ls-files`가 알려 주는 추적 파일만 복사한다. 작업 트리에 있는 `.env`, `*.local.*`, 저장소 밖을 가리키는 symlink 같은 추적하지 않는 파일이 생성물에 들어가지 않게 하려는 것이다. 이런 파일이 들어가면 채워 둔 환경 변수 값이 새 프로젝트로 복사되고, setup의 이름 치환이 symlink를 따라가 저장소 밖의 파일을 고칠 수 있다. 내려받은 tarball에는 추적 파일만 들어 있으므로 이 규칙으로 로컬 복사의 결과가 내려받기의 결과와 같아진다.
- `.git`이 없으면 `node_modules`, `dist`, `dist-ssr`, `.turbo`, `coverage`를 뺀 전부를 복사한다.

따라서 아직 커밋하지 않은 새 파일은 `git add`를 하기 전에는 복사되지 않는다. 로컬에서 시험하다 파일이 빠져 있으면 먼저 이것을 확인한다.

`STARTER_TEMPLATE_DIR`가 있으면 `STARTER_TEMPLATE_REF`는 쓰이지 않는다.

## 테스트와 검증

패키지 폴더에서 실행한다.

```bash
npm run test             # 단위, 통합, 일관성 테스트
npm run test:coverage    # 커버리지 80% 임계 검사 (CI와 같은 명령)
npm run lint             # ESLint (--max-warnings 0)
npm run typecheck        # tsc --noEmit
```

저장소 루트에서 전체를 확인하려면 다음을 쓴다.

```bash
npm run lint
npm run typecheck
npm run test:coverage
```

테스트 규칙은 저장소의 TDD 규칙을 따른다. 테스트 이름은 한국어 행동 중심(`[주체]가 [조건]일 때 [기대 결과]`)으로 쓰고, mock은 외부 경계(네트워크, 파일 시스템, 외부 명령)에만 쓴다. CLI 통합 테스트는 `STARTER_TEMPLATE_DIR`로 가짜 템플릿을 가리켜 네트워크 없이 실행한다.

### 문서와 `--help`를 맞추는 법

README의 플래그 표는 `--help`의 출력과 같은 문구여야 한다. 문구의 출처는 `src/cli/parseCliArgs.mjs`의 `FLAG_TABLE`이고, `--apps`의 기본값과 앱 목록은 매니페스트에서 읽은 값이다. 플래그를 더하거나 문구를 바꾸면 `--help`를 실행해 출력을 README와 대조한다.

```bash
node src/cli/index.mjs --help
```

## 새 앱을 매니페스트로 더하기

예시로 `mobile` 앱을 더한다. 필수 단계는 세 개이고, CLI와 setup의 코드는 고치지 않는다. 새 선택지는 다음 릴리스부터 화면에 나온다.

| 순서 | 파일                                       | 작업                                                                                                                                                                           | 필수 여부   |
| ---- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| 1    | `apps/mobile/`                             | 앱 폴더를 만든다. `package.json`의 `name`은 `mobile`이고 `dev`, `build`, `lint`, `typecheck`, `test` 스크립트를 둔다. 사전 준비가 필요하면 `apps/mobile/turbo.json`에 선언한다 | 필수        |
| 2    | `starter.manifest.json`                    | `apps`에 mobile 항목을 추가한다(`id`, `label`, `hint`, `dir`, `default`, `requires`, `packages`, `rootScripts`, `paths`, `dev`)                                                | 필수        |
| 3    | 루트 `package.json`                        | `"dev:mobile": "turbo run dev --filter=mobile"`을 추가한다                                                                                                                     | 필수        |
| 4    | 루트 `CLAUDE.md`                           | 워크스페이스 표에 한 행을 마커와 함께 추가한다                                                                                                                                 | 권장        |
| 5    | `.github/workflows/template-combos.yml`    | PR 조합 목록에 mobile 한 줄을 추가한다                                                                                                                                         | 권장        |
| 6    | `.env.example`, `.github/workflows/ci.yml` | mobile 전용 환경 변수나 CI 단계가 있을 때만 `APP:mobile` 마커 블록으로 추가한다                                                                                                | 해당할 때만 |

- 2단계를 빠뜨리면 일관성 테스트가 실패하므로 등록 누락을 CI가 잡는다.
- 새 앱의 `default`는 `false`로 둔다. 기본으로 선택되는 앱이 늘면 기본 설치가 무거워지고 완료 안내도 길어진다.
- 브라우저 주소가 없는 앱은 `dev.url`을 `null`로 두고 `dev.note`에 주소 자리에 보일 한 줄을 적는다. 사전 조건이 있으면 `dev.prerequisite`에 적는다.
- 생성되는 README의 실행 안내는 매니페스트의 `dev` 값으로 만들어지므로 `src/setup/readme.template.md`는 고치지 않는다.
- 앱 id가 9자를 넘으면 선택 화면의 이름 열과 완료 안내의 명령 열이 함께 넓어진다. 폭은 매니페스트에서 계산하므로 코드를 고칠 필요는 없다. 다만 80열을 넘는 줄이 생기면 일관성 테스트가 실패하므로, 그때는 `hint`나 `dev.prerequisite`의 문구를 줄인다.
- 앱 id를 나열하는 문장(알 수 없는 앱 오류, `--help`의 앱 목록)은 앱이 늘수록 길어진다. 80열을 넘으면 문구를 줄이거나 줄을 나누는 방식을 정한다.
- 추가한 뒤 `--apps mobile`을 포함한 조합으로 CLI를 로컬에서 실행해 폴더와 완료 안내를 확인한다.

## 릴리스 전 확인

### 버전

루트 `package.json`의 `version`, 이 패키지의 `version`, `package-lock.json`의 두 값, git 태그 `vX.Y.Z`는 같은 번호여야 한다. CLI는 자기 `version`에서 받을 태그(`v<version>`)를 계산하므로, 태그가 없는 버전을 배포하면 그 버전의 CLI는 템플릿을 찾지 못해 실패한다. 버전은 저장소 루트에서 한 번에 올린다.

```bash
npm version <새 버전> --no-git-tag-version --workspace=create-scalable-monorepo-starter --include-workspace-root
```

일관성 테스트(`tests/consistency/`)가 세 값이 어긋난 PR을 잡는다.

| 변경 종류                                                                 | 올리는 자리 |
| ------------------------------------------------------------------------- | ----------- |
| 버그 수정, 문서 수정, 의존성 갱신, CLI 문구 수정                          | 수(patch)   |
| 앱 추가, 플래그 추가, 템플릿의 기능 추가                                  | 부(minor)   |
| 플래그 삭제나 의미 변경, 요구 Node 버전 상향, 생성물의 구조를 바꾸는 변경 | 주(major)   |

- 프리릴리스(`1.3.0-rc.1`처럼 하이픈이 든 버전)는 `npm publish --tag next`로 올린다. `--tag`를 빼면 `latest`가 프리릴리스로 옮겨질 수 있다.
- 배포한 버전의 태그는 옮기거나 지우지 않는다. 잘못된 릴리스는 다음 번호로 고친다. npm에 올라가기 전의 태그만 지우고 다시 붙일 수 있다.

### 패키지 내용

```bash
cd packages/create-scalable-monorepo-starter
npm pack --dry-run
```

목록에 `package.json`, `README.md`, `LICENSE`, `starter.manifest.json`, `src/` 아래 파일만 있어야 한다. `DEVELOPMENT.md`, `tests/`, 설정 파일이 들어 있으면 `files` 필드를 확인한다. 실제 배포 직전에는 `npm publish --dry-run`으로 한 번 더 확인한다.

### 로컬 종단 시험

배포본과 같은 형태로 실행해 본다. 저장소 밖의 빈 폴더에서 실행한다.

```bash
cd packages/create-scalable-monorepo-starter && npm pack --pack-destination "$TMPDIR"
cd "$(mktemp -d)"
npx "$TMPDIR"/create-scalable-monorepo-starter-<버전>.tgz smoke-app --apps api --no-install --no-git --yes
ls smoke-app/apps/api/package.json
```

환경 변수 없이 실행하므로 이 시험은 GitHub에서 태그를 실제로 내려받는다. 따라서 태그를 먼저 푸시해 두어야 통과한다. 태그를 올리기 전에는 `STARTER_TEMPLATE_REF=<브랜치>`로 내려받기 경로만 미리 시험할 수 있다.

### 배포 직후

저장소 밖의 폴더에서 확인한다. 저장소 루트의 `.npmrc`가 `prefer-offline=true`라서, 저장소 안에서 실행하면 캐시에 남은 예전 패키지 정보가 쓰여 방금 배포한 버전이 보이지 않을 수 있다.

```bash
cd "$(mktemp -d)"
npm view create-scalable-monorepo-starter dist-tags --prefer-online
npx --prefer-online create-scalable-monorepo-starter@<버전> smoke-app --apps api --no-install --no-git --yes
```

`dist-tags`의 `latest`가 의도한 정식 버전을 가리키는지 확인한다. 옮겨지지 않았다면 다음 명령으로 맞춘다.

```bash
npm dist-tag add create-scalable-monorepo-starter@<정식 버전> latest
```

### 확인 목록

- [ ] 루트, 패키지, lock 파일의 버전이 같고 일관성 테스트가 통과한다
- [ ] `npm run lint`, `npm run typecheck`, `npm run test:coverage`가 통과한다
- [ ] 조합 검증 워크플로(`template-combos.yml`)가 통과한다
- [ ] `npm pack --dry-run`의 파일 목록이 위 범위 안이다
- [ ] 태그 `vX.Y.Z`가 이 버전을 올린 커밋에 붙어 있다
- [ ] 로컬 종단 시험이 통과한다
- [ ] README의 플래그 표가 `--help` 출력과 같다
- [ ] 문서에 이모지와 엠대시가 없다
