const jwt = require('jsonwebtoken')
const User = require("../model/User")

const searchUsers = async (req, res) => {
    const token = req.body.token

    const search = req.body.search

    if (!search) {
        return res.json({
            status: "fail",
            reason: "Malformed input - search field is required"
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

    // Search user in database
    // Matches search string in fullname or username
    data = await User.find(
        {
            "$or": [
                { username: {$regex: search, $options: 'i'} },
                { fullname: {$regex: search, $options: 'i'} }
            ]
        },
        {
            _id: false, 
            __v: false, 
            email: false,
            phone: false,
            password: false,
            followers: false,
            following: false,
            posts: false
        }
    ).limit(10)

    if (data === null) {
        return res.json({
            status: "success",
            reason: `User doesn't exist with ${search} username`,
            data: []
        })
    }
    
    data = data.filter(user => user.username !== me)

    res.json({
        status: "success",
        reason: `Search results for ${search}`,
        data
    })
}

module.exports = searchUsers
