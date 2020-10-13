const express = require('express')
const router = express.Router()
const { error } = require('../common/errors')
const { imageFilter } = require('../helpers')
const { handleSingleFileUpload } = require('../middlewares/fileupload')
const { artistsPicStorage: storage } = require('../helpers/artists')

router.post('/upload/pic', handleSingleFileUpload(storage, imageFilter, 'picture'), (req, res, next) => {
  if (req.fileValidationError) {
    return next(error(400, req.fileValidationError))
  } 
  if (!req.file) {
    return next(error(400, 'Please select an image to upload'))
  } 
  res.json({ file: req.file.filename })
})

module.exports = router