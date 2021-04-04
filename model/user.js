const mongoose = require('mongoose')

const users = new mongoose.Schema(
	{
		email: { type: String, required: true, unique: true },
		name: { type: String, required: true, },
		password: { type: String, required: true }
	},
)

const model = mongoose.model('users', users)

module.exports = model
