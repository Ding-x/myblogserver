const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const musicSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    musicpath: {
        type: String,
        required: true
    },
    imagepath: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

var Musics = mongoose.model('Music', musicSchema);

module.exports = Musics;