const mongoose = require('mongoose')
const { Schema } = mongoose

const messageSchema = new Schema({
    sender: String,
    to: String,
    message: String,
    seen: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Message", messageSchema)
