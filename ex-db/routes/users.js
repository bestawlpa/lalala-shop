const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');


/* GET users listing. */
router.get('/', function(req, res, next) {
    User.find()
      .then(user => {
        res.json(user);
      })
      .catch(err => {
        next(err);
      })

});

router.get('/:id', (req,res,next) => {
    User.findOne({_id:req.params.id})
        .then(user => {
            res.json(user)
        })
        .catch(err => {
            next(err)
        })
});

router.post('/', (req, res, next) => {
    const { username, email, password } = req.body;

    User.findOne({ email })
        .then(existingUser => {
            // ถ้ามีผู้ใช้อีเมลนี้อยู่แล้ว ส่งข้อความผิดพลาดกลับ
            if (existingUser) {
                return res.status(400).json({ error: 'Email is already in use' });
            }
            
            // ใช้ bcrypt เพื่อเข้ารหัสรหัสผ่าน
            return bcrypt.hash(password, 10);
        })
        .then(hashedPassword => {
            // สร้างผู้ใช้ใหม่
            return User.create({
                username,
                email,
                password: hashedPassword,
            });
        })
        .then(newUser => {
            // ส่งผู้ใช้ใหม่ที่สร้างขึ้นไปยังไคลเอ็นต์
            res.json(newUser);
        })
        .catch(error => {
            // ถ้าเกิดข้อผิดพลาดในการดำเนินการ ส่งข้อผิดพลาดไปยัง middleware ถัดไป
            next(error);
        });
});

router.put('/:id', async (req, res, next) => {
    try {
        // ตรวจสอบว่าข้อมูลที่รับเข้ามาถูกต้องหรือไม่
        if (!req.params.id || !req.body) {
            return res.status(400).json({ message: "Invalid request data" });
        }

        // อัปเดตข้อมูลผู้ใช้โดยใช้ findByIdAndUpdate
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // ตรวจสอบว่ามีผู้ใช้ที่พบและถูกอัปเดตหรือไม่
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found or failed to update" });
        }

        // ส่งข้อมูลผู้ใช้ที่ถูกอัปเดตกลับไป
        return res.json(updatedUser);
    } catch (error) {
        // รับข้อผิดพลาดที่เกิดขึ้นในขณะที่ทำการอัปเดตข้อมูล
        return next(error);
    }
});


module.exports = router;
