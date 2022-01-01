const Article = require('../models/article');
const NotFoundError = require('../errors/not_found');
const InvalidData = require('../errors/invalid_data');
const DeleteNotYourArticle = require('../errors/delete_not_your_article');

module.exports.permissionArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .orFail()
    .populate('owner')
    .then((article) => {
      if (article.owner._id.toString() === req.user._id) {
        next();
      } else {
        throw new DeleteNotYourArticle('Your not the Onwer of this Article');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new InvalidData('Invalid data passed to the methods');
      }
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('There is no Article with the requested ID');
      } else {
        next(err);
      }
    })
    .catch(next);
};
