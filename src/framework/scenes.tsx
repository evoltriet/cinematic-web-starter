import { AnimatePresence, m, useInView, useReducedMotion, useScroll, useSpring, useTransform, type MotionStyle } from "motion/react";
import { useRef, type ReactNode, type RefObject } from "react";
import { EDITORIAL_EASE } from "./motion";

export function ResponsiveBackdrop({ className = "", desktopSrc, mobileSrc, eager = false, alt = "" }: { className?: string; desktopSrc: string; mobileSrc: string; eager?: boolean; alt?: string }) {
  return (
    <span className={`responsive-backdrop ${className}`} aria-hidden={alt ? undefined : true}>
      <picture>
        <source media="(max-width: 700px)" srcSet={mobileSrc} />
        <img src={desktopSrc} alt={alt} width="1600" height="1000" loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} decoding="async" draggable={false} />
      </picture>
    </span>
  );
}

export function Reveal({ children, className = "", delay = 0, amount = 0.16 }: { children: ReactNode; className?: string; delay?: number; amount?: number }) {
  const reduceMotion = useReducedMotion();
  return <m.div className={className} initial={reduceMotion ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount }} transition={{ duration: 0.8, delay, ease: EDITORIAL_EASE }}>{children}</m.div>;
}

export function DepthScene({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`depth-scene ${className}`} aria-hidden="true">{children}</div>;
}

export function DepthPlane({ children, className = "", style }: { children: ReactNode; className?: string; style?: MotionStyle }) {
  return <m.div className={`depth-plane ${className}`} style={style}>{children}</m.div>;
}

export function TriggeredPassage({ children, className = "", amount = 0.18 }: { children: (playing: boolean, reducedMotion: boolean) => ReactNode; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const playing = useInView(ref, { amount });
  const reducedMotion = Boolean(useReducedMotion());
  return <div ref={ref} className={`triggered-passage ${className}`} aria-hidden="true"><AnimatePresence>{children(playing, reducedMotion)}</AnimatePresence></div>;
}

export function HorizontalStoryTrack({ children, className = "", targetRef, travel = "-66.666%" }: { children: ReactNode; className?: string; targetRef: RefObject<HTMLElement | null>; travel?: string }) {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 105, damping: 30, mass: 0.2 });
  const x = useTransform(smooth, [0, 1], ["0%", travel]);
  return <m.div className={`horizontal-story-track ${className}`} style={reduceMotion ? undefined : { x }}>{children}</m.div>;
}
