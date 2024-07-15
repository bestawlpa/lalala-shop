const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CartItem = require('../models/CartItem');

router.get('/', (req, res, next) => {
    CartItem.find().populate('product').populate('user')
        .then(cartItems => {
            res.json(cartItems);
        })
        .catch(error => {
            next(error);
        });
});

router.get('/:id', (req, res, next) => {
    CartItem.findById(req.params.id).populate('product').populate('user')
        .then(cartItem => {
            res.json(cartItem);
        })
        .catch(err => {
            next(err);
        });
});

router.get('/user/:id', (req, res, next) => {
    CartItem.find({ user: req.params.id }).populate('product')
        .then(cartItems => {
            res.json(cartItems);
        })
        .catch(error => {
            next(error);
        });
});

router.post('/', (req, res, next) => {
    CartItem.create(req.body)
        .then(post => {
            res.json(post);
        })
        .catch(err => {
            next(err);
        });
});

router.delete('/:id', (req, res, next) => {
    CartItem.findByIdAndDelete(req.params.id)
        .then(cartItem => {
            res.json(cartItem);
        })
        .catch(err => {
            next(err);
        });
});

module.exports = router;
