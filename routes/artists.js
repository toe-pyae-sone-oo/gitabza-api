const express = require('express')
const router = express.Router()
const { v4: uuid } = require('uuid')
const { error } = require('../common/errors')
const { imageFilter } = require('../helpers')
const { getArtists } = require('../helpers/artists')
const { getYoutubeImage } = require('../helpers/songs')
const { handleSingleFileUpload } = require('../middlewares/fileupload')
const { validateArtistForm } = require('../middlewares/validations')
const { isAdmin } = require('../middlewares/auth')
const { artistsPicStorage: storage } = require('../helpers/artists')
const { deepCopy } = require('../common/utils')
const { UPLOAD_FILES_URL } = require('../common/constants')
const Artist = require('../models/artists')
const Song = require('../models/songs')

router.post('/upload/pic', isAdmin, handleSingleFileUpload(storage, imageFilter, 'picture'), (req, res, next) => {
  if (req.fileValidationError) {
    return next(error(400, req.fileValidationError))
  } 
  if (!req.file) {
    return next(error(400, 'Please select an image to upload'))
  } 
  res.json({ file: req.file.filename })
})

router.post('/', isAdmin, validateArtistForm, async (req, res, next) => {
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
    .lean()
    .exec()

  for (let artist of artists) {
    if (artist.picture) {
      artist.picture = `${UPLOAD_FILES_URL}/${artist.picture}`
    }
    artist.songs = await Song.findByArtist(artist.uuid).count()
  }

  return res.status(200).json({ artists, count })
})

router.delete('/:uuid', isAdmin, async (req, res, next) => {
  const { uuid } = req.params
  try {
    await Artist.deleteOne({ uuid }).exec()
    res.status(200).json({ message: 'success' })
  } catch (err) {
    console.error(err)
    return next(error(500, 'something went wrong'))
  }
})

// get all artist uuids and names
router.get('/names', isAdmin, async (req, res, next) => {
  try { 
    const artists = await Artist
      .find({})
      .sort({ name: 1 })
      .select({ uuid: 1, name: 1, '_id': 0 })
      .lean()
    res.status(200).json(artists)
  } catch (err) {
    console.error(err)
    return next(error(500, 'something went wrong'))
  }
})

router.get('/slug/:slug', async (req, res, next) => {
  try { 
    const { slug } = req.params
    const artist = await Artist.findBySlug(slug)
      .select({ _id: 0 })
      .lean()

    if (!artist) {
      return next(error(404, 'artist not found'))
    }

    const songs = await Song.findByArtist(artist.uuid).count()

    const _artist = {
      ...artist,
      picture: artist.picture
        ? `${UPLOAD_FILES_URL}/${artist.picture}`
        : artist.picture,
      songs,
    }

    return res.status(200).json(_artist)

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

    if (!artist) { return next(error(404, 'artist not found')) }

    const songs = await Song.findByArtist(artist.uuid).count()

    const _artist = {
      ...artist,
      picture: artist.picture 
        ? `${UPLOAD_FILES_URL}/${artist.picture}`
        : artist.picture,
      songs,
    }
    return res.status(200).json(_artist)
  } catch (err) {
    console.error(err)
    return next(error(500, 'something went wrong'))
  }
})

router.get('/:uuid/songs', async (req, res, next) => {
  const { uuid } = req.params
  try {
    const songs = await Song
      .findByArtist(uuid)
      .sort({ title: 1 })
      .select({ '_id': 0 })
      .lean()

    for (let song of songs) {
      song.artists = song.artists.length > 0 
        ? await getArtists(song.artists) 
        : []

      song.image = song.youtube 
        ? getYoutubeImage(song.youtube) 
        : undefined
    }

    return res.status(200).json(songs)
  } catch (err) {
    console.error(err)
    return next(error(500, 'something went wrong'))
  }
})

router.put('/:uuid', isAdmin, validateArtistForm, async (req, res, next) => {
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