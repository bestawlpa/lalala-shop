const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    category_id : { type: String, required: true },
    category_name : String,
    images: [String],
    updated_at : { type: Date, default: Date.now }
})

module.exports = mongoose.model('Category', CategorySchema);