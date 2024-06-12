const mongoose = require('mongoose');

const ReceiptSchema = new mongoose.Schema({
    Checkout: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Checkout',
        required: true
    }],
    receiptImageUrl: {
        type: String,
        required: true
    },
    status: { type: String, enum: ['Processed', 'Approved'], default: 'Processed' },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// ใช้ pre-save hook เพื่ออัพเดทฟิลด์ updated_at
ReceiptSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('Receipt', ReceiptSchema);
