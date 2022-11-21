const jwt = require('jsonwebtoken')
const Message = require('../model/Message')

const getMessages = async (req, res) => {
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

    const username = data.username

    const messages = await Message.find({
        $or: [
            {sender: username}, {to: username}
        ]
    }).select('-_id -__v').sort('-date')

    res.json({
        status: 'success',
        data: messages
    })
}

module.exports = getMessages
