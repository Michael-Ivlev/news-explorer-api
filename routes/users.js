const userRouter = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const { currentUser, login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

userRouter.get('/users/me', auth, currentUser);

userRouter.post(
  '/signin',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);

userRouter.post(
  '/signup',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  createUser,
);

module.exports = userRouter;
