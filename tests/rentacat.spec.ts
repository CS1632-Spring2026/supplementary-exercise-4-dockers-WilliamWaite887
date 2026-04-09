import { test, expect } from '@playwright/test';

var baseURL = 'http://localhost:8080';

test('TEST-CONNECTION', async ({ page }) => {
  await page.goto(baseURL);
});

test.beforeEach(async ({ page}) => {
    await page.goto('https://cs1632.appspot.com/');
    await page.context().addCookies([
        {name: '1', value: 'false', url: 'https://cs1632.appspot.com/'},
        {name: '2', value: 'false', url: 'https://cs1632.appspot.com/'},
        {name: '3', value: 'false', url: 'https://cs1632.appspot.com/'},
    ])
});

test('TEST-1-RESET', async ({ page }) => {
    await page.context().addCookies([
        {name: '1', value: 'true', url: 'https://cs1632.appspot.com/'},
        {name: '2', value: 'true', url: 'https://cs1632.appspot.com/'},
        {name: '3', value: 'true', url: 'https://cs1632.appspot.com/'},
    ])
    await page.getByRole('link', { name: 'Reset' }).click();
    await expect(page.locator('#cat-id1')).toMatchAriaSnapshot(`- listitem: ID 1. Jennyanydots`);
    await expect(page.locator('#cat-id2')).toMatchAriaSnapshot(`- listitem: ID 2. Old Deuteronomy`);
    await expect(page.locator('#cat-id3')).toMatchAriaSnapshot(`- listitem: ID 3. Mistoffelees`);
});

test('TEST-2-CATALOG', async ({ page }) => {
    await expect(page.getByRole('img').nth(1)).toHaveAttribute('src', '/images/cat2.jpg');
});

test('TEST-3-LISTING', async ({ page }) => {
    await page.getByRole('link', { name: 'Catalog' }).click();
    const list = page.locator('#listing').getByRole('listitem');
    await expect(list).toHaveCount(3);
    await expect(list.nth(2)).toHaveText('ID 3. Mistoffelees');
});

test('TEST-4-RENT-A-CAT', async ({ page }) => {
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
    await expect(page.getByRole('button', { name: 'Rent' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Return' })).toBeVisible();

});

test('TEST-5-RENT', async ({ page })=> {
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
    await page.getByRole('textbox', { name: 'Enter the ID of the cat to rent:' }).click();
    await page.getByRole('textbox', { name: 'Enter the ID of the cat to rent:' }).fill('1');
    await page.getByRole('button', { name: 'Rent' }).click();
    await expect(page.locator('#listing').getByRole('listitem').nth(0)).toHaveText('Rented out');
    await expect(page.locator('#listing').getByRole('listitem').nth(1)).toHaveText('ID 2. Old Deuteronomy');
    await expect(page.locator('#listing').getByRole('listitem').nth(2)).toHaveText('ID 3. Mistoffelees');
    await expect(page.locator('#rentResult')).toContainText('Success!');
});

test('TEST-6-RETURN', async ({ page })=> {
    await page.context().addCookies([
        {name: '2', value: 'true', url: 'https://cs1632.appspot.com/'},
        {name: '3', value: 'true', url: 'https://cs1632.appspot.com/'},
    ])
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
    await page.getByRole('textbox', { name: 'Enter the ID of the cat to return:' }).click();
    await page.getByRole('textbox', { name: 'Enter the ID of the cat to return:' }).fill('2');
    await page.getByRole('button', { name: 'Return' }).click();
    await expect(page.locator('#cat-id1')).toContainText('ID 1. Jennyanydots');
    await expect(page.locator('#cat-id2')).toContainText('ID 2. Old Deuteronomy');
    await expect(page.locator('#cat-id3')).toContainText('Rented out');
    await expect(page.locator('#returnResult')).toContainText('Success!');
});

test('TEST-7-FEED-A-CAT', async ({ page }) => {
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    await expect(page.getByRole('button', { name: 'Feed' })).toBeVisible();
});

test('TEST-8-FEED', async ({ page }) => {
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    await page.getByRole('textbox', { name: 'Number of catnips to feed:' }).click();
    await page.getByRole('textbox', { name: 'Number of catnips to feed:' }).fill('6');
    await page.getByRole('button', { name: 'Feed' }).click();
    await expect(page.locator('#feedResult')).toContainText('Nom, nom, nom.', { timeout: 10000 });
});

test('TEST-9-GREET-A-CAT', async ({ page }) => {
    await page.getByRole('link', { name: 'Greet-A-Cat' }).click();
    await expect(page.locator('#greeting')).toHaveText('Meow!Meow!Meow!');
});

test('TEST-10-GREET-A-CAT-WITH-NAME', async ({ page }) => {
    await page.goto('https://cs1632.appspot.com/greet-a-cat/Jennyanydots');
    await expect(page.locator('#greeting')).toHaveText('Meow! from Jennyanydots.');
});

test('TEST-11-FEED-A-CAT-SCREENSHOT', async ({ page }) => {
    await page.context().addCookies([
        {name: '1', value: 'true', url: 'https://cs1632.appspot.com/'},
        {name: '2', value: 'true', url: 'https://cs1632.appspot.com/'},
        {name: '3', value: 'true', url: 'https://cs1632.appspot.com/'},
    ])
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    await expect(page.locator('body')).toHaveScreenshot();
});


// defect tests below here 

test('DEFECT1-FUN-GREET-A-CAT', async ({ page }) => {
    await page.context().addCookies([
        {name: '1', value: 'true', url: 'https://cs1632.appspot.com/'},
        {name: '2', value: 'true', url: 'https://cs1632.appspot.com/'},
    ])
    await page.getByRole('link', { name: 'Greet-A-Cat' }).click();
    await expect(page.locator('#greeting')).toHaveText('Meow!');
});

test('DEFECT2-FUN-GREET-A-CAT-WITH-NAME', async ({ page }) => {
    await page.context().addCookies([
        {name: '1', value: 'true', url: 'https://cs1632.appspot.com/'}
    ])
    await page.goto('https://cs1632.appspot.com/greet-a-cat/Jennyanydots');
    await expect(page.locator('#greeting')).toHaveText('Jennyanydots is not here.');
});

test('DEFECT3-FUN-FEED', async ({ page }) => {
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    await page.getByRole('textbox', { name: 'Number of catnips to feed:' }).click();
    await page.getByRole('textbox', { name: 'Number of catnips to feed:' }).fill('-3');
    await page.getByRole('button', { name: 'Feed' }).click();
    await expect(page.locator('#feedResult')).toContainText('Cat fight!', { timeout: 10000 });
});   