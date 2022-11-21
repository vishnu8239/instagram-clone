const jwt = require('jsonwebtoken')
const User = require("../model/User")
const Notification = require("../model/Notification")

const followUser = async (req, res) => {
    const token = req.body.token

    const usernameFollow = req.body.username

    // Can be follow or unfollow
    const action = req.body.action

    if (!usernameFollow) {
        return res.json({
            status: "fail",
            reason: "Malformed input - username field is required"
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

    const me = data.username

    if (me == usernameFollow) {
        return res.json({
            status: "fail",
            reason: `User (@${me}) shouldn't be same as follower`
        })
    }

    let follower, following, message

    if (action == "follow") {
        follower = { $addToSet: { followers: me } }
        following = { $addToSet: { following: usernameFollow } }
        message = `You started following @${usernameFollow}`
    } else {
        follower = { $pull: { followers: me } }
        following = { $pull: { following: usernameFollow } }
        message = `You are not following @${usernameFollow}`
    }

    // addtoset makes sure no duplicates are added
    const updated = await User.findOneAndUpdate(
        { username: usernameFollow },
        follower,
        { new: true }
    ).select("-_id -__v -email -phone -password")

    if (updated === null) {
        return res.json({
            status: "fail",
            reason: `Username (@${usernameFollow}) doesn't exist`
        })
    }

    data = await User.findOneAndUpdate(
        { username: me },
        following,
        { new: true }
    ).select("-_id -__v -email -phone -password")

    const save = await Notification.create({
        username: usernameFollow,
        action: "follow",
        from: me
    })
    
    res.json({
        status: "success",
        reason: message,
        data: updated,
        profile: data
    })
}

module.exports = followUser
