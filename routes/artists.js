const express = require('express')
const router = express.Router()
const { v4: uuid } = require('uuid')
const { error } = require('../common/errors')
const { imageFilter } = require('../helpers')
const { handleSingleFileUpload } = require('../middlewares/fileupload')
const { validateArtistForm } = require('../middlewares/validations')
const { artistsPicStorage: storage } = require('../helpers/artists')
const { deepCopy } = require('../common/utils')
const { UPLOAD_FILES_URL } = require('../common/constants')
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
    const found = await Artist.findBySlug(req.form.slug).lean().exec()
    if (found) {
      return next(error(422, 'slug already exists'))
    }

    const artist = new Artist({ ...req.body, uuid: uuid() })
    const newArtist = (await artist.save()).toJSON()

    delete newArtist['_id']

    return res.status(201).json(newArtist)

  } catch (err) {
    console.error(err)
    return next(error(500, 'something went wrong'))
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

router.delete('/:uuid', async (req, res, next) => {
  const { uuid } = req.params
  try {
    await Artist.deleteOne({ uuid }).exec()
    res.status(200).json({ message: 'success' })
  } catch (err) {
    console.error(err)
    return next(error(500, 'something went wrong'))
  }
})

router.get('/:uuid', async (req, res, next) => {
  const { uuid } = req.params
  try {
    const artist = await Artist
      .findByUUID(uuid)
      .select({ '_id': 0 })
      .lean()
      .exec()
    if (!artist) { return next(error(404, 'artist not found')) }

    const _artist = {
      ...artist,
      picture: artist.picture 
        ? `${UPLOAD_FILES_URL}/${artist.picture}`
        : artist.picture
    }
    return res.status(200).json(_artist)
  } catch (err) {
    console.error(err)
    return next(error(500, 'something went wrong'))
  }
})

router.put('/:uuid', validateArtistForm, async (req, res, next) => {
  if (!req.form.isValid) {
    return next(error(400, req.form.errors))
  }

  try { 
    const { uuid } = req.params
    
    const found = await Artist.findBySlug(req.form.slug)
    if (found && found.uuid !== uuid) {
      return next(error(422, 'slug already exists'))
    }

    const payload = deepCopy(req.form) // remove undefined fields

    console.log({...payload})

    await Artist.findOneAndUpdate({ uuid }, { ...payload }).lean().exec()

    const artist = await Artist.findByUUID(uuid)
      .select({ '_id': 0 }).lean()
    return res.status(200).json(artist)

  } catch (err) {
    console.error(err)
    return next(error(500, 'something went wrong'))
  }
})

module.exports = router