const multer = require('multer')

const artistsPicStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'))
  },
  filename(req, file, cb) {
    const filename = `${moment().format('YYYY-MM-DD')}-${uuid()}${path.extname(file.originalname)}`
    cb(null, filename)
  },
})

module.exports = {
  artistsPicStorage,
}