const jwt = require('jsonwebtoken')
const Post = require('../model/Post')
const Notification = require('../model/Notification')

const likePost = async (req, res) => {
    const token = req.body.token

    // Can be like or unlike
    const action = req.body.action

    // Post hash
    const hash = req.body.hash

    if (!action || !hash) {
        return res.json({
            status: "fail",
            reason: "Malformed input - action, hash fields are required"
        })
    }

    if (token === undefined) {
        return res.json({
            status: "fail",
            reason: "Please log in to access this page"
        })
    }

    let data

    try {
        data = jwt.verify(token, process.env.JWT_ACCESS_TOKEN)
    } catch (error) {
        return res.json({
            status: "fail",
            reason: "Invalid token. Please login again to get a new token."
        })
    }

    let condition = { $addToSet: { likes: data.username }}

    if (action == "unlike") {
        condition = { $pull: { likes: data.username }}
    }

    const updated = await Post.findOneAndUpdate(
        { hash },
        condition,
        { new: true }
    ).select("-_id -__v")

    if (updated === null) {
        return res.json({
            status: "fail",
            reason: "Invalid post hash"
        })
    }

    // Add liked post to notification
    if (action == "like") {
        const save = await Notification.create({
            username: updated.username,
            action,
            from: data.username,
            hash
        })
    }

    res.json({
        status: "success",
        action,
        post: updated
    })
}

module.exports = likePost
