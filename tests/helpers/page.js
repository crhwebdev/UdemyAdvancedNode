const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');
/*
   CustomPage wraps the functionality of puppeteer.browser and 
   puppeteer.browser.page together
   It returns a Proxy object that relys calls to methods first to
   the custom methods defined on CustomePage, then to the browser methods
   and then finally to page methods. This allows us to extend the page and browser object
   without directly modifying them
 */

class CustomPage {
  static async build() {
    const browser = await await puppeteer.launch({
      headless: false
    });

    const page = await browser.newPage();

    const customPage = new CustomPage(page);

    //create a proxy object using new es6 proxy class
    return new Proxy(customPage, {
      /*This function will check for a called property
        and look it up first on customPage, then page, and finally on 
        the browser
      */
      get: function(target, property) {
        return target[property] || browser[property] || page[property];
      }
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    /*
      get a new user object from userFactory
      and a new session and sig from sessionFactory
    */

    const user = await userFactory();
    const { session, sig } = sessionFactory(user);

    /* 
      we set the session and session.sig cookies on the chromium browser page
    for our app and refresh the page to get a login
    */
    await this.page.setCookie({ name: 'session', value: session });
    await this.page.setCookie({ name: 'session.sig', value: sig });
    await this.page.goto('localhost:3000/blogs');

    //need to wait a little for tag to appear
    await this.page.waitFor('a[href="/auth/logout"]');
  }

  async getContentsOf(selector) {
    return this.page.$eval(selector, el => el.innerHTML);
  }

  get(path) {
    return this.page.evaluate(_path => {
      return fetch(_path, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json());
    }, path);
  }

  post(path, data) {
    return this.page.evaluate(
      (_path, _data) => {
        return fetch(_path, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(_data)
        }).then(res => res.json());
      },
      path,
      data
    );
  }

  execRequests(actions) {
    //return an array of promises for each action
    return Promise.all(
      actions.map(({ method, path, data }) => {
        return this[method](path, data);
      })
    );
  }
}

module.exports = CustomPage;
