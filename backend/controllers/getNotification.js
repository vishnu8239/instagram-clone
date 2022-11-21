const jwt = require('jsonwebtoken')
const Notification = require('../model/Notification')

const getNotification = async (req, res) => {
    const token = req.body.token

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
    
    const notification = await Notification.find(
        { username: data.username }
    ).sort("-date").limit(8).select("-_id -__v")

    if (notification === null) {
        return res.json({
            status: "success",
            reason: `No new notification for @${data.username}`,
            notification: null
        })
    }

    res.json({
        status: "success",
        notification
    })
}

module.exports = getNotification
