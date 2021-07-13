const express = require('express');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const auth = require('./middleware/auth');
const { requestLogger, errorLogger } = require('./middleware/logger');
const NotFoundError = require('./middleware/errors/not-found-err');
const { createUser, login } = require('./controllers/usersController');
const { rateLimiter } = require('./middleware/limiter');
require('./utils/initDB')();
require('dotenv').config();

const app = express();

const { PORT = 3002 } = process.env;

const userRouter = require('./routes/users');
const articleRouter = require('./routes/articles');

app.set('trust proxy', 1);
app.use(cors());
app.use(requestLogger);
app.use(rateLimiter);
app.use(helmet());
app.use(bodyParser.json());
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
      name: Joi.string().required().min(6).max(30),
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
app.use('/articles', auth, articleRouter);
app.use('/users', auth, userRouter);

app.get('*', () => {
  throw new NotFoundError(`This page doesn't exist`);
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'An error occurred on the server' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App is working at ${PORT}`);
});
