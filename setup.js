'use strict'

const mongoose = require('mongoose')

const url = `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`

mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => console.log('connected to mongodb'))
  .catch(console.error)