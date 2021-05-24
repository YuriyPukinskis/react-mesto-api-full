const router = require('express').Router();
const express = require('express');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

router.use(express.urlencoded({ extended: false }));

const {
  getUsers, getMe, getUserById, patchUserData, patchUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getMe);

router.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().alphanum().required()
      .min(2)
      .max(24),
  }),
}), getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), patchUserData);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле "avatar" должно быть валидным url-адресом');
    })
      .messages({
        'string.required': 'Поле "avatar" должно быть заполнено',
      }),
  }),
}), patchUserAvatar);

module.exports = router;
