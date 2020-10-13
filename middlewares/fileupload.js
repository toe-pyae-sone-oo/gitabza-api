const multer = require('multer');

const handleSingleFileUpload = (storage, filter, field) => 
  multer({ storage, fileFilter: filter }).single(field)

module.exports = {
  handleSingleFileUpload,
}