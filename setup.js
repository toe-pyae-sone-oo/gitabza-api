'use strict'

const mongoose = require('mongoose')

const dbuser = process.env.DB_USER
const dbpwd = process.env.DB_PASS
const dbauth = (dbuser && dbpwd) ? `${dbuser}:${dbpwd}@` : ''
const url = `mongodb://${dbauth}${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`

mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => console.log('connected to mongodb'))
  .catch(console.error)