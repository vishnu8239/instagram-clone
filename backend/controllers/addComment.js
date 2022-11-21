const jwt = require('jsonwebtoken')
const Post = require('../model/Post')
const Notification = require('../model/Notification')

const addComment = async (req, res) => {
    const token = req.body.token

    // Comment for post
    const comment = req.body.comment

    // Post hash
    const hash = req.body.hash

    if (!comment || !hash) {
        return res.json({
            status: "fail",
            reason: "Malformed input - comment, hash fields are required"
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

    const updated = await Post.findOneAndUpdate(
        { hash },
        {
            $push: {
                comments: { username: data.username, comment }
            }
        },
        { new: true }
    ).select("-_id -__v")

    if (updated === null) {
        return res.json({
            status: "fail",
            reason: "Invalid post hash"
        })
    }

    const save = await Notification.create({
        username: updated.username,
        action: "comment",
        from: data.username,
        hash
    })
    
    res.json({
        status: "success",
        post: updated
    })
}

module.exports = addComment
