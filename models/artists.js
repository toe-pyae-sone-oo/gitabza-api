const mongoose = require('mongoose')

const artistSchema = new mongoose.Schema({
  uuid: {
    type: String,
    index: { unique: true },
    required: true,
  },
  name: {
    type: String,
    index: true,
    required: true,
  },
  slug: {
    type: String,
    index: { unique: true },
    required: true,
  },
  picture: String,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
})

artistSchema.index({ 'created_at': -1 })
artistSchema.index({ 'updated_at': -1 })

artistSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug })
}

artistSchema.statics.findByName = function(name) {
  return this.find(name ? { name: new RegExp(name, 'i') } : {})
}

const Artist = mongoose.model('artists', artistSchema)

module.exports = Artist