const jwt = require('jsonwebtoken')
const fs = require('fs')
const Post = require('../model/Post')
const User = require('../model/User')
const crypto = require('crypto')

const createPost = async (req, res) => {
    const token = req.headers.token

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

    const username = data.username

    const image = fs.readFileSync(req.file.path)
    const encoded = image.toString('base64')

    const photo = {
        contentType: req.file.mimetype,
        data: Buffer.from(encoded, 'base64')
    }

    const caption = req.body.caption

    const hash = crypto.randomBytes(20).toString('hex')

    const result = await Post.create({
        username,
        photo,
        caption,
        hash
    })

    const updated = await User.findOneAndUpdate(
        { username },
        {
            $push: { posts: result._id }
        },
        { new: true }
    ).select('-_id -__v -email -phone -password')

    res.json({
        status: "success",
        mime: photo.contentType,
        image: photo.data,
        profile: updated
    })
}

module.exports = createPost
