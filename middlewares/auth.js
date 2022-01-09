const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth_error');
const { authErrorAuthText } = require('../constants');
const { NODE_ENV, JWT_SECRET } = require('../config');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer', '')) {
    throw new AuthError(authErrorAuthText);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    throw new AuthError(authErrorAuthText);
  }
  req.user = payload;
  return next();
};
