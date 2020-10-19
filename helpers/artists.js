const multer = require('multer')
const path = require('path')
const moment = require('moment')
const { v4: uuid } = require('uuid')
const Artist = require('../models/artists')

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

module.exports = {
  artistsPicStorage,
  getArtistNames,
}