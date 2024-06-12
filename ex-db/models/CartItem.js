const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    product : [{ 
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    }],
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updated_at : { type: Date, default: Date.now }
})


module.exports = mongoose.model('CartItem',CartItemSchema) ;