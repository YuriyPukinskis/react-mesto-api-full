const express = require('express');
const mongoose = require('mongoose');

const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const cors = require('cors');
const routesCards = require('./routes/cards');
const routesUsers = require('./routes/users');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3005 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.listen(PORT, () => {

});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: true,
  exposedHeaders: '*',
  credentials: true,
}));

// app.options('*', (req, res) => {
//   res.set('Access-Control-Allow-Origin', 'https://pr15front.students.nomoredomains.club');
//   res.set('Access-Control-Allow-Headers', 'Content-Type');
//   res.set('Access-Control-Allow-Methods', ['PUT', 'GET', 'POST', 'DELETE', 'PATCH']);
//   res.set('Access-Control-Allow-Credentials', 'true');
//   res.send('ok');
// });
app.use(requestLogger);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);
app.use('/', routesUsers);
app.use('/', routesCards);

app.use(errorLogger);
app.use(errors());
app.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use((err, res) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});
