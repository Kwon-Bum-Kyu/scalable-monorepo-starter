# Fonts

Brand 폰트는 로컬 `.ttf` 로 동봉되며, `packages/ui/src/styles/globals.css` 가 `@font-face` 로 등록한다. Open Sans 는 CDN 의존이 없다.

## 동봉 패밀리 (Shipped Families)

| Family         | Weights                      | Italic | 매핑 토큰                                | 비고                                    |
| -------------- | ---------------------------- | ------ | ---------------------------------------- | --------------------------------------- |
| **Open Sans**  | 300, 400, 500, 600, 700, 800 | 모든 weight 제공 | `--font-family-sans` (`packages/ui/src/styles/globals.css`) | Primary UI sans. 12 face 모두 로컬 등록. |

Italics 는 모든 weight 에 대해 제공된다.

## CDN 경유 (Google Fonts)

- **Roboto Mono** (400 / 500 / 700) — 코드·숫자·디스플레이 강조 라벨에 사용. 매핑 토큰: `--font-family-mono`. 본 모노레포는 `packages/ui/src/styles/globals.css` 의 `@import url("https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap")` 로 로드한다.

향후 로컬화가 필요하면 `.ttf`/`.woff2` 를 본 디렉터리에 추가하고 `globals.css` 의 `@font-face` 를 확장한다.

## 라이선스

| 패밀리 | 라이선스 | 비고 |
| --- | --- | --- |
| **Open Sans** | SIL Open Font License 1.1 (OFL-1.1) | 상업·배포 가능. 본 README 의 라이선스 명시로 OFL §3 동봉 의무 갈음. 원문: https://openfontlicense.org/ |
| **Roboto Mono** | Apache License 2.0 | Google Fonts 를 통해 자동 라이선싱. 원문: https://www.apache.org/licenses/LICENSE-2.0 |

본 README 는 두 패밀리의 라이선스 단일 출처이며, 별도 `OFL.txt`/`LICENSE-Apache-2.0.txt` 동봉 없이 본 명시로 갈음한다 (Q-FF-C 결정).

## 사용처 정책

- **본문 텍스트**: `font-sans` (Open Sans). 가독성과 OS 폰트 크기 설정 호환.
- **코드/숫자/태그/스케줄 라벨**: `font-mono` (Roboto Mono). Hero 카운터·코드 inline 등.
- **dense / condensed 변형**: 도입하지 않음. Claude Design 측 단일 패밀리 결정 + 코드베이스 사용처 0건 + 디자인 톤 (quiet, technical, engineering-forward) 정합 — 자세한 결정 근거: `font-family-extension` 슬러그 INDEX.

## 비고

- `apps/storybook/.storybook/main.ts` 의 `staticDirs: ["../../web/public"]` 가 동일 자산을 Storybook dev 서버에도 노출한다 (단일 출처 유지).
- 이 디렉터리는 Vite `public/` 정적 서빙 규칙에 따라 `/fonts/<filename>.ttf` 절대경로로 접근 가능.
