'use strict'

const mongoose = require('mongoose')

const songViewSchema = new mongoose.Schema({
  uuid: {
    type: String,
    index: { unique: true },
    required: true,
  },
  song: {
    type: String,
    index: true,
    required: true,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
})

songViewSchema.index({ 'created_at': -1 })
songViewSchema.index({ 'updated_at': -1 })

const SongView = mongoose.model('songviews', songViewSchema)

module.exports = SongView