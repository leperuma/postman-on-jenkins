import { test, expect, request } from '@playwright/test';

// --- AutomationTest.postman_collection.json ---
test.describe('AutomationTest Collection', () => {
  let proceedToBing = false;

  test('Call Googly', async ({ request }) => {
    // Note: google.com blocks automated requests; this is a placeholder for demo
    const res = await request.get('https://www.google.com/search?q=Cisco+Bangalore');
    const body = await res.text();
    // Check if response contains 'click'
    if (body.includes('click')) {
      proceedToBing = true;
      console.log('click found in Google results.');
    } else {
      proceedToBing = false;
      console.log('click not found in Google results.');
    }
    expect(body).toContain('click');
  });

  test('Call Bingy', async ({ request }) => {
    if (!proceedToBing) {
      test.skip('Skipping Bing request because the condition was not met.');
    }
    const res = await request.get('https://www.bing.com/search?q=Cisco+Bangalore');
    const body = await res.text();
    if (body.includes('bing')) {
      console.log('bing found in Bing results.');
    } else {
      console.log('bing not found in Bing results.');
    }
    expect(body).toContain('bing');
  });
});

// --- IntegrationTestingBasics.postman_collection.json ---
test.describe('Integration Testing Basics Collection', () => {
  const baseUrl = 'https://postman-integration-testing.glitch.me';
  let token = '';

  test('Register', async ({ request }) => {
    const res = await request.post(`${baseUrl}/register`);
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json).toHaveProperty('token');
    expect(typeof json.token).toBe('string');
    token = json.token;
  });

  test('Get name', async ({ request }) => {
    expect(token).not.toBe('');
    const res = await request.get(`${baseUrl}/my-name?token=${token}`);
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json).toHaveProperty('name');
    expect(typeof json.name).toBe('string');
  });

  test('Unregister', async ({ request }) => {
    expect(token).not.toBe('');
    const res = await request.post(`${baseUrl}/unregister`, {
      data: { token },
    });
    expect(res.status()).toBe(200);
  });
});
