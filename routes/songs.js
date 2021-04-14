const express = require('express')
const router = express.Router()
const { v4: uuid } = require('uuid')
const Song = require('../models/songs')
const { validateSongForm } = require('../middlewares/validations')
const { isAdmin } = require('../middlewares/auth')
const { error } = require('../common/errors')
const { deepCopy } = require('../common/utils')
const { getArtists } = require('../helpers/artists')
const { convertToUniIfZg } = require('../helpers/converter')
const { getYoutubeImage, recordSongVisit, getTopSongs } = require('../helpers/songs')

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
    genre,
  } = req.query 
  
  const _title = convertToUniIfZg(title)
  
  try {
    const count = await Song.findByTitleAndGenre(_title, genre).count()
    const songs = await Song.findByTitleAndGenre(_title, genre)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ [sort]: order === 'asc' ? 1 : -1 })
      .select({ _id: 0 })
      .lean()
    for (let song of songs) {
      song.artists = song.artists.length > 0 
        ? await getArtists(song.artists) 
        : []

      song.image = song.youtube 
        ? getYoutubeImage(song.youtube) 
        : undefined
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

router.get('/slug/:artist/:song', async (req, res, next) => {
  const { 
    artist: artistSlug, 
    song: songSlug 
  } = req.params

  try {

    const song = await Song.findBySlug(songSlug)
      .select({ _id: 0 })
      .lean()

    if (!song) {
      return next(error(404, 'song not found'))
    }
    
    song.artists = song.artists.length > 0
      ? await getArtists(song.artists)
      : []

    const isRelated = song.artists
      .map(artist => artist.slug)
      .includes(artistSlug)
    
    if (!isRelated) {
      return next(error(404, 'song not found'))
    }

    song.image = song.youtube
      ? getYoutubeImage(song.youtube)
      : undefined

    recordSongVisit(song.uuid)

    return res.status(200).json(song)
    
  } catch (err) {
    console.error(err)
    return next(error(500, 'something went wrong'))
  }

})

router.get('/top', async (req, res, next) => {
  try {

    const topSongIds = (await getTopSongs()).map(({ _id }) => _id)
    const topSongs = await Song.find({
      uuid: {
        $in: topSongIds
      }
    })
      .select({ '_id': 0 })
      .lean()

    const latestSongs = await Song.find({
      uuid: {
        $not: {
          $in: topSongIds
        }
      }
    })
      .sort({ created_at: -1 })
      .limit(20 - topSongIds.length)
      .select({ '_id': 0 })
      .lean()

    const songs = [...topSongs, ...latestSongs]
  
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

router.get('/:uuid', async (req, res, next) => {
  const { uuid } = req.params
  try {
    const song = await Song.findByUUID(uuid).select({ '_id': 0 }).lean()

    if (!song) {
      return next(error(404, 'song not found'))
    }

    song.artists = song.artists.length > 0 
        ? await getArtists(song.artists) 
        : []

    song.image = song.youtube 
      ? getYoutubeImage(song.youtube) 
      : undefined

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