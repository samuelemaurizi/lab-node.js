const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

// GET
router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);

// POST
router.post('/signup', authController.postSignup);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);

module.exports = router;
