const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../middleware/errors/not-found-err');
const BadRequestError = require('../middleware/errors/bad-request-err');
const UnauthorizedError = require('../middleware/errors/unauthorized-err');
const ConflictError = require('../middleware/errors/conflict-err');

function getUserInfo(req, res, next) {
  return User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      res.status(200).send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err) {
        throw new BadRequestError('Invalid data input');
      }
    })
    .catch(next);
}

function createUser(req, res, next) {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      })
        .then((user) => {
          if (!user) {
            throw new BadRequestError('Please put correct email or password');
          }
          res.status(201).send({
            name: user.name,
            _id: user._id,
            email: user.email,
          });
        })
        .catch((err) => {
          if (err.code.toString() === '11000') {
            throw new ConflictError('Please create a unique user');
          }
        }),
    )
    .catch(next);
}

function login(req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      const token = jwt.sign({ _id: user._id }, 'alex-key', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(() => {
      if (res.status(401)) {
        throw new UnauthorizedError('Incorrect email or password');
      }
    })
    .catch(next);
}

module.exports = {
  getUserInfo,
  createUser,
  login,
};
