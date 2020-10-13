'use strict'

const form = require("express-form2")
const { field } = form

const validateSongForm = form(
  field('title').required().trim(),
  field('slug').required().trim(),
  field('artists').required().isArray().minLength(1),
  field('types'),
  field('difficulty'),
  field('capo'),
  field('version'),
  field('lyrics'),
  field('youtube'),
)

const validateArtistForm = form(
  field('name').required().trim(),
  field('slug').required().trim(),
  field('picture'),
)

module.exports = {
  validateSongForm,
  validateArtistForm,
}