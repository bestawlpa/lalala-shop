const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    product_id : String,
    product_name : String,
    price : Number,
    category_id : String,
    category_name : String,
    images: [String],
    description : String,
    inventory_quantity : Number,
    ratings : Number,
    updated_at : { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);

