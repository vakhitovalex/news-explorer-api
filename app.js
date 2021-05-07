const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { createUser, login } = require('./controllers/usersController');
const auth = require('./middleware/auth');
const { requestLogger, errorLogger } = require('./middleware/logger');
const NotFoundError = require('./middleware/errors/not-found-err');

const app = express();

const { PORT = 3002 } = process.env;

// connect to the MongoDB server
mongoose.connect('mongodb://localhost:27017/news-explorer', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
// connect the middleware, routes, etc...
const userRouter = require('./routes/users');

app.use(requestLogger);
app.use(bodyParser.json());
app.use('/users', auth, userRouter);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(6).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    }),
  }),
  createUser,
);
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    }),
  }),
  login,
);

app.get('*', () => {
  throw new NotFoundError(`This page doesn't exist`);
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    // check the status and display a message based on it
    message: statusCode === 500 ? 'An error occurred on the server' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App is working at ${PORT}`);
});
