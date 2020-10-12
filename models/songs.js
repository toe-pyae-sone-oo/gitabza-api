'use strict'

const mongoose = require('mongoose')

const SongSchema = new mongoose.Schema({
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

SongSchema.index({ 'created_at': -1 })
SongSchema.index({ 'updated_at': -1 })

const Song = mongoose.model('songs', SongSchema)

module.exports = Song