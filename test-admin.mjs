import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log('Console:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('Page Error:', err.message));
  page.on('response', res => {
    if (res.status() >= 400) console.log('HTTP Error:', res.status(), res.url());
  });

  // 1. Test login page loads
  console.log('--- Testing /login ---');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const loginHtml = await page.content();
  console.log('Has "Joviva Admin":', loginHtml.includes('Joviva Admin'));
  console.log('Has "Sign In":', loginHtml.includes('Sign In'));
  console.log('Has login form:', await page.locator('form').count() > 0);

  // 2. Test admin without auth (should redirect to login)
  console.log('\n--- Testing /admin without auth ---');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  console.log('Current URL:', page.url());
  const adminHtml = await page.content();
  console.log('Has "Loading":', adminHtml.includes('Loading'));
  console.log('Has "Redirecting":', adminHtml.includes('Redirecting'));
  console.log('Body text:', await page.locator('body').textContent());

  // 3. Test login + admin flow
  console.log('\n--- Testing login flow ---');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', 'admin@jovivafoods.com');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  console.log('URL after login:', page.url());

  // Try navigating to admin
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  console.log('URL after admin nav:', page.url());
  const adminContent = await page.content();
  console.log('Has "Joviva Admin":', adminContent.includes('Joviva Admin'));
  console.log('Has "Menu":', adminContent.includes('Menu'));
  console.log('Body text:', await page.locator('body').textContent());

  await browser.close();
})();
