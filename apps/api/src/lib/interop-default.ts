// 일부 ESM 패키지(cors·express·helmet·express-rate-limit)는 package.json `exports`
// 필드의 `types` 조건이 누락되거나 비어 있어, 환경에 따라(특히 Vercel @vercel/node 의
// TypeScript 6 자동 컴파일) default export 시그니처가 누락된 형태로 추론된다.
// 런타임에서는 CJS 빌드가 `module.exports = exports.default` 패턴을 갖거나
// default 와 module 객체가 동일하므로, namespace import 후 default 를 안전하게 꺼내면
// 어떤 빌더에서도 호출 가능한 함수를 얻을 수 있다.
export function interopDefault<TFn>(mod: unknown): TFn {
  const candidate = (mod as { default?: unknown }).default ?? mod;
  return candidate as TFn;
}
