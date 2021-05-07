const express = require('express');
const { getUserInfo } = require('../controllers/usersController');

const router = express.Router();

router.get('/me', getUserInfo);

module.exports = router;
