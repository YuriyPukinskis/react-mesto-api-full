const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCardById, postCard, deleteCard, checkCard, getCards,
} = require('../controllers/cards');

router.get('/cards/:cardId', getCardById);
router.get('/cards', getCards);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
}), postCard);
router.put('/cards/:cardId/likes', checkCard);
router.delete('/cards/:cardId', deleteCard);

module.exports = router;
