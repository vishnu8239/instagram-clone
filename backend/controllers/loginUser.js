const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const parsePhoneNumber = require('libphonenumber-js')

const User = require('../model/User')

const loginUser = async (req, res) => {
    const { username, password } = req.body

    let phone, data

    // Username can be username, email or phone
    username.includes("@") ? data = { email: username } : data = { username: username }

    // Check if username is phone number
    if (!username.startsWith("+")) {
        phone = "+" + username
    }
 
    const phoneNumber = parsePhoneNumber(phone)

    if (phoneNumber !== undefined) {
        data = { phone: phoneNumber.formatInternational() }
    }

    const user = await User.findOne(data)

    if (user === null) {
        return res.json({
            status: "fail",
            reason: "The username you entered doesn't belong to an account. Please check your username and try again. "
        })
    }

    const hashed = user.password

    const match = await bcrypt.compare(password, hashed)

    // Incorrect password
    if (match === false) {
        return res.json({
            status: "fail",
            reason: "Sorry, your password was incorrect. Please double-check your password."
        })
    }

    const token = jwt.sign(
        {
            username
        },
        process.env.JWT_ACCESS_TOKEN
    )
    
    res.json({
        status: "success",
        reason: "Logged in as " + username,
        token
    })
}

module.exports = loginUser
