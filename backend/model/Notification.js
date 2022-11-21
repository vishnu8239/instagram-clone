const mongoose = require('mongoose')
const {Schema} = mongoose

const notificationSchema = new Schema({
    username: String,
    action: {
        type: String,
        enum: ['like', 'comment', 'follow']
    },
    from: String,
    hash: String,
    date: {
        type: Date,
        default: Date.now
    },
    seen: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Notification', notificationSchema)
