/**
 * Author:Kundan Kishor
 */
const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');
const multer = require('multer');
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/music');
    },
    filename: (req, file, cb) => {
        cb(null, Math.random().toString(36).substr(2)+"."+file.originalname.split(".")[1]);
    }
});

const musicFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(mp3)$/)) {
        return cb(new Error('Only images can be uploaded'), false);
    } else {
        return cb(null, true);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: musicFileFilter
});

const musicUploadRouter = express.Router();

musicUploadRouter.use(bodyParser.json());

musicUploadRouter.route('/')
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
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('musicFile'), (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file);
        console.log(req.file)
    });

    musicUploadRouter.route('/:musicName')
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
        url="public/music"
        name=req.params.musicName
        
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
            console.log("Delete music file: "+curPath);
            res.statusCode = 200;
            res.json("Delete music file: "+curPath);
        }
        else{
            console.log("No music file");
            res.statusCode = 500;
            res.json("No music file");
        }
           
 
        
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('musicFile'), (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation is not supported on /imageUpload');
    });


module.exports = musicUploadRouter;