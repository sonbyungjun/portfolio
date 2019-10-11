const LocalStrategy = require('passport-local').Strategy;

const { User } = require('../models');

module.exports = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'loginId',
    passwordField: 'password',
  }, async (loginId, password, done) => {
    try {
      const exUser = await User.findOne({ where: { loginId } });
      if (exUser) {
        if (password === exUser.password) {
          done(null, exUser);
        } else {
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
      } else {
        done(null, false, { message: '가입되지 않은 회원입니다.' });
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};
