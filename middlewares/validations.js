'use strict'

const form = require("express-form2")
const { field } = form

const validateSongForm = form(
  field('title').required().trim(),
  field('slug').required().trim(),
  field('artists').required().isArray().minLength(1),
  field('types').required().trim(),
  field('difficulty').required().trim(),
  field('capo'),
  field('version').required().trim(),
  field('lyrics').required().trim(),
  field('youtube').required().trim(),
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