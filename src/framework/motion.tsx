import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import type { ReactNode } from "react";

export const EDITORIAL_EASE = [0.22, 1, 0.36, 1] as const;

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.72, ease: EDITORIAL_EASE }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
