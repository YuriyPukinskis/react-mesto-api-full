const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  getCardById, postCard, deleteCard, checkCard, getCards,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.get('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().alphanum().required()
      .min(2)
      .max(24),
  }),
}), getCardById);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required()
      .min(2)
      .max(30),
    link: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле "link" должно быть валидным url-адресом');
    })
      .messages({
        'string.required': 'Поле "link" должно быть заполнено',
      }),
  }),
}), postCard);
router.put('/cards/:cardId/likes', checkCard);
router.delete('/cards/:cardId', deleteCard);

module.exports = router;
