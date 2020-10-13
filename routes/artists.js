const express = require('express')
const router = express.Router()
const { v4: uuid } = require('uuid')
const { error } = require('../common/errors')
const { imageFilter } = require('../helpers')
const { handleSingleFileUpload } = require('../middlewares/fileupload')
const { validateArtistForm } = require('../middlewares/validations')
const { artistsPicStorage: storage } = require('../helpers/artists')
const { delay } = require('../common/utils')
const Artist = require('../models/artists')

router.post('/upload/pic', handleSingleFileUpload(storage, imageFilter, 'picture'), (req, res, next) => {
  if (req.fileValidationError) {
    return next(error(400, req.fileValidationError))
  } 
  if (!req.file) {
    return next(error(400, 'Please select an image to upload'))
  } 
  res.json({ file: req.file.filename })
})

router.post('/', validateArtistForm, async (req, res, next) => {
  if (!req.form.isValid) {
    return next(error(400, req.form.errors))
  }

  try {
    // TODO: remove later
    // just for testing
    await delay(3000)

    const found = await Artist.findBySlug(req.form.slug).lean().exec()
    if (found) {
      return next(error(422, 'slug already exists'))
    }

    const artist = new Artist({ ...req.body, uuid: uuid() })
    const newArtist = (await artist.save()).toJSON()

    delete newArtist['_id']

    return res.status(201).json(newArtist)

  } catch (err) {
    return next(error(500, err.message))
  }
})

router.get('/', async (req, res) => {
  const { 
    skip = 0, limit = 10, 
    sort = 'created_at', order = 'desc',
    name = undefined,
  } = req.query

  const count = await Artist.findByName(name).count().exec()

  const artists = await Artist
    .findByName(name)
    .limit(parseInt(limit))
    .skip(parseInt(skip))
    .sort({ [sort]: order === 'asc' ? 1 : -1 })
    .select({ _id: 0 })
    .exec()

  return res.status(200).json({ artists, count })
})

module.exports = router