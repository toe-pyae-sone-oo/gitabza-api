const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const { error } = require('../common/errors')
const { JWT_SECRET } = require('../common/constants')

const router = express.Router()

router.post('/login', async (req, res, next) => {
  passport.authenticate('admin_login', async (err, user, info) => {
    try {
      if (err) throw err

      if (!user) {
        return next(error(401, info ? info.message : 'unauthorized'))
      }

      req.login(user, { session: false }, async err => {
        if (err) return next(error(401, 'unauthorized'))
        const body = { uuid: user.uuid, username: user.username }
        const token = jwt.sign({ user: body }, JWT_SECRET) // TODO: get secret from env
        return res.status(200).json({ token })
      })
    } catch (err) {
      console.error(err)
      return next(error(500, 'something went wrong'))
    }
  })(req, res, next)
})

module.exports = router