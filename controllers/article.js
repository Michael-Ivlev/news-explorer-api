const Article = require('../models/article');
const User = require('../models/user');
const NotFoundError = require('../errors/not_found');
const InvalidData = require('../errors/invalid_data');
const { invalidDataText, notFoundErrorText } = require('../constants');

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      Article.create({
        keyword,
        title,
        text,
        date,
        source,
        link,
        image,
        owner: user,
      })
        .then((article) => res.send(article))
        .catch((err) => {
          if (err.name === 'ValidationError' || err.name === 'SyntaxError') {
            throw new InvalidData(invalidDataText);
          }
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'SyntaxError') {
        throw new InvalidData(invalidDataText);
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.removeArticleById = (req, res, next) => {
  Article.findByIdAndRemove(req.params.articleId)
    .orFail()
    .then((user) => res.send({ message: `${user._id}has been deleted` }))
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

module.exports.getAllUserArticles = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      Article.find({ owner: user._id })
        .then((article) => { res.send(article); })
        .catch((err) => {
          if (err.name === 'ValidationError' || err.name === 'SyntaxError') {
            throw new InvalidData(invalidDataText);
          }
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'SyntaxError') {
        throw new InvalidData(invalidDataText);
      } else {
        next(err);
      }
    })
    .catch(next);
};
