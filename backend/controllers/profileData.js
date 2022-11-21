const jwt = require('jsonwebtoken')
const User = require("../model/User")

const userInfo = async (req, res) => {
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

    data = await User.findOne(
        { username },
        {
            _id: false, 
            __v: false, 
            password: false 
        }
    )

    if (data === null) {
        return res.json({
            status: 'fail',
            reason: 'No user found with username "' + username + '"'
        })
    }

    res.json({
        status: "success",
        reason: "Successfully fetched data for " + username,
        data
    })
}

module.exports = userInfo
