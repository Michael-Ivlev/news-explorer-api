const articleRouter = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const validator = require('validator');
const {
  createArticle,
  removeArticleById,
  getAllUserArticles,
} = require('../controllers/article');
const auth = require('../middlewares/auth');
const { permissionArticle } = require('../middlewares/permissions');

// custom Url celebrate validator
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

articleRouter.post(
  '/articles',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      link: Joi.string().required().custom(validateURL),
      image: Joi.string().required().custom(validateURL),
    }),
  }),
  auth,
  createArticle,
);

articleRouter.delete(
  '/articles/:articleId',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      articleId: Joi.string().alphanum().required(),
    }),
  }),
  auth,
  permissionArticle,
  removeArticleById,
);

articleRouter.get('/articles', auth, getAllUserArticles);

module.exports = articleRouter;
