const jwt = require('jsonwebtoken');
const UnauthorizedError = require('./errors/unauthorized-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('User is not authorized');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'alexdev-secret',
    );
  } catch (err) {
    throw new UnauthorizedError('User is not authorized');
  }
  req.user = payload;
  next();
};
