# create-scalable-monorepo-starter

> 명령 한 줄로 scalable-monorepo-starter 프로젝트를 만든다.
> 필요한 앱만 골라 설치하고, 프로젝트 이름을 반영하고, 의존성 설치와 `git init`까지 끝낸다.

scalable-monorepo-starter는 Turborepo, React 19, Express, Prisma를 쓰는 풀스택 모노레포 템플릿이다. 이 패키지는 그 템플릿을 내려받아 사용자가 고른 앱만 남긴 새 프로젝트를 만든다.

## 사전 준비

| 항목        | 기준                           |
| ----------- | ------------------------------ |
| Node.js     | 22.13.0 이상                   |
| npm         | 10 이상                        |
| 인터넷 연결 | 템플릿을 GitHub에서 내려받는다 |
| Docker      | api 앱을 실행할 때만 필요하다  |

## 사용법

```bash
npm create scalable-monorepo-starter@latest
```

터미널에서 실행하면 질문 세 개에 차례로 답한다.

1. 프로젝트 이름을 입력한다. 영문 소문자, 숫자, 하이픈으로 바꿀 수 있는 이름이어야 한다. 대문자나 공백은 자동으로 바뀌고, 바뀐 이름은 화면에 보여 준다.
2. 설치할 앱을 고른다. 스페이스로 선택하고 엔터로 확정한다. `api`와 `web`이 처음부터 선택되어 있다. `storybook`을 고르면 `web`이 함께 설치된다. `--apps storybook`처럼 플래그로 줄 때도 같은 안내와 함께 `web`이 설치된다.
3. `api`를 골랐다면 예제 코드(Examples CRUD)를 남길지 정한다.

답을 마치면 템플릿을 내려받고, 선택하지 않은 앱을 정리하고, 프로젝트 이름을 반영하고, `.env`를 만들고, 의존성을 설치하고, git 저장소를 만든다. 의존성 설치는 몇 분 걸릴 수 있다.

이름을 미리 정하면 이름 질문을 건너뛴다.

```bash
npm create scalable-monorepo-starter@latest my-app
```

## 완료 후

끝나면 선택한 앱에 해당하는 실행 명령이 화면에 나온다. 다음은 `api`와 `web`을 고른 경우의 예시다.

```
└  완료했습니다.

다음 단계
  cd my-app
  npm run dev:api         http://localhost:4000   Docker가 실행 중이어야 합니다
  npm run dev:web         http://localhost:3000
  npm run dev             선택한 앱을 모두 띄웁니다

문서는 README.md 를 참고해 주세요.
```

`npm run dev` 줄은 앱을 두 개 이상 골랐을 때만 안내한다. 앱을 하나만 골라도 이 스크립트는 프로젝트에 남아 있다. 설치하지 않은 앱의 명령(예: `npm run dev:desktop`)은 만든 프로젝트에 없다. 만들어진 프로젝트 안의 `README.md`에 앱별 안내가 있다.

## 플래그로 한 번에 실행하기

질문 없이 끝까지 실행하려면 플래그를 쓴다. `npm create`로 플래그를 넘길 때는 이름 뒤에 `--`가 필요하다.

```bash
npm create scalable-monorepo-starter@latest my-app -- --apps api,web --yes
```

`npx`로 실행하면 `--`가 필요 없다.

```bash
npx create-scalable-monorepo-starter@latest my-app --apps api,web --yes
```

`--help`로 확인한 인자와 플래그는 다음과 같다.

```
인자와 플래그            의미                        기본값
  [이름]                 프로젝트 이름               없음. 비대화형에서는 필수
  --apps <id,...>        설치할 앱 id 목록           api,web
  --remove-examples      examples 처리               남겨 둔다
  --keep-examples
  --yes                  묻지 않고 기본값으로 진행   꺼짐
  --no-install           npm install 생략            설치한다
  --no-git               git init 생략               만든다
  --dry-run              변경 계획만 출력            꺼짐
  --help, --version      도움말, 버전

선택할 수 있는 앱: api, web, desktop, storybook
```

