const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const Admin = require('../models/admin')
const { JWT_SECRET } = require('../common/constants')

passport.use('admin_login', new localStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
  },
  async (username, password, done) => {
    try {

      const admin = await Admin.findOne({ username })
      if (!admin) {
        return done(null, false, { message: 'admin not found' })
      }

      const validate = await admin.isValidPassword(password)
      if (!validate) {
        return done(null, false, { message: 'wrong password' })
      }

      return done(null, admin, { message: 'logged in successfully' })

    } catch (err) {
      return done(err)
    }
  }
))

passport.use(new JWTstrategy({
  secretOrKey: JWT_SECRET,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
}, async (token, done) => {
  try {
    return done(null, token.user)
  } catch (err) {
    return done(err)
  }
}))