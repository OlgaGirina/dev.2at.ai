import { Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput;
  readonly passwordInput;
  readonly signInButton;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder('Enter email');
    this.passwordInput = page.getByPlaceholder('Enter password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
  }

  async login(email: string, password: string) {

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();

    // ожидаем переход после логина
   await this.page.waitForURL(/(client|provider)\/[a-zA-Z0-9-]+\//, { timeout: 10000 });
  }
  async assertLoginFailed() {
    const error = this.page.locator('.ant-form-item-explain-error');
    await expect(error).toBeVisible();
  }
}
