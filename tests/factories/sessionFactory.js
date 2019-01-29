const keys = require('../../config/keys');
const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keygrip = new Keygrip([keys.cookieKey]);

//create and return a session object with session and sig
module.exports = user => {
  const sessionObject = {
    passport: {
      user: user._id.toString()
    }
  };

  const session = Buffer.from(JSON.stringify(sessionObject)).toString('base64');

  /*
    Next we will use Keygrip (included with cookie-session) to generate a 
    signature using keys.cookieKey and then use it to create a new sig string
   */

  const sig = keygrip.sign('session=' + session);

  return { session, sig };
};
