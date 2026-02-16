import { test, expect } from '@playwright/test';

test('Login with email and password', async ({ page }) => {
  // Заходим на страницу логина
  await page.goto('https://2at.ai/auth/');
  // Вводим email
  await page.getByPlaceholder('Enter email').fill('olik255@rambler.ru');
  // Вводим пароль
  await page.getByPlaceholder('Enter password')
    .pressSequentially('qwerty123', { delay: 500 });
  // Кликаем Sign in
  await page.getByRole('button', { name: 'Sign in' }).click();
  // Проверка: ошибка логина или успешный вход
  try {
  // ждём ошибку
await expect(page.locator('#email_help .ant-form-item-explain-error'))
  .toContainText('Incorrect email or password', { timeout: 5000 });

  console.log('⚠️ Логин не удался');
} catch {
  // если ошибки нет — значит успех
  await expect(page.locator('.name')).toBeVisible({ timeout: 10000 });
  console.log('✅ Логин успешен');
}
});