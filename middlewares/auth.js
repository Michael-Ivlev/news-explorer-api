const jwt = require('jsonwebtoken');
const NODE_ENV = require('../config');
const JWT_SECRET = require('../config');
const AuthError = require('../errors/auth_error');
const { authErrorAuthText } = require('../constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer', '')) {
    throw new AuthError(authErrorAuthText);
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {a
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
