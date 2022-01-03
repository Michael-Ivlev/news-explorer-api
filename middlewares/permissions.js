const Article = require('../models/article');
const NotFoundError = require('../errors/not_found');
const InvalidData = require('../errors/invalid_data');
const DeleteNotYourArticle = require('../errors/delete_not_your_article');
const { invalidDataText, notFoundErrorText, deleteNotYourArticleText } = require('../constants');

module.exports.permissionArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .orFail()
    .populate('owner')
    .then((article) => {
      if (article.owner._id.toString() === req.user._id) {
        next();
      } else {
        throw new DeleteNotYourArticle(deleteNotYourArticleText);
      }
    })
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
