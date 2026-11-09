import { Button, cn, SystemIcon } from "@repo/ui";
import type React from "react";
import { useEffect, useId, useState } from "react";

import type { CodeSegment } from "@/view/home/homeData";

export interface CodeBlockProps {
  segments: ReadonlyArray<CodeSegment>;
}

export default function CodeBlock({ segments }: CodeBlockProps): React.JSX.Element {
  const [copied, setCopied] = useState(false);
  const codeId = useId();

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(segments.map((s) => s.text).join(""));
      setCopied(true);
    } catch {
      // 클립보드 거부·미지원: 상태를 바꾸지 않는다
    }
  };

  return (
    <div className="overflow-hidden rounded-md bg-gray-900 text-gray-50">
      <div className="flex items-center justify-between gap-2 border-b border-gray-700 py-1 pl-4 pr-1">
        <span className="font-mono text-xs tracking-label text-gray-200">
          bash
        </span>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          aria-describedby={codeId}
          className="text-gray-50 tablet:h-8 tablet:px-3 tablet:text-sm focus-visible:ring-system-white focus-visible:ring-offset-gray-900"
          onClick={copy}
        >
          <SystemIcon name={copied ? "check-circle-outline" : "copy"} aria-hidden />
          <span aria-live="polite">{copied ? "복사됨" : "복사"}</span>
        </Button>
      </div>
      <pre
        id={codeId}
        className="overflow-x-auto p-4 text-sm focus-visible:ring-2 focus-visible:ring-system-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
      >
        <code className="font-mono">
          {segments.map((segment, index) => (
            <span
              key={index}
              className={cn(
                segment.isVariable &&
                  "rounded-sm border border-dashed border-gray-300 px-1",
              )}
            >
              {segment.text}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
