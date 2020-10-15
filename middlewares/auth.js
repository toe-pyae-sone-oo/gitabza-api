const passport = require('passport')

const isAdmin = passport.authenticate('jwt', { 
  session: false, 
  failWithError: true 
})

module.exports = { isAdmin }