import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { EDITORIAL_EASE } from "./motion";

export type TabItem = { id: string; label: string; content: string };

export function AccessibleTabs({ items, label }: { items: TabItem[]; label: string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduceMotion = useReducedMotion();
  const move = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + items.length) % items.length;
    setActive(next); refs.current[next]?.focus();
  };
  const selected = items[active];
  return (
    <div className="accessible-tabs">
      <div role="tablist" aria-label={label}>{items.map((item, index) => <button key={item.id} ref={(node) => { refs.current[index] = node; }} id={`tab-${item.id}`} role="tab" aria-selected={active === index} aria-controls={`panel-${item.id}`} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => move(event, index)}>{item.label}</button>)}</div>
      <AnimatePresence mode="wait"><m.div key={selected.id} id={`panel-${selected.id}`} role="tabpanel" aria-labelledby={`tab-${selected.id}`} initial={reduceMotion ? false : { opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={reduceMotion ? undefined : { opacity: 0, x: -10 }} transition={{ duration: 0.32, ease: EDITORIAL_EASE }}>{selected.content}</m.div></AnimatePresence>
    </div>
  );
}

export type AccordionItem = { title: string; content: string };

export function AccessibleAccordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const prefix = useId();
  return <div className="accessible-accordion">{items.map((item, index) => { const expanded = open === index; const panelId = `${prefix}-panel-${index}`; return <article key={item.title}><h3><button type="button" aria-expanded={expanded} aria-controls={panelId} onClick={() => setOpen(expanded ? null : index)}><span>{item.title}</span><i aria-hidden="true" /></button></h3><div id={panelId} hidden={!expanded}><p>{item.content}</p></div></article>; })}</div>;
}
