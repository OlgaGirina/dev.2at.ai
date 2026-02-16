import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { NavigationPage } from '../pages/NavigationPage';
import { CLIENT } from './client.config';

test.describe('CLIENT PROFILE TESTS', () => {
  test.beforeEach(async ({ page }) => {
    const navigation = new NavigationPage (page);
    const loginPage = new LoginPage(page);
    await navigation.goToLogin();
    await loginPage.login(CLIENT.email, CLIENT.password);

    // идём сразу в профиль
    await navigation.goToClientProfile('111')
   // await page.goto(CLIENT.profileUrl, { waitUntil: 'domcontentloaded' });
  });

   test('CLIENT-02 | Cannot update email to already registered one', async ({ page }) => {
   // await page.getByRole('button', { name: 'Close' }).click();
    await page.getByRole('button', { name: 'Update' }).click();
    const modal = page.locator('.ant-modal-content');

    await modal.getByPlaceholder('Enter login').fill(CLIENT.existingEmail);
   // await modal.getByPlaceholder('Leave empty to keep current password').fill('ShPass');
    await modal.getByPlaceholder('Required when changing password or login').fill(CLIENT.password);
    await modal.getByRole('button', { name: 'Change' }).click();
// отобаражается валидационная ошибка под полем email
const error = modal.locator('#login_help .ant-form-item-explain-error');
await expect(error).toContainText(/This email is already registered. Please use another one./i);

     // ожидаем уведомление справа
 // const notif = page.getByRole('alert').locator('.ant-notification-notice-description').first();
 // await expect(notif).toBeVisible({ timeout: 7000 });
 // await expect(notif).toContainText(/Failed to update email: User not updated/i, { timeout: 5000 });

  console.log('⚠️ Validation popup: company name already exists');
  });

   test('CLIENT-03 | Warning when changing email without current password', async ({ page }) => {
   // await page.getByRole('button', { name: 'Close' }).click();
    await page.getByRole('button', { name: 'Update' }).click();
    const modal = page.locator('.ant-modal-content');

     await modal.getByPlaceholder('Enter login').fill('olik2555@rambler.ru');
     await modal.getByPlaceholder('Required when changing password or login').fill('');

     await modal.getByRole('button', { name: 'Change' }).click();
    const error = modal.locator('#oldPswd_help .ant-form-item-explain-error');
    await expect(error).toContainText(/Please enter your current password/i);

  });
    test ('CLIENT-04 | Error when incorrect current password entered', async ({ page }) => {
  //  await page.getByRole('button', { name: 'Close' }).click();
    await page.getByRole('button', { name: 'Update' }).click();
    const modal = page.locator('.ant-modal-content');
    await modal.getByPlaceholder('Enter login').fill(/*'/emailtestclient@gmail.com'*/ CLIENT.email);
    await modal.getByPlaceholder('Leave empty to keep current password').fill('TestNew pass');
    await modal.getByPlaceholder('Required when changing password or login').fill('WrongOldPass');

    await modal.getByRole('button', { name: 'Change' }).click();
    const error = modal.locator('#oldPswd_help .ant-form-item-explain-error');
    await expect(error).toContainText(/Incorrect current password./i);
    //const notif = page.getByRole('alert').locator('.ant-notification-notice-description').first();
  //await expect(notif).toBeVisible({ timeout: 7000 });
  //await expect(notif).toContainText(/Failed to update password/i, { timeout: 5000 });

  });

   test ('CLIENT-05 | Error when incorrect new password entered', async ({ page }) => {
   // await page.getByRole('button', { name: 'Close' }).click();
    await page.getByRole('button', { name: 'Update' }).click();
    const modal = page.locator('.ant-modal-content');

   // await modal.getByPlaceholder('Enter login').fill('new_email@gmail.com');
   await modal.getByPlaceholder('Enter login').fill(CLIENT.email);
    await modal.getByPlaceholder('Leave empty to keep current password').fill('ShPass');
    await modal.getByPlaceholder('Required when changing password or login').fill(CLIENT.password);
    await modal.getByRole('button', { name: 'Change' }).click();

    const error = modal.locator('#newPswd_help .ant-form-item-explain-error');
    await expect(error).toContainText(/Password must be 8–25 characters long/i);
  //  const notif = page.getByRole('alert').locator('.ant-notification-notice-description').first();
  //await expect(notif).toBeVisible({ timeout: 7000 });
 // await expect(notif).toContainText(/Failed to update password/i, { timeout: 5000 });
  });
});