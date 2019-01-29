const Page = require('./helpers/page');

//page will be an instance of our custom Page class that combines
//custom methods with puppetteer browser and page objects
let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  await page.close();
});

test('the header has the correct text', async () => {
  //format needed to communicate with chromium browser from puppeteer to
  // select some element and return that element (or a piece of it)

  // old version: const text = await page.$eval('a.brand-logo', el => el.innerHTML);
  const text = await page.getContentsOf('a.brand-logo');

  expect(text).toEqual('Blogster');
});

test('clicking login starts oauth flow', async () => {
  await page.click('.right a');
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed in , shows logout button', async () => {
  //page.login() is a custom method that handles logining in to our app
  await page.login();
  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
  expect(text).toEqual('Logout');
});
