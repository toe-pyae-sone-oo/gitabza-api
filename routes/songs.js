const express = require('express')
const router = express.Router()
const Song = require('../models/songs')
const { v4: uuid } = require('uuid')

router.post('/', async (req, res) => {
  const song = new Song({ ...req.body, uuid: uuid() })
  const newSong = await song.save()
  res.status(201).json(newSong.toJSON())
})

module.exports = router