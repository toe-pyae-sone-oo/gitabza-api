'use strict'

const mongoose = require('mongoose')

const url = 'mongodb://localhost:27017/gitabza'

mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => console.log('connected to mongodb'))
  .catch(console.error)