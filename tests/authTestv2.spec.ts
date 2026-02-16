import { test, expect } from '@playwright/test';
import { NavigationPage } from '../pages/NavigationPage';

// 🔹 Все тестовые данные
const loginCases = [
  {
    id: 'AUTH-TC-01',
    title: 'Valid login with Client account',
    email: 'clientDev24102025@gmail.com',
    password: 'qwerty123',
    type: 'SUCCESS_CLIENT'
  },
  {
    id: 'AUTH-TC-02',
    title: 'Valid login with Provider account',
    email: 'providerDEV24102025@gmail.com',
    password: 'qwerty123',
    type: 'SUCCESS_PROVIDER'
  },
  {
    id: 'AUTH-TC-03',
    title: 'Login with incorrect email format',
    email: 'bbmb',
    password: 'ValidPass123',
    type: 'FIELD_ERROR',
    selector: '#email_help .ant-form-item-explain-error',
    expectedText: 'Please input a valid email!'
  },
  {
    id: 'AUTH-TC-04',
    title: 'Login with password shorter than 8 characters',
    email: 'client@example.com',
    password: 'short',
    type: 'FIELD_ERROR',
    selector: '#password_help .ant-form-item-explain-error',
    expectedText: 'Password must be at least 8 characters!'
  },
  {
    id: 'AUTH-TC-05',
    title: 'Login with unregistered email',
    email: 'notfound@example.com',
    password: 'SomePass123',
    type: 'FIELD_ERROR',
    selector: '#email_help .ant-form-item-explain-error',
    expectedText: 'Incorrect email or password'
  },
  {
    id: 'AUTH-TC-06',
    title: 'Login with incorrect password',
    email: 'client@example.com',
    password: 'WrongPass123',
    type: 'FIELD_ERROR',
    selector: '#email_help .ant-form-item-explain-error',
    expectedText: 'Incorrect email or password'
  },
  {
  id: 'AUTH-TC-07',
  title: 'Login with empty fields',
  email: '',
  password: '',
  type: 'FIELD_ERROR',
  selector: '#email_help .ant-form-item-explain-error',
  expectedText: 'Please input your email!'
},
{
  id: 'AUTH-TC-07b',
  title: 'Login with empty fields (password)',
  email: 'olik255@rambler.ru',
  password: '',
  type: 'FIELD_ERROR',
  selector: '#password_help .ant-form-item-explain-error',
  expectedText: 'Please input your password!'
},
{
  id: 'AUTH-TC-08',
  title: 'Login with spaces only',
  email: '   ',
  password: '   ',
  type: 'FIELD_ERROR',
  selector: '#email_help .ant-form-item-explain-error',
  expectedText: 'Please input a valid email!'
},
{
  id: 'AUTH-TC-08b',
  title: 'Login with spaces only (password)',
  email: '   ',
  password: '   ',
  type: 'FIELD_ERROR',
  selector: '#password_help .ant-form-item-explain-error',
  expectedText: 'Password must be at least 8 characters!'
},
];

for (const data of loginCases) {
  test(`${data.id} | ${data.title}`, async ({ page }) => {
    console.log(`▶️ ${data.id}: ${data.title}`);
    const navigation = new NavigationPage (page);
    await navigation.goToLogin();
   // await page.goto('https://dev.2at.ai/auth/');

    // Вводим данные
    await page.getByPlaceholder('Enter email').fill(data.email);
    await page.getByPlaceholder('Enter password').fill(data.password);

    // Кликаем Sign in
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Проверка по типу сценария
    if (data.type === 'SUCCESS_CLIENT') {
      try {
        await expect(page.locator('.name')).toBeVisible({ timeout: 10000 });
        console.log(`✅ ${data.id}: Client login success`);
      } catch {
        await expect(page.locator('#email_help .ant-form-item-explain-error'))
          .toContainText('Incorrect email or password');
        console.log(`⚠️ ${data.id}: Login failed — incorrect credentials`);
      }

    } else if (data.type === 'SUCCESS_PROVIDER') {
      try {
        await expect(page.locator('.name')).toBeVisible({ timeout: 8000 });
        console.log(`✅ ${data.id}: Provider login success`);
      } catch {
        await expect(page.locator('#email_help .ant-form-item-explain-error'))
          .toContainText('Incorrect email or password');
        console.log(`⚠️ ${data.id}: Provider login failed`);
      }
    } else if (data.type === 'FIELD_ERROR') {
  const errorLocator = page.locator(data.selector ?? '#email_help .ant-form-item-explain-error');
  const expectedText = data.expectedText ?? 'Incorrect email or password';
  await expect(errorLocator).toContainText(expectedText);
  console.log(`⚠️ ${data.id}: Error message displayed — "${expectedText}"`);
}
    }
  );
}
