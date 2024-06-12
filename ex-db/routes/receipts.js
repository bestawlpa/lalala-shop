const express = require('express');
const router = express.Router();
const multer = require('multer');
const Receipt = require('../models/Receipt');
// const Checkout = require('../models/Checkout');
// const Product = require('../models/Product');
// const User = require('../models/User'); // ตรวจสอบให้แน่ใจว่าคุณมีโมเดลเหล่านี้
const fs = require('fs');
const path = require('path');


// เปลี่ยนเส้นทางไปยังโฟลเดอร์ในโปรเจค Next.js
const uploadDir = path.join(__dirname, '../../next-js/public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// ดึงข้อมูลทั้งหมดของ receipts พร้อมข้อมูล checkout, product และ user
router.get('/', (req, res, next) => {
    Receipt.find()
        .populate({
            path: 'Checkout',
            populate: [
                { path: 'product' },
                { path: 'user' }
            ]
        })
        .then(receipts => {
            res.json(receipts);
        })
        .catch(err => {
            next(err);
        });
});

router.get('/:id', (req,res,next) => {
    Receipt.findOne({_id:req.params.id})
        .then(receipts => {
            res.json(receipts)
        })
        .catch(err => {
            next(err)
        })
});

// อัพโหลด receipt
router.post('/upload', upload.single('image'), (req, res, next) => {
    try {
        const { order } = req.body;
        const parsedOrder = JSON.parse(order);

        const receipt = new Receipt({
            Checkout: parsedOrder, // สมมติว่า parsedOrder เป็น array ของ ObjectId ของ Checkout
            receiptImageUrl: path.join('uploads', req.file.filename) // ปรับเส้นทางให้ถูกต้อง
        });

        receipt.save()
            .then(savedReceipt => {
                res.json(savedReceipt);
            })
            .catch(err => {
                next(err);
            });
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', (req,res,next) => {
    Receipt.findByIdAndDelete({_id:req.params.id})
        .then(receipts => {
            res.json(receipts)
        })
        .catch(err => {
            next(err)
        })
});

router.put('/:id', (req,res,next) => {
    const newStatus = req.body.status;

    if (!['Processed', 'Approved'].includes(newStatus)) {
        return res.status(400).json({ error: 'Invalid status' });
    };

    Receipt.findByIdAndUpdate(
        req.params.id,
        { status: newStatus, updated_at: Date.now() },
        { new: true }
    )
    .then(receipts => {
        if (!receipts) {
            return res.status(404).json({ error: 'Receipt not found' });
        }
        res.json(receipts);
    })
    .catch(err => {
        next(err);
    })
});

module.exports = router;
