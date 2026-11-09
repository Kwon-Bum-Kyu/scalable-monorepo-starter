import type React from "react";

export interface InlineCodeProps {
  text: string;
}

/** 백틱으로 감싼 구간을 <code className="font-mono whitespace-nowrap">로 렌더한다. 예: "`apps/web`은 `@/` 별칭 필수" */
export default function InlineCode({ text }: InlineCodeProps): React.JSX.Element {
  return (
    <>
      {text.split("`").map((part, index) =>
        index % 2 === 1 ? (
          <code key={index} className="font-mono whitespace-nowrap">
            {part}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}
