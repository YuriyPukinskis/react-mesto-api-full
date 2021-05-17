const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadDataError = require('../errors/not-found-err');
const NoRightsError = require('../errors/no-rights-err');

module.exports.getCards = (req, res) => {
  Card.find()
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') { throw new NotFoundError('Карточек нет в базе'); }
    });
};

module.exports.getCardById = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') { throw new NotFoundError('Карточки нет в базе'); }
    });
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') { throw new BadDataError('Введены некорректные данные'); }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(new Error('NotValidId'))
    .then((card) => {
      if (JSON.stringify(card.owner) === JSON.stringify(req.user._id)) {
        Card.findByIdAndRemove(card._id)
          .orFail(new Error('NotValidId'))
          .then((cards) => res.send({ data: cards }))
          .catch((err) => {
            if (err.name === 'ValidationError') { throw new BadDataError('Переданы некорректные данные'); }
            if (err.message === 'NotValidId') { throw new NotFoundError('Карточки нет в базе'); }
          });
      } else {
        throw new NoRightsError('Не Ваша то карточка, любезный пользователь, благоволите не удалять ее');
      }
    })
    .catch((err) => {
      if (err.message === 'NotValidId') { throw new NotFoundError('Карточки нет в базе'); }
    });
};

module.exports.checkCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(new Error('NotValidId'))
    .then((card) => {
      if (card.likes.find((elem) => elem === req.user._id)) {
        this.dislikeCard(req, res);
      } else {
        this.likeCard(req, res);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') { throw new BadDataError('Переданы некорректные данные'); }
      if (err.message === 'NotValidId') { throw new NotFoundError('Карточки нет в базе'); }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch(() => {
      // res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch(() => {
      // res.status(500).send({ message: 'Произошла ошибка' });
    });
};
