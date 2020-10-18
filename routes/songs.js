const express = require('express')
const router = express.Router()
const { v4: uuid } = require('uuid')
const Song = require('../models/songs')
const Artist = require('../models/artists')
const { validateSongForm } = require('../middlewares/validations')
const { isAdmin } = require('../middlewares/auth')
const { error } = require('../common/errors')
const { deepCopy } = require('../common/utils')

router.post('/', isAdmin, validateSongForm, async (req, res, next) => {
  if (!req.form.isValid) {
    return next(error(400, req.form.errors))
  }

  try {
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

router.get('/', async (req, res, next) => {
  const {
    skip = 0, 
    limit = 10,
    sort = 'created_at',
    order = 'desc',
    title,
  } = req.query 
  
  try {
    const count = await Song.findByTitle(title).count()
    const songs = await Song.findByTitle(title)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ [sort]: order === 'asc' ? 1 : -1 })
      .select({ _id: 0 })
      .lean()
    for (let song of songs) {
      if (song.artists.length > 0) {
        const artists = await Artist.find({
          uuid: {
            $in: song.artists,
          }
        })
          .select({ name: 1 })
          .lean()
        song.artists = artists.map(({ name }) => name)
      }
      // youtube image
      if (song.youtube) {
        const url = new URL(song.youtube)
        const q = url.searchParams
        song.image = q.has('v') 
          ? `https://img.youtube.com/vi/${q.get('v')}/hqdefault.jpg`
          : undefined
      }
    }
    return res.status(200).json({ songs, count })
  } catch (err) {
    console.error(err)
    next(error(500, 'something went wrong'))
  }
})

router.delete('/:uuid', isAdmin, async (req, res, next) => {
  const { uuid } = req.params
  try {
    await Song.deleteOne({ uuid })
    return res.status(200).json({ message: 'success' })
  } catch (err) {
    console.error(err)
    return next(error(500, 'something went wrong'))
  }
})

router.get('/:uuid', async (req, res, next) => {
  const { uuid } = req.params
  try {
    const song = await Song.findByUUID(uuid).select({ '_id': 0 }).lean()
    return res.status(200).json(song)
  } catch (err) {
    console.error(err)
    return next(error(500, 'something went wrong'))
  }
})

router.put('/:uuid', isAdmin, validateSongForm, async (req, res, next) => {
  if (!req.form.isValid) { 
    return next(error(400, req.form.errors)) 
  }

  const { uuid } = req.params
  try {

    const found = await Song.findBySlug(req.form.slug)
    if (found && found.uuid !== uuid) {
      return next(error(422, 'slug already exists'))
    }

    const payload = deepCopy(req.form)
    await Song.findOneAndUpdate({ uuid }, { ...payload })

    const song = await Song.findByUUID(uuid)
      .select({ '_id': 0 }).lean()

    return res.status(200).json(song)

  } catch (err) {
    console.error(err)
    return next(error(500, 'something went wrong'))
  }
})

module.exports = router