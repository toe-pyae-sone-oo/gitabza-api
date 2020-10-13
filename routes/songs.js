const express = require('express')
const router = express.Router()
const { v4: uuid } = require('uuid')
const Song = require('../models/songs')
const { validateSongForm } = require('../middlewares/validations')
const { error } = require('../common/errors')
const { delay } = require('../common/utils')

router.post('/', validateSongForm, async (req, res, next) => {
  if (!req.form.isValid) {
    return next(error(400, req.form.errors))
  }

  try {
    // TODO: remove later
    // just for testing
    await delay(5000)

    const found = await Song.findBySlug(req.form.slug).lean().exec()
    if (found) { 
      return next(error(422, 'slug already exists')) 
    }

    const song = new Song({ ...req.body, uuid: uuid() })
    const newSong = (await song.save()).toJSON()

    delete newSong['_id']

    return res.status(201).json(newSong)

  } catch (err) {
    return next(error(500, err.message))
  }
})

module.exports = router