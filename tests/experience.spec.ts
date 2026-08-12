import { expect, test, type Page } from "@playwright/test";

const viewports = [
  { width: 1440, height: 900 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 360, height: 800 },
  { width: 844, height: 390 },
];

async function openExperience(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Skip opening" }).click();
  await expect(page.getByRole("heading", { name: "Make the story move" })).toBeVisible();
}

for (const viewport of viewports) {
  test(`has no overflow and keeps controls usable at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await openExperience(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await page.getByRole("link", { name: "Field notes" }).click();
    await expect(page.getByRole("heading", { name: /strong system/i })).toBeVisible();
    const targetHeight = await page.getByRole("tab", { name: "Motion" }).evaluate((node) => node.getBoundingClientRect().height);
    expect(targetHeight).toBeGreaterThanOrEqual(44);
  });
}

test("supports keyboard opener, tabs, accordion, and replay", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Open the field guide" })).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Open the field guide" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Make the story move" })).toBeFocused();
  await page.getByRole("link", { name: "Field notes" }).click();
  const firstTab = page.getByRole("tab", { name: "Motion" });
  await firstTab.focus(); await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Mobile" })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: /global cinematic scene/i }).click();
  await expect(page.getByText(/couples every chapter/i)).toBeHidden();
  await page.getByRole("button", { name: "Replay opening" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("reduced motion shows complete content without passages", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/");
  await page.getByRole("button", { name: "Open the field guide" }).click();
  await expect(page.getByRole("heading", { name: "Make the story move" })).toBeVisible();
  expect(await page.locator(".demo-leaves i").count()).toBe(0);
  const transform = await page.locator(".horizontal-story-track").evaluate((node) => getComputedStyle(node).transform);
  expect(transform).toBe("none");
  await context.close();
});
