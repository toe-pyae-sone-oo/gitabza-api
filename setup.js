'use strict'

const mongoose = require('mongoose')

const dbuser = process.env.DB_USER
const dbpwd = process.env.DB_PASS
const dbauthSource = process.env.DB_AUTH_SOURCE

let url = 'mongodb://'

if (dbuser && dbpwd) {
  url += `${dbuser}:${dbpwd}@`
}

url += `${process.env.DB_HOST}:${process.env.DB_PORT}`
url += `/${process.env.DB_NAME}`

if (dbauthSource) {
  url += `?authSource=${dbauthSource}`
}

console.log(url)

mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => console.log('connected to mongodb'))
  .catch(console.error)