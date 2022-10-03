const { text } = require('body-parser');
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    channelTitle: {
        type: String,
        require: true,
    },
    videoId: {
        type: String,
        require: true,
        unique: true,
        dropDups: true,
    },
    publishedAt: {
        type: Date,
        require: true,
    },
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    }
});

schema.index({
    title: "text",
    description: "text",
});

schema.index({
    publishedAt: -1,
});

const mySchema = mongoose.model('youtubeVideos', schema);

module.exports.mySchema = mySchema;

