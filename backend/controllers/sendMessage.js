const jwt = require('jsonwebtoken')
const Message = require('../model/Message')
const User = require('../model/User')

const sendMessage = async (req, res) => {
    const token = req.body.token
    const message = req.body.message
    const to = req.body.to

    if (token === undefined) {
        return res.json({
            status: "fail",
            reason: "Please log in to access this page"
        })
    }

    if (!message || !to) {
        return res.json({
            status: "fail",
            reason: "Malformed input - message, to fields are required"
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

    const validate = await User.findOne({
        username: to
    })

    if (validate === null) {
        return res.json({
            status: "fail",
            reason: "Invalid username. Can't send message to @" + to
        })
    }

    const sent = await Message.create({
        sender: data.username,
        to,
        message
    })

    res.json({
        status: "success",
        data: {
            ...sent._doc, 
            _id: undefined, 
            __v: undefined
        }
    })
}

module.exports = sendMessage
