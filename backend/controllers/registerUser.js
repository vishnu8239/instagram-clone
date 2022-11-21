const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const parsePhoneNumber = require('libphonenumber-js')

const User = require('../model/User')

const registerUser = async (req, res) => {
    const { fullname, contact, username, password } = req.body

    let phone, email

    // Atleast one of email or phone no. should be present
    if (contact) {
        contact.includes("@") ? email = contact : phone = contact
    } else {
        return res.json({
            status: "fail",
            reason: "Please enter phone no. or email eddress"
        })
    }

    // Check if email is valid
    if (email) {
        const validEmail = email.match(/[-\.+()<>_a-z0-9]+@[-a-z0-9]+\.[a-z]{1,3}(\.[a-z]{1,3})?/ig)
        
        if (validEmail === null || validEmail[0] !== email) {
            return res.json({
                status: "fail",
                reason: "Invalid email address"
            })
        }
    }

    // Format phone no. and save formatted in mobile variable
    if (phone) {
        if (!phone.startsWith("+")) {
            phone = "+" + phone
        }

        const phoneNumber = parsePhoneNumber(phone)

        if (phoneNumber === undefined) {
            return res.json({
                status: "fail",
                reason: "Looks like your phone number may be incorrect. Please try entering your full number, including the country code."
            })
        }
        
        phone = phoneNumber.formatInternational()
    }
    
    // Validate username format
    if (username) {
        if (username.length < 4 || username.length > 20) {
            return res.json({
                status: "fail",
                reason: "Username must be 4-20 characters long"
            })
        }

        if (username.startsWith("-") || username.endsWith("-")) {
            return res.json({
                status: "fail",
                reason: "Username can't start or end with hyphen"
            })
        }

        const match = username.match(/[~`\\!@#$%^'&*\(\)_+=\|{}\[\]":;<>,\.\?]/g)

        if (match !== null) {
            return res.json({
                status: "fail",
                reason: "Username can contain alphabets, numbers and hyphen"
            })
        }
    } else {
        return res.json({
            status: "fail",
            reason: "Username is required"
        })
    }

    // Validate password
    // Password must include capital, small alphabets, numbers and a symbol
    if (password) {
        //  Password should have atleast eight characters
        if (password.length < 8) {
            return res.json({
                status: "fail",
                reason: "Password should have atleast eight characters"
            })
        }

        const small = password.match(/[a-z]+/g)
        const capital = password.match(/[A-Z]+/g)
        const number = password.match(/[0-9]+/g)
        const symbol = password.match(/[-+~`@#$%^&*()_={}\[\]\/:;"'<>,?\.]+/g)
        
        if (small === null || capital === null || symbol === null || number === null) {
            return res.json({
                status: "fail",
                reason: "Password must include capital, small alphabets, numbers and a symbol"
            })
        }
    } else {
        return res.json({
            status: "fail",
            reason: "Password is required"
        })
    }

    const hashed = await bcrypt.hash(password, 10)

    // Check for duplicate username, phone or email
    const duplicate = await User.findOne({
        "$or": [
            { username },
            email ? { email } : { phone }
        ]
    })

    if (duplicate !== null) {
        if ((phone && duplicate.phone == phone) || (email && duplicate.email == email)) {
            return res.json({
                status: "fail",
                reason: "Email address or phone already registered"
            })
        }

        return res.json({
            status: "fail",
            reason: "This username isn't available. Please try another."
        })
    }

    // Save new user to database
    await User.create({
        fullname, email, phone, username, password: hashed
    })

    const token = jwt.sign(
        {
            username
        },
        process.env.JWT_ACCESS_TOKEN
    )

    res.json({
        status: "success",
        reason: "User registered successfully",
        token
    })
}

module.exports = registerUser
