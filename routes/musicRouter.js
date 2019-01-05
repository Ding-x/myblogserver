/**
 * Author:Kundan Kishor
 */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Musics = require('../models/musics');

const musicRouter = express.Router();

musicRouter.use(bodyParser.json());

musicRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        Musics.find()
        .then((music) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(music);
        }, (err) => next(err)).catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,  (req, res, next) => {
        if (req.body != null) {

            Musics.create(req.body)
            .then((music) => {
                Musics.findById(music._id)
                .then((music) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(music);
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
        res.statusCode = 403;
        res.end('PUT operation is not supported on /articles');
    })



    
    musicRouter.route('/:musicId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /articles');
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation is not supported on /articles/' + req.params.articleId);
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        // Articles.findByIdAndUpdate(req.params.articleId, {
        //     $set: req.body
        // }, {
        //     new: true
        // }).then((article) => {
        //     res.statusCode = 200;
        //     res.setHeader("Content-Type", "application/json");
        //     res.json(article);
        // }, (err) => next(err)).catch((err) => next(err));
        res.statusCode = 403;
        res.end('PUT operation is not supported on /articles');
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Musics.findByIdAndRemove(req.params.musicId).then((result) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(result);
        }, (err) => next(err)).catch((err) => next(err));
    });


module.exports = musicRouter;