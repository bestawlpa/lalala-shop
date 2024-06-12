const mongoose = require('mongoose');

const CheckoutSchema = new mongoose.Schema({
    product : [{ 
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    }],
    user: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    address : String,
    tell : String,
    quantity : Number,
    total: Number,
    status: { type: String, enum: ['Pending', 'Packaging' , 'Shipped'], default: 'Pending' },
    tracking: { type: String, default: "" },
    updated_at : { type: Date, default: Date.now }
});

module.exports = mongoose.model('Checkout',CheckoutSchema);