const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username : String,
    email : String,
    password : String,
    role : { type: String, enum: ['user', 'admin'], default: 'user' },
    updated_at : { type: Date, default: Date.now }
});

module.exports = mongoose.model('User',UserSchema)