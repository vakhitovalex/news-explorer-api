const express = require('express');
const { celebrate, Joi } = require('celebrate');

const router = express.Router();
const {
  getArtciles,
  createArticle,
  deleteArticle,
} = require('../controllers/articlesController');

router.get('', getArtciles);
router.post(
  '',
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      link: Joi.string().uri().required(),
      image: Joi.string().uri().required(),
    }),
  }),
  createArticle,
);
router.delete(
  '/:articleId',
  celebrate({
    body: Joi.object().keys({
      articleId: Joi.string().hex(),
    }),
  }),
  deleteArticle,
);

module.exports = router;
