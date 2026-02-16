import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { NavigationPage } from '../pages/NavigationPage';
import { PROVIDER } from './provider.config';
import { generateRandomPassword } from '../utils/randomData';

test.describe('PROVIDER PROFILE TESTS', () => {
  test.beforeEach(async ({ page }) => {
    const navigation = new NavigationPage (page);
    const loginPage = new LoginPage(page);
    await navigation.goToLogin();
    await loginPage.login(PROVIDER.email, PROVIDER.password);
    // идём сразу в профиль
 // await navigation.goToProviderProfile('ef5f17d8-b391-4f20-80ed-7dbbb93d9d37')
  await navigation.goToProviderProfile('c0f22134-1a1d-49cf-87c4-e6509109d9de')
  });

  test('PROVIDER-01 | Cannot update email to already registered one', async ({ page }) => {
    // нажимаем "Update"
    const updateButton = page.getByRole('button', { name: "Update" });
    await updateButton.click();
    const modal = page.locator('.ant-modal-content');
    await expect(modal).toBeVisible({ timeout: 7000 });
    await modal.getByPlaceholder('Enter login').fill(PROVIDER.existingEmail);
    await modal.getByPlaceholder('Required when changing password or login').fill(PROVIDER.password);
    await modal.getByRole('button', { name: 'Change' }).click();

    // отобаражается валидационная ошибка под полем email
    const error = modal.locator('#login_help .ant-form-item-explain-error');
    await expect(error).toContainText(/This email is already registered. Please use another one./i);
     // ожидаем уведомление справа
   // const notif = page.getByRole('alert').locator('.ant-notification-notice-description').first();
  //  await expect(notif).toBeVisible({ timeout: 7000 });
   // await expect(notif).toContainText(/Failed to update email: User not updated/i, { timeout: 5000 });
 
  });
    test('PROVIDER-02 | Warning when changing email without current password', async ({ page }) => {
    const randomEmail = `test_${Date.now()}@mail.com`;
    await page.getByRole('button', { name: 'Update' }).click();
    const modal = page.locator('.ant-modal-content');
    await modal.getByPlaceholder('Enter login').fill(randomEmail);
    await modal.getByPlaceholder('Required when changing password or login').fill('');

    await modal.getByRole('button', { name: 'Change' }).click();
   const error = modal.locator('#oldPswd_help .ant-form-item-explain-error');
    await expect(error).toContainText(/Please enter your current password/i);
  });

    test ('PROVIDER-03 | Error when incorrect current password entered', async ({ page }) => {
    const randomPassword = generateRandomPassword(10);
    await page.getByRole('button', { name: 'Update' }).click();
    const modal = page.locator('.ant-modal-content');
    await modal.getByPlaceholder('Enter login').fill(PROVIDER.email);
    await modal.getByPlaceholder('Leave empty to keep current password').fill(randomPassword);
    await modal.getByPlaceholder('Required when changing password or login').fill(randomPassword);
    await modal.getByRole('button', { name: 'Change' }).click();
    const error = modal.locator('#oldPswd_help .ant-form-item-explain-error');
    await expect(error).toContainText(/Incorrect current password./i);

   // const notif = page.getByRole('alert').locator('.ant-notification-notice-description').first();
  //  await expect(notif).toBeVisible({ timeout: 7000 });
   // await expect(notif).toContainText(/Failed to update password/i, { timeout: 5000 }); 
  });

   test ('PROVIDER-04 | Error when incorrect new password entered', async ({ page }) => {
    const randomPassword = generateRandomPassword(10); 
    await page.getByRole('button', { name: 'Update' }).click();
    const modal = page.locator('.ant-modal-content');
   // await modal.getByPlaceholder('Enter login').fill('new_email@gmail.com');
    await modal.getByPlaceholder('Leave empty to keep current password').fill('ShPass');
    await modal.getByPlaceholder('Required when changing password or login').fill(randomPassword);
    await modal.getByRole('button', { name: 'Change' }).click();
    const error = modal.locator('#newPswd_help .ant-form-item-explain-error');
    await expect(error).toContainText(/Password must be 8–25 characters long/i);
   // const notif = page.getByRole('alert').locator('.ant-notification-notice-description').first();
  //await expect(notif).toBeVisible({ timeout: 7000 });
  //await expect(notif).toContainText(/Failed to update password/i, { timeout: 5000 });
  });
  });

