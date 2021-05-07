const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

function getUserInfo(req, res, next) {
  return User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        console.log(res);
        throw new Error('User not found :(');
      }
      console.log(user);
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err) {
        console.log(res);
        throw new Error('Invalid data input');
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
            throw new Error('Please put correct email or password');
          }
          res.status(201).send({
            name: user.name,
            _id: user._id,
            email: user.email,
          });
        })
        .catch((err) => {
          if (err.code.toString() === '11000') {
            console.log(err + 'asssaas!');
            throw new Error('Please create a unique user');
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
        throw new Error('User not found');
      }
      const token = jwt.sign({ _id: user._id }, 'alex-key', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(() => {
      if (res.status(401)) {
        throw new Error('Incorrect email or password');
      }
    })
    .catch(next);
}

module.exports = {
  getUserInfo,
  createUser,
  login,
};
