const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const adminSchema = new mongoose.Schema({
  uuid: {
    type: String,
    index: { unique: true },
    required: true,
  },
  username: {
    type: String,
    index: { unique: true },
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
})

adminSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10)
  this.password = hash
  next()
})

adminSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password)
}

const Admin = mongoose.model('admin', adminSchema)

module.exports = Admin