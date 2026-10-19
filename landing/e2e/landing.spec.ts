import { test, expect } from "@playwright/test";

test("hero loads with headline, nav and the full chat", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/ShopMaster/);
  await expect(page.locator(".hero-title")).toContainText("one chat");
  // The last chat message (the live store) appears once the chat finishes.
  await expect(page.locator(".store-card")).toBeVisible({ timeout: 15_000 });
  await expect(page.locator(".store-card")).toContainText("tundeskicks.shopmaster.africa");
});

test("replay restarts the chat", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".store-card")).toBeVisible({ timeout: 15_000 });
  await page.locator(".replay").click();
  await expect(page.locator(".store-card")).toBeHidden();
  await expect(page.locator(".store-card")).toBeVisible({ timeout: 15_000 });
});

test("how it works switches the phone screen as you scroll", async ({ page }) => {
  await page.goto("/");
  await page.locator(".step").nth(4).scrollIntoViewIfNeeded();
  for (let i = 0; i < 25; i++) { await page.mouse.wheel(0, 250); await page.waitForTimeout(60); }
  await expect.poll(async () => page.locator(".screen.is-active").getAttribute("data-screen"), { timeout: 8000 }).not.toBe("0");
});

test("join form: validation errors, then success", async ({ page }) => {
  await page.goto("/");
  const form = page.locator(".form");
  await form.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await form.locator(".btn-submit").click();
  await expect(form.locator(".form-error")).toContainText("business name");
  await page.fill("#f-name", "Tunde's Kicks");
  await page.fill("#f-phone", "12");
  await form.locator(".btn-submit").click();
  await expect(form.locator(".form-error")).toContainText("WhatsApp number");
  await page.fill("#f-phone", "+234 801 234 5678");
  await form.locator(".btn-submit").click();
  await expect(form.locator(".form-done")).toBeVisible({ timeout: 5000 });
});

test("no horizontal overflow", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("reduced motion shows everything without the intro", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.locator(".hero-title")).toBeVisible();
  await expect(page.locator(".store-card")).toBeVisible();
  await ctx.close();
});
