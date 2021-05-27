const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  getCardById, postCard, deleteCard, checkCard, getCards,
} = require('../controllers/cards');

router.get('/', getCards);

router.get('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().alphanum().required()
      .min(2)
      .max(24),
  }),
}), getCardById);

router.post('/', celebrate({
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
router.put('/:cardId/likes', checkCard);
router.delete('/:cardId', deleteCard);

module.exports = router;
