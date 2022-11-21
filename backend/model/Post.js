const mongoose = require('mongoose')
const { Schema } = mongoose

const postSchema = new Schema({
    username: String,
    photo: {
        data: Buffer,
        contentType: String
    },
    caption: String,
    likes: [String],
    comments: [{
        username: String,
        comment: String,
        likes: [String]
    }],
    hash: String,
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Post", postSchema)
