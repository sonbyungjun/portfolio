const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('dotenv').config();

const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
sequelize.sync();
passportConfig(passport);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 8002);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
// app.use(countVisitors);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

const indexRouter = require('./routes');

app.use('/', indexRouter);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  // res.status(200);
  console.error(err);
  res.json({
    code: err.status || 500,
    result: false,
    resultMsg: err.message || err.error.toString()
  });
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});

async function countVisitors(req, res, next) {
  if (!req.cookies.count && !req.cookies['connect.sid']) {
  // if (true) {
    res.cookie('count', "", { maxAge: 3600000, httpOnly: true });
    const now = new Date();
    const date = now.getFullYear() + "/" + now.getMonth() + "/" + now.getDate();
    if (date != req.cookies.countDate) {
      console.log("???");
      res.cookie('countDate', date, { maxAge: 3600000, httpOnly: true });
      const { Counter } = require('./models');
      try {
        const counter = await Counter.findOne({ where: { name: 'vistors' }});
        if (counter) {
          counter.totalCount++;
          if (counter.date == date) {
            counter.todayCount++;
          } else {
            counter.todayCount = 1;
            counter.date = date;
          }
          counter.save();
        } else {
          await Counter.create({ name: 'vistors', totalCount: 1, todayCount: 1 });
        }
      } catch (e) {
        next();
      }
    }
  }
  return next();
}