| 앱 id       | 설명                                        |
| ----------- | ------------------------------------------- |
| `api`       | Express + Prisma + PostgreSQL (Docker 필요) |
| `web`       | React 19 + Vite                             |
| `desktop`   | Electron (web 화면의 사본을 사용)           |
| `storybook` | Storybook 10 (web 필요)                     |

- 앱 id는 콤마로 구분한다. 예: `--apps api,web,desktop`
- `--yes`는 앱과 examples 질문에만 기본값을 적용한다. 이름에는 기본값이 없으므로, 터미널에서 이름 없이 `--yes`를 쓰면 이름 질문만 나온다.
- `--no-install`로 만들면 완료 안내에 `npm install` 줄이 더해진다. 프로젝트 폴더에서 그 명령을 직접 실행한다.
- `--dry-run`은 내려받기와 계획 계산까지만 하고 프로젝트 폴더를 만들지 않는다. 지울 경로와 고칠 파일 목록을 보여 준다.
- `api`를 설치하지 않으면 api를 호출하는 예제 화면은 자동으로 제거된다.
- `--remove-examples`로 예제 코드를 제거하고 `api`가 있으면, 완료 안내에 예제 테이블을 지우는 마이그레이션 명령(`cd apps/api && npm run migrate -- --name drop_examples_table`)이 나온다. 안내대로 한 번 실행한다.

### 터미널이 아닌 환경

CI나 스크립트처럼 입력이나 출력이 터미널이 아닌 환경에서는 질문할 수 없으므로 프로젝트 이름이 반드시 필요하고, `--apps` 또는 `--yes` 중 하나도 있어야 한다. 빠지면 아무것도 만들지 않고 다음 안내를 출력한다.

```
대화형으로 실행할 수 없는 환경입니다.
프로젝트 이름을 지정하고, --apps 를 지정하거나 --yes 를 붙여 주세요.
```

## 버전 고르기

이 패키지의 버전은 템플릿의 버전과 같다. 실행한 CLI의 버전이 곧 내려받는 템플릿의 버전이며, 실행하면 첫 줄에 그 번호가 나온다.

| 하고 싶은 일              | 명령                                                 |
| ------------------------- | ---------------------------------------------------- |
| 가장 최근 버전으로 만들기 | `npm create scalable-monorepo-starter@latest`        |
| 특정 버전으로 만들기      | `npm create scalable-monorepo-starter@1.2.0`         |
| 고를 수 있는 버전 보기    | `npm view create-scalable-monorepo-starter versions` |

- npm에 올라가 있지 않은 버전은 고를 수 없다. 이 패키지가 처음 배포되기 전의 템플릿 버전은 이 명령으로 만들 수 없다.
- 버전 목록은 저장소의 Releases 화면에서도 볼 수 있다.
- 이 패키지를 전역에 설치해 두었다면 버전 없이 실행했을 때 그 사본이 쓰인다. 그래서 명령에 `@latest`를 붙인다.

## 종료 코드와 실패했을 때

| 상황                                                                                   | 종료 코드 |
| -------------------------------------------------------------------------------------- | --------- |
| 정상 완료, `--help`, `--version`, `--dry-run`, git 저장소를 만들지 못해 경고만 한 경우 | 0         |
| 이름이나 플래그가 잘못됨, Node 또는 npm 버전 미달, 내려받기 실패, 설치 실패            | 1         |
| 질문 중이거나 내려받는 중에 Ctrl+C나 Esc로 취소                                        | 130       |
| 설치 중에 취소 (폴더를 남긴다)                                                         | 1         |

- 질문 중이거나 내려받는 중에 취소하면 만든 파일이 없다. 임시 폴더도 지운다.
- 의존성 설치에 실패하면 폴더는 남는다. 안내대로 `cd my-app` 후 `npm install`을 다시 실행한다.
- 프로젝트 이름과 같은 폴더가 이미 있고 비어 있지 않으면 아무것도 덮어쓰지 않고 끝난다.

## 라이선스

[MIT](./LICENSE)
