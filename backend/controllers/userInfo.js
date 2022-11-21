const jwt = require('jsonwebtoken')
const User = require('../model/User')

// Searches a user by username
// Required to show profile information of that user
const userInfo = async (req, res) => {
    const token = req.body.token
    const username = req.body.username

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

    data = await User.find(
        { username },
        {
            _id: false, 
            __v: false, 
            email: false,
            phone: false,
            password: false
        }
    )

    if (data.length === 0) {
        return res.json({
            status: "success",
            reason: `User @${username} doesn't exist`,
            data: null
        })
    }

    const user = {...data[0]._doc}

    if (user.profile == "Private") {
        user.posts = user.posts.length
        user.followers = user.followers.length
        user.following = user.following.length
    }

    res.json({
        status: "success",
        reason: `Profile information for @${username}`,
        data: user
    })
}

module.exports = userInfo
