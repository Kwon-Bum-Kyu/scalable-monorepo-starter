# {{displayName}}

홈 화면은 스타터 소개용 예시이므로 교체해 주세요.

## 사전 조건

- Node.js 22.13 이상
- npm 10 이상
- 백엔드 앱을 설치했다면 Docker가 필요합니다. 로컬의 5432 포트를 이미 사용 중이면 데이터베이스 설정을 바꿔 주세요.

## 시작하기

```bash
cd {{npmName}}
npm install
```

## 앱 실행

{{appLines}}

## 주요 명령어

- `npm run build`: 전체 워크스페이스를 빌드합니다.
- `npm run lint`: 전체 워크스페이스의 lint를 검사합니다.
- `npm run typecheck`: 전체 워크스페이스의 타입을 검사합니다.
- `npm run test`: 전체 워크스페이스의 테스트를 실행합니다.

## 환경 변수

루트의 `.env.example`을 복사해 `.env`를 만들고 필요한 값을 채워 주세요.

```bash
cp .env.example .env
```

이 프로젝트는 scalable-monorepo-starter로 생성했습니다. [저장소](https://github.com/Kwon-Bum-Kyu/scalable-monorepo-starter)
