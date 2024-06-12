const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');

router.get('/', (req, res, next) => {
    Product.find()
        .then(products => {
            res.json(products);
        })
        .catch(err => {
            next(err);
        })
});

router.get('/:product_id', (req,res,next) => {
    Product.findOne({ product_id: req.params.product_id})
        .then(product => {
            res.json(product)
        })
        .catch(err => {
            next(err)
        })
});

router.post('/', (req, res, next) => {
    Product.create(req.body)
        .then(post => {
            res.json(post);
        })
        .catch(err => {
            next(err);
        });

});

router.put('/:product_id', (req, res, next) => {
    const product_id = req.params.product_id;
    const updateData = req.body;

    Product.findOneAndUpdate({ product_id: product_id }, updateData, { new: true })
        .then(updatedProduct => {
            if (!updatedProduct) {
                return res.status(404).send('Product not found');
            }
            res.json(updatedProduct);
        })
        .catch(err => {
            next(err);
        });
});

module.exports = router;