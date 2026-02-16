import { test, expect, APIRequestContext, BrowserContext } from '@playwright/test';

const API_BASE = 'https://dev.2at.ai';
const CLIENT_USER = {
  email: 'emailtestclient@gmail.com',
  password: 'qwerty123',
  profileUrl: `${API_BASE}/client/103/profile`,
};

async function getAccessToken(request: APIRequestContext, user: { email: string; password: string }) {
  const response = await request.post(`${API_BASE}/auth/basic/login`, {
    data: { email: user.email, password: user.password },
  });
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  console.log('✅ Token received for CLIENT');
  return body.access_token;
}

test.describe('CLIENT PROFILE TESTS', () => {
  let token: string;
  let context: BrowserContext;

  test.beforeAll(async ({ request, browser }) => {
    token = await getAccessToken(request, CLIENT_USER);
    context = await browser.newContext();

    // Добавляем токен как cookie, чтобы сервер воспринимал нас как авторизованных
    await context.addCookies([
      {
        name: 'access_token',
        value: token,
        domain: '2at.ai',
        path: '/',
        httpOnly: false,
        secure: true,
        sameSite: 'Lax',
      },
    ]);

    console.log('🍪 Token cookie added');
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('CLIENT-01 | Cannot save profile with existing company name', async () => {
    const page = await context.newPage();

    // Заходим напрямую в профиль
    await page.goto(CLIENT_USER.profileUrl, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/client\/\d+\/profile/);
    console.log('🟢 Opened client profile successfully');

    // Закрываем попап, если есть
    const closePopup = page.locator('.ant-btn-icon');
    if (await closePopup.isVisible().catch(() => false)) {
      await closePopup.click();
      console.log('ℹ️ Popup closed');
    }

    // Пробуем сохранить профиль
    await page.getByPlaceholder('Company name').fill('ExistingCompany');
    await page.getByRole('button', { name: 'Save changes' }).click();

    const error = page.locator('.ant-form-item-explain-error');
    await expect(error).toContainText(/already exists|already registered/i);
    console.log('⚠️ Validation: company name already exists');
  });
});
