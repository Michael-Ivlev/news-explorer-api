const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not_found');
const InvalidData = require('../errors/invalid_data');
const AuthError = require('../errors/auth_error');
const EmailAlreadyExists = require('../errors/email_already_exists');
const {
  invalidDataText, notFoundErrorText, authErrorText, emailAlreadyExistsText,
} = require('../constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.currentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .select('email')
    .select('name')
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new InvalidData(invalidDataText);
      }
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError(notFoundErrorText);
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError(authErrorText);
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new AuthError(authErrorText);
        }
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          {
            expiresIn: '7 days',
          },
        );
        res.send({ token });
      });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
      })
        .then((user) => res.status(201).send({ _id: user._id, email: user.email }))
        .catch((err) => {
          if (err.message.includes('E11000 duplicate key error collection')) {
            throw new EmailAlreadyExists(emailAlreadyExistsText);
          }
          if (err.name === 'ValidationError' || err.name === 'SyntaxError') {
            throw new InvalidData(invalidDataText);
          } else {
            next(err);
          }
        })
        .catch(next);
    })
    .catch(next);
};
