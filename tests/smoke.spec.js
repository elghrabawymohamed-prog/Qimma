const { test, expect } = require('@playwright/test');

const BASE = 'https://elghrabawymohamed-prog.github.io/Qimma';

test('صفحة الهبوط تُفتح بنجاح', async ({ page }) => {
    const resp = await page.goto(BASE + '/');
    expect(resp.ok(), 'صفحة الهبوط لم تُفتح بنجاح').toBeTruthy();
    await expect(page).toHaveTitle(/القمة/);
});

test('صفحة اختيار المسار تُفتح بنجاح', async ({ page }) => {
    const resp = await page.goto(BASE + '/selection.html');
    expect(resp.ok(), 'صفحة اختيار المسار لم تُفتح').toBeTruthy();
});

test('صفحة "قريبًا" تُفتح بنجاح', async ({ page }) => {
    const resp = await page.goto(BASE + '/coming-soon.html');
    expect(resp.ok(), 'صفحة قريبًا لم تُفتح').toBeTruthy();
});

test('صفحة الطالب تُفتح وتعرض نموذج الدخول بلا أخطاء برمجية', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));

    const resp = await page.goto(BASE + '/quimma-platform-v4.html');
    expect(resp.ok(), 'صفحة الطالب لم تُفتح').toBeTruthy();

    await expect(page.locator('#emailInput')).toBeVisible();
    await expect(page.locator('#passwordInput')).toBeVisible();

    expect(errors, 'ظهرت أخطاء برمجية عند تحميل صفحة الطالب: ' + errors.join(' | ')).toEqual([]);
});
