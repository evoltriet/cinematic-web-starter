import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { AccessibleAccordion, AccessibleTabs, ActiveSectionNav, CeremonialGate, InkRevealText, MotionProvider, TriggeredPassage } from ".";

describe("Cinematic framework", () => {
  it("opens, restores focus, replays, and skips the ceremonial gate", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const target = createRef<HTMLHeadingElement>();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<MotionProvider><CeremonialGate focusTargetRef={target} openingDuration={50}>{({ replay }) => <main><h1 ref={target} tabIndex={-1}>Story</h1><button onClick={replay}>Replay</button></main>}</CeremonialGate></MotionProvider>);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(document.documentElement.style.overflow).toBe("hidden");
    await user.click(screen.getByRole("button", { name: "Enter the story" }));
    await act(async () => vi.advanceTimersByTime(60));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(target.current).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Replay" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Skip opening" }));
    await act(async () => vi.advanceTimersByTime(400));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    vi.useRealTimers();
  });

  it("keeps ink text semantic while splitting visual words", () => {
    const { container } = render(<InkRevealText lines={["Make the", "story move"]} />);
    expect(screen.getByLabelText("Make the story move")).toBeInTheDocument();
    expect(container.querySelectorAll(".ink-word")).toHaveLength(4);
    expect(container.querySelector(".sr-only")).toHaveTextContent("Make the story move");
  });

  it("renders triggered content from intersection state", () => {
    render(<TriggeredPassage>{(playing, reduced) => <span>{`${playing}:${reduced}`}</span>}</TriggeredPassage>);
    expect(screen.getByText("true:false")).toBeInTheDocument();
  });

  it("supports arrow-key tabs and accordion disclosure", async () => {
    const user = userEvent.setup();
    render(<><AccessibleTabs label="Principles" items={[{ id: "one", label: "One", content: "First" }, { id: "two", label: "Two", content: "Second" }]} /><AccessibleAccordion items={[{ title: "Question", content: "Answer" }]} /></>);
    const first = screen.getByRole("tab", { name: "One" });
    first.focus(); await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Second");
    await user.click(screen.getByRole("button", { name: "Question" }));
    expect(screen.getByText("Answer").parentElement).toHaveAttribute("hidden");
  });

  it("marks an intersecting navigation section active", async () => {
    document.body.innerHTML = '<section id="alpha"></section><section id="beta"></section>';
    const host = document.createElement("div"); document.body.append(host);
    render(<ActiveSectionNav items={[{ id: "alpha", label: "Alpha" }, { id: "beta", label: "Beta" }]} />, { container: host });
    await waitFor(() => expect(screen.getByRole("link", { name: "Beta" })).toHaveAttribute("aria-current", "location"));
  });
});
