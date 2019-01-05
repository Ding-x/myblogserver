var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
var cors = require('./cors');
var router = express.Router();
router.use(bodyParser.json());
router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); } )
/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) {
      return next(err);
    } else {
      res.statusCode = 200;
      res.setHeader('Content_type', 'application/json');
      res.json(users);
    }
  })
});

const userRouter = express.Router();

userRouter.use(bodyParser.json());
userRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
      User.find({}, (err, users) => {
        if (err) {
          return next(err);
        } else {
          res.statusCode = 200;
          res.setHeader('Content_type', 'application/json');
          res.json(users);
        }
      })
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      res.statusCode = 403;
      res.end('PUT operation is not supported on /articles');
       
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /articles');
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,  (req, res, next) => {
      res.statusCode = 403;
      res.end('PUT operation is not supported on /articles');
    })

    userRouter.route('/:userId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,  (req, res, next) => {
      res.statusCode = 403;
      res.end('PUT operation is not supported on /articles');
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation is not supported on /articles/' + req.params.articleId);
    })

    .put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
      res.statusCode = 403;
      res.end('PUT operation is not supported on /articles');
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
        User.findByIdAndRemove(req.params.userId).then((result) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(result);
        }, (err) => next(err)).catch((err) => next(err));
    });



    module.exports = userRouter;