const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Checkout = require('../models/Checkout');

router.get('/', (req,res,next) => {
    Checkout.find().populate('product').populate('user')
        .then(checkout => {
            res.json(checkout);
        })
        .catch(err => {
            next(err);
        })
});


router.get('/:id', (req,res,next) => {
    Checkout.findOne({_id:req.params.id}).populate('product').populate('user')
        .then(checkout => {
            res.json(checkout);
        })
        .catch(err => {
            next(err);
        })
});

router.get('/user/:id' ,(req,res,next) => {
    Checkout.find({ user: req.params.id}).populate('product')
        .then(checkout => {
            res.json(checkout);
        })
        .catch(err => {
            next(err);
        })
});

router.post('/', (req,res,next) => {
    Checkout.create(req.body)
        .then(post => {
            res.json(post);
        })
        .catch(err => {
            next(err);
        })
});

router.delete('/:id', (req,res,next) => {
    Checkout.findByIdAndDelete({_id:req.params.id})
        .then(checkout => {
                res.json(checkout)
        })
        .catch(err => {
                next(err)
        })
});



router.put('/:id', (req, res, next) => {
    const newStatus = req.body.status;
    const newTracking = req.body.tracking;

    // Validate the new status
    if (!['Pending', 'Packaging', 'Shipped'].includes(newStatus)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    // Update status and tracking
    Checkout.findByIdAndUpdate(
        req.params.id,
        { status: newStatus, tracking: newTracking, updated_at: Date.now() },
        { new: true }
    )
    .then(checkout => {
        if (!checkout) {
            return res.status(404).json({ error: 'Checkout not found' });
        }
        res.json(checkout);
    })
    .catch(err => {
        next(err);
    });
});



module.exports = router;



