/** 2열로 세는 코드 포인트 범위(양끝 포함): 한글 자모, CJK와 한글 호환 자모, 한글 음절, 호환 한자, 전각 형태. */
const WIDE_RANGES = [
  [0x1100, 0x115f],
  [0x2e80, 0xa4cf],
  [0xac00, 0xd7a3],
  [0xf900, 0xfaff],
  [0xfe30, 0xfe6f],
  [0xff00, 0xff60],
  [0xffe0, 0xffe6],
];

/** 터미널 열 수를 센다. 한글과 전각 문자는 2열, 나머지는 1열이다.
 * @param {string} text */
export function displayWidth(text) {
  let width = 0;
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0;
    width += WIDE_RANGES.some(([from, to]) => code >= from && code <= to) ? 2 : 1;
  }
  return width;
}
