const multer = require('multer')
const path = require('path')
const moment = require('moment')
const { v4: uuid } = require('uuid')
const Artist = require('../models/artists')
const { UPLOAD_FILES_URL } = require('../common/constants')

const artistsPicStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'))
  },
  filename(req, file, cb) {
    const filename = `${moment().format('YYYY-MM-DD')}-${uuid()}${path.extname(file.originalname)}`
    cb(null, filename)
  },
})

const getArtistNames = async (uuids = []) => {
  const artists = await Artist.find({
    uuid: {
      $in: uuids,
    }
  })
    .select({ name: 1 })
    .lean()
  return artists.map(({ name }) => name)
}

const getArtists = async (uuids = []) => {
  const artists = await Artist.find({
    uuid: {
      $in: uuids,
    }
  })
    .select({ '_id': 0 })
    .lean()
  return artists.map(artist => {
    artist.picture = artist.picture 
      ? `${UPLOAD_FILES_URL}/${artist.picture}` 
      : undefined
    return artist
  })
}

module.exports = {
  artistsPicStorage,
  getArtistNames,
  getArtists,
}