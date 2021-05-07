const jwt = require('jsonwebtoken');
// const UnauthorizedError = require('./errors/unauthorized-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Error('User is not authorized');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'alex-key');
  } catch (err) {
    throw new Error('User is not authorized');
  }
  req.user = payload;
  next();
};
