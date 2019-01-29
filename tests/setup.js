//set time before just reports a failure in a test (default is 5s or 5000 ms)
jest.setTimeout(30000);

/*
  configures mongoose stuff for use by testing framework.
  Jest configuration in package.json points towards this file so that
  Jest can run it when it first starts up.
*/
require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(
  keys.mongoURI,
  { useMongoClient: true }
);
