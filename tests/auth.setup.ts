import { test as setup, expect } from '@playwright/test';
import path from 'path';

const storageStatePath = path.join(__dirname, '../authState.json');

setup('Authenticate and save state', async ({ page }) => {
  await page.goto('https://dev.2at.ai/auth/');

  // Вводим корректные креды
  await page.getByPlaceholder('Enter email').fill('Client241020252@gmail.com');
  await page.getByPlaceholder('Enter password').fill('qwerty123');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Проверяем, что успешно вошли
  await expect(page).toHaveURL(/(client|provider)/);

  // Сохраняем сессию
  await page.context().storageState({ path: storageStatePath });
  console.log(`✅ Auth state saved to ${storageStatePath}`);
});
