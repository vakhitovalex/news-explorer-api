const NotFoundError = require('../middleware/errors/not-found-err');
const BadRequestError = require('../middleware/errors/bad-request-err');
const ForbiddenError = require('../middleware/errors/forbidden-err');
const Article = require('../models/article');
// returns all articles saved by the user
// GET /articles
function getArtciles(req, res, next) {
  return Article.find({})
    .populate('user')
    .then((articles) => {
      if (!articles) {
        throw new Error('Articles not found');
      }
      res.status(200).send(articles);
    })
    .catch(next);
}

// creates an article with the passed
// keyword, title, text, date, source, link, and image in the body
// POST /articles
function createArticle(req, res, next) {
  const { keyword, title, text, date, source, link, image } = req.body;
  return Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((article) => {
      if (!article) {
        throw new BadRequestError(
          'Please put correct name and link for the article',
        );
      }
      res.status(201).send(article);
    })
    .catch(next);
}

//  deletes the stored article by _id
// DELETE /articles/articleId
function deleteArticle(req, res, next) {
  Article.findById(req.params.articleId)
    .select('+owner')
    .then((article) => {
      if (!article) {
        throw new NotFoundError('Article was not found :(');
      } else if (article.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Forbidden action, this is not your article');
      } else {
        Article.findByIdAndRemove(req.params.articleId).then(() => {
          res.status(200).send(article);
        });
      }
    })
    .catch(next);
}

module.exports = {
  getArtciles,
  createArticle,
  deleteArticle,
};
