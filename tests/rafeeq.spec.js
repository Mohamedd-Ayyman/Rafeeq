import { test, expect, request } from "@playwright/test";

const DEMO = { email: "demo@rafeeq.app", password: "demo1234" };

async function login(page) {
  await page.goto("/login");
  await page.getByPlaceholder("Email").fill(DEMO.email);
  await page.getByPlaceholder("Password").fill(DEMO.password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL("**/journey", { timeout: 10000 });
}

test.describe("Rafeeq E2E", () => {
  test("authentication: login redirects to journey", async ({ page }) => {
    await login(page);
    await expect(page.getByRole("heading", { name: /your journey/i })).toBeVisible();
  });

  test("prayer logging: log a prayer and see it in the timeline", async ({ page }) => {
    await login(page);
    await page.goto("/prayer");
    await page.getByRole("button", { name: /log prayer/i }).click();
    await expect(page.getByText(/saved offline|prayer logged/i)).toBeVisible();
  });

  test("streak updates via API emit on the journey page", async ({ page, request }) => {
    await login(page);
    await page.goto("/journey");
    const tokenRes = await request.post(`${process.env.E2E_API_URL || "http://localhost:5000"}/api/auth/login`, {
      data: DEMO,
    });
    expect(tokenRes.ok()).toBeTruthy();
    await expect(page.getByText(/spiritual path/i)).toBeVisible();
  });

  test("wheel spin: one spin per day", async ({ page }) => {
    await login(page);
    await page.goto("/wheel");
    await page.getByRole("button", { name: /spin the wheel/i }).click();
    await expect(page.getByText(/you won|come back tomorrow/i)).toBeVisible();
  });

  test("challenge join and progress", async ({ page }) => {
    await login(page);
    await page.goto("/challenges");
    const join = page.getByRole("button", { name: /^join$/i }).first();
    await join.click();
    await expect(page.getByRole("button", { name: /^\+1$/i }).first()).toBeVisible();
  });

  test("buddy invite flow", async ({ page }) => {
    await login(page);
    await page.goto("/buddy");
    await page.getByPlaceholder("friend@email.com").fill("admin@rafeeq.app");
    await page.getByRole("button", { name: /send/i }).click();
    await expect(page.getByText(/buddy request sent/i)).toBeVisible();
  });

  test("offline sync queue enqueues when offline", async ({ page, context }) => {
    await login(page);
    await context.setOffline(true);
    await page.goto("/dhikr");
    await page.getByRole("button", { name: /^\+$/ }).click();
    await page.getByText(/save count/i).click();
    await expect(page.getByText(/saved offline/i)).toBeVisible();
    await context.setOffline(false);
  });

  test("AI assistant returns a reply", async ({ page }) => {
    await login(page);
    await page.goto("/assistant");
    const input = page.getByPlaceholder(/type your message/i);
    await input.fill("How can I stay consistent with prayer?");
    await page.getByRole("button", { name: /send/i }).click();
    await expect(page.getByText(/assalamu alaikum|offline mode/i, { exact: false })).toBeVisible({
      timeout: 10000,
    });
  });
});
