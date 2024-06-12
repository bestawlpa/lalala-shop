const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = require('../models/Category');


router.get('/', (req,res,next) => {
    Category.find()
        .then(categories => {
            res.json(categories);
        })
        .catch(err => {
            next(err);
        })
});

router.get('/:category_id', (req, res, next) => {
    Category.findOne({ category_id: req.params.category_id })
        .then(category => {
            res.json(category);
        })
        .catch(err => {
            next(err);
        });
});


router.post('/',(req,res,next) => {
    Category.create(req.body)
        .then(post => {
            res.json(post);
        })
        .catch(err => {
            next(err);
        })
});

router.put('/:category_id', (req, res, next) => {
    Category.findOneAndUpdate({ category_id: req.params.category_id },req.body)
        .then(category => {
            res.json(category);
        })
        .catch(err => {
            next(err);
        });
});



module.exports = router;