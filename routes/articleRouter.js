
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Articles = require('../models/articles');

const articleRouter = express.Router();

articleRouter.use(bodyParser.json());

articleRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        Articles.find(req.query)
        .populate('author')
        .then((articles) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(articles);
        }, (err) => next(err)).catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) => {
        if (req.body != null) {
            req.body.author = req.user._id;
            Articles.create(req.body)
            .then((article) => {
                Articles.findById(article._id)
                .populate('author')
                .then((article) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(article);
                })
            }, (err) => next(err)).catch((err) => next(err));
        }
        else {
            err = new Error('Comment not found in request body');
            err.status = 404;
            return next(err);
        }
       
    })

    .put(cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /articles');
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,  (req, res, next) => {
        Articles.remove({}).then((result) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(result);
        }, (err) => next(err)).catch((err) => next(err));
    })

    articleRouter.route('/:articleId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        Articles.findById(req.params.articleId).populate('comments.author').then((articles) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(articles);
        }, (err) => next(err)).catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation is not supported on /articles/' + req.params.articleId);
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Articles.findByIdAndUpdate(req.params.articleId, {
            $set: req.body
        }, {
            new: true
        }).then((article) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(article);
        }, (err) => next(err)).catch((err) => next(err));
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Articles.findByIdAndRemove(req.params.articleId).then((result) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(result);
        }, (err) => next(err)).catch((err) => next(err));
    });


module.exports = articleRouter;
