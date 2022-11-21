const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    fullname: {
        type: String,
        default: undefined,
        required: false
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        default: undefined,
        required: false
    },
    phone: {
        type: String,
        default: undefined,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: false
    },
    profile: {
        type: String,
        enum: ['Private', 'Public'],
        default: "Public"
    },
    followers: [String],
    following: [String],
    posts: [Schema.Types.ObjectId]
})

module.exports = mongoose.model("User", userSchema)
