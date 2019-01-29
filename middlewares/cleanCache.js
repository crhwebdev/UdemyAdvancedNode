const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
  //allows route handler to run before executing next
  await next();
  clearHash(req.user.id);
};
