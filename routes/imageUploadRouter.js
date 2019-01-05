
const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');
const multer = require('multer');
const fs = require("fs");
const path = require("path");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/cover');
    },
    filename: (req, file, cb) => {
        cb(null, Math.random().toString(36).substr(2)+"."+file.originalname.split(".")[1]);
    }
});

const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only images can be uploaded'), false);
    } else {
        return cb(null, true);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: imageFileFilter
});

const imageUploadRouter = express.Router();

imageUploadRouter.use(bodyParser.json());

imageUploadRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation is not supported on /imageUpload');
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /imageUpload');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE operation is not supported on /imageUpload');
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file);
        console.log(req.file)
    });

    imageUploadRouter.route('/:imageName')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation is not supported on /imageUpload');
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /imageUpload');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        var files = [];
        url="public/images/cover"
        name=req.params.imageName
        
        files = fs.readdirSync(url);    //返回文件和子目录的数组

        var result=null;
        var curPath = null;

        files.forEach(function(file,index){
            if(file.indexOf(name)>-1){    //是指定文件，则删除
                result=file;
                curPath = path.join(url,file);
            }

        });

        if(result!=null){    //是指定文件，则删除
            fs.unlinkSync(curPath);
            console.log("Delete image file: "+curPath);
            res.statusCode = 200;
            res.json("Delete image file: "+curPath);
        }
        else{
            console.log("No image file");
            res.statusCode = 500;
            res.json("No image file");
        }
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res,next) => {
        res.statusCode = 403;
        res.end('DELETE operation is not supported on /imageUpload');
    });


module.exports = imageUploadRouter;
