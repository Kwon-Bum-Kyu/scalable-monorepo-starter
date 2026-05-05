## 변경 요약

<!-- 무엇을·왜 바꿨는지 1~3 줄로 요약 -->

## 관련 이슈

<!-- 예: Closes #123 / Refs #456 -->

## 변경 유형

- [ ] feat — 새 기능
- [ ] fix — 버그 수정
- [ ] refactor — 리팩토링 (기능 변경 없음)
- [ ] docs — 문서
- [ ] test — 테스트만 추가/수정
- [ ] chore — 빌드·설정·의존성
- [ ] perf — 성능 개선
- [ ] ci — CI 설정
- [ ] style — 포매팅

## 테스트 방법

<!-- 리뷰어가 검증할 수 있는 절차 -->

```bash
# 예시
npm run dev
# http://localhost:3000/examples 접속 후 ...
```

## 체크리스트

- [ ] `npm run typecheck` 통과
- [ ] `npm run lint` (`--max-warnings=0`) 통과
- [ ] `npm run test` 통과
- [ ] `npm run build` 통과
- [ ] (해당 시) Playwright E2E 통과
- [ ] TDD 흐름 준수 (Red → Green → Refactor)
- [ ] 9가지 변경 불가 규칙 위반 없음
- [ ] 커밋 메시지가 Conventional Commits + 한국어 단문

## 스크린샷 / GIF (UI 변경 시)

<!-- before / after -->

## 영향 범위

- [ ] FE (`apps/web`)
- [ ] BE (`apps/api`)
- [ ] 공유 패키지 (`packages/*`)
- [ ] 인프라·CI
- [ ] 마이그레이션 (`apps/api/prisma/migrations/`)

## 추가 메모

<!-- 리뷰어에게 미리 알려두고 싶은 점 -->
