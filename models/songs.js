'use strict'

const mongoose = require('mongoose')

const songSchema = new mongoose.Schema({
  uuid: {
    type: String,
    index: { unique: true },
    required: true,
  },
  title: {
    type: String,
    index: true,
    required: true,
  },
  slug: {
    type: String,
    index: { unique: true },
    required: true,
  },
  artists: {
    type: [String],
    index: true,
    required: true,
  },
  genre: {
    type: String,
    index: true,
  },
  types: String,
  difficulty: String,
  capo: String,
  version: String,
  lyrics: String,
  youtube: String,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
})

songSchema.index({ 'created_at': -1 })
songSchema.index({ 'updated_at': -1 })

songSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug })
}

songSchema.statics.findByTitle = function(title) {
  return this.find(title ? { title: new RegExp(title, 'i') } : {})
}

songSchema.statics.findByUUID = function(uuid) {
  return this.findOne({ uuid })
}

songSchema.statics.findByArtist = function(artist) {
  return this.find({ artists: artist })
}

songSchema.statics.findByTitleAndGenre = function(title, genre) {
  const query = {}  

  if (title) {
    query['title'] = new RegExp(title, 'i')
  }

  if (genre) {
    query['genre'] = genre
  }

  console.log(query)

  return this.find(query)
}

const Song = mongoose.model('songs', songSchema)

module.exports = Song