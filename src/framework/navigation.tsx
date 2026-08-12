import { m, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";

export function PageProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 130, damping: 28, mass: 0.24 });
  return <m.div className="page-progress" style={{ scaleX }} aria-hidden="true" />;
}

export type NavItem = { id: string; label: string };

export function ActiveSectionNav({ items, label = "Main navigation" }: { items: NavItem[]; label?: string }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  useEffect(() => {
    const sections = items.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-28% 0px -55%", threshold: [0.01, 0.2, 0.5] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);
  return <nav className="active-section-nav" aria-label={label}>{items.map((item) => <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? "location" : undefined}>{item.label}</a>)}</nav>;
}
