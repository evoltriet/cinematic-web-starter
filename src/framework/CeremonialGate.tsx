import { AnimatePresence, m, useReducedMotion } from "motion/react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { EDITORIAL_EASE } from "./motion";

type GateState = "sealed" | "opening" | "hidden";

export type CeremonialGateHandle = {
  replay: () => void;
  skip: () => void;
};

type GateRenderState = {
  cycle: number;
  revealed: boolean;
  replay: () => void;
};

export type CeremonialGateProps = {
  children: (state: GateRenderState) => ReactNode;
  enterLabel?: string;
  focusTargetRef?: RefObject<HTMLElement | null>;
  immediate?: boolean;
  openingDuration?: number;
  recipient?: string;
  title?: string;
};

export const CeremonialGate = forwardRef<CeremonialGateHandle, CeremonialGateProps>(function CeremonialGate(
  {
    children,
    enterLabel = "Enter the story",
    focusTargetRef,
    immediate = false,
    openingDuration = 900,
    recipient = "For curious people",
    title = "Open this experience",
  },
  forwardedRef,
) {
  const reduceMotion = Boolean(useReducedMotion());
  const [state, setState] = useState<GateState>(immediate ? "hidden" : "sealed");
  const [cycle, setCycle] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<number | null>(null);

  const focusContent = () => window.requestAnimationFrame(() => focusTargetRef?.current?.focus({ preventScroll: true }));

  const reveal = (skipAnimation = false) => {
    if (state !== "sealed") return;
    if (skipAnimation || reduceMotion) {
      setState("hidden");
      focusContent();
      return;
    }
    setState("opening");
    timerRef.current = window.setTimeout(() => {
      setState("hidden");
      timerRef.current = null;
      focusContent();
    }, openingDuration);
  };

  const replay = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    window.scrollTo({ top: 0, behavior: "auto" });
    setCycle((value) => value + 1);
    setState("sealed");
  };

  useImperativeHandle(forwardedRef, () => ({ replay, skip: () => reveal(true) }));

  useEffect(() => {
    if (state === "sealed") triggerRef.current?.focus({ preventScroll: true });
  }, [state, cycle]);

  useEffect(() => {
    if (state === "hidden") return;
    const priorOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = priorOverflow; };
  }, [state]);

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);

  const gateActive = state !== "hidden";

  return (
    <>
      <AnimatePresence>
        {gateActive && (
          <m.div
            className={`cinematic-gate is-${state}`}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={false}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.25 }}
          >
            <m.div className="gate-layer gate-layer-left" aria-hidden="true" animate={state === "opening" ? { x: "-106%" } : { x: 0 }} transition={{ duration: openingDuration / 1000, ease: EDITORIAL_EASE }} />
            <m.div className="gate-layer gate-layer-right" aria-hidden="true" animate={state === "opening" ? { x: "106%" } : { x: 0 }} transition={{ duration: openingDuration / 1000, ease: EDITORIAL_EASE }} />
            <button className="gate-skip" type="button" onClick={() => reveal(true)} disabled={state === "opening"}>Skip opening</button>
            <div className="gate-center">
              <m.p animate={{ opacity: state === "opening" ? 0 : 1 }}>{recipient}</m.p>
              <m.button
                ref={triggerRef}
                className="gate-trigger"
                type="button"
                aria-label={enterLabel}
                onClick={() => reveal(false)}
                disabled={state !== "sealed"}
                animate={state === "opening" ? { opacity: 0, scale: 1.08, y: -28, rotateX: -8 } : { opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                whileHover={reduceMotion || state === "opening" ? undefined : { rotateX: -4, rotateY: 4, scale: 1.04 }}
                whileTap={reduceMotion || state === "opening" ? undefined : { scale: 0.97 }}
                transition={{ duration: state === "opening" ? 0.7 : 0.24, ease: EDITORIAL_EASE }}
              >
                <span aria-hidden="true">C</span>
              </m.button>
              <small>{enterLabel}</small>
            </div>
          </m.div>
        )}
      </AnimatePresence>
      <div className="cinematic-content" data-revealed={!gateActive} aria-hidden={gateActive} inert={gateActive ? true : undefined}>
        {children({ cycle, revealed: !gateActive, replay })}
      </div>
    </>
  );
});
