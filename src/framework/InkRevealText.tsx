import type { CSSProperties, ElementType } from "react";

export type InkRevealTextProps = {
  as?: ElementType;
  className?: string;
  cycle?: number;
  duration?: number;
  lines: string[];
};

export function InkRevealText({ as: Tag = "h1", className = "", cycle = 0, duration = 7, lines }: InkRevealTextProps) {
  const words = lines.flatMap((line) => line.trim().split(/\s+/));
  const step = duration / Math.max(words.length + 1, 2);
  let index = 0;
  const semanticText = lines.join(" ");

  return (
    <Tag className={`ink-reveal-text ${className}`} aria-label={semanticText} key={cycle} tabIndex={-1}>
      <span className="sr-only">{semanticText}</span>
      {lines.map((line, lineIndex) => (
        <span className="ink-line" aria-hidden="true" key={`${cycle}-${lineIndex}`}>
          {line.trim().split(/\s+/).map((word) => {
            const wordIndex = index++;
            const style = {
              "--ink-delay": `${wordIndex * step}s`,
              "--ink-duration": `${Math.min(step * 2.25, duration - wordIndex * step)}s`,
            } as CSSProperties;
            return <span className="ink-word" data-word={word} style={style} key={`${word}-${wordIndex}`}>{word}</span>;
          })}
        </span>
      ))}
    </Tag>
  );
}
