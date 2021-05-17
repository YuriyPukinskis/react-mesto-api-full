const router = require('express').Router();
const express = require('express');
const { celebrate, Joi } = require('celebrate');

router.use(express.urlencoded({ extended: false }));

const {
  getUsers, getMe, getUserById, patchUserData, patchUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getMe);
router.get('/users/:id', getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), patchUserData);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().min(2).max(90),
  }),
}), patchUserAvatar);

module.exports = router;
