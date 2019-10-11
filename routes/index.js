const express = require('express');
const passport = require('passport');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Portfolio } = require('../models');

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/')
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
    }
  }),
  limit: { fileSize: 5 * 2014 * 1024 },
});

router.get('/', async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findAll({ order: [['id', 'DESC']]});
    res.render('index', {user: req.user, portfolio});
  } catch (e) {
    next(e);
  }
});

router.get('/login', async (req, res, next) => {
  res.render('login');
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      req.flash('loginError', info.message);
      return res.redirect('/');
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/form', isLoggedIn, async (req, res, next) => {
  res.render('form');
});

router.post('/portfolio', upload.single('img'), isLoggedIn, async (req, res, next) => {
  const { title, link, content } = req.body;
  try {
    const newPortfolio = await Portfolio.create({
      title, link, content, file: req.file.filename
    });
    if (newPortfolio) {
      res.redirect('/');
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
