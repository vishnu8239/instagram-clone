const dotenv = require('dotenv')
const cors = require('cors')
const mongoose = require('mongoose')
const cookies = require('cookie-parser')
const express = require('express')
const app = express()

const authRoute = require('./routes/api/auth')

const PORT = process.env.PORT || 5000

// Loads environment variables globally during development
// Using .env file
dotenv.config()

app.use(cookies())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const whitelist = ['http://localhost:3000', 'undefined', 'https://clon-instagram.herokuapp.com']

app.use(cors({
    origin: (origin, callback) => {
        if (whitelist.some(item => String(origin) == item)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by cors'))
        }
    },
    optionsSuccessStatus: 200
}))

// Routes
app.use('/api', authRoute)

// Connect to database
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => { console.log("Successfully connected to database") })
    .catch(error => {
        console.log("[-] Mongoose error")
        console.log(error)
    })

// socket.io server setup
const server = require('http').createServer(app)

const io = require('socket.io')(server, {
    cors: {
        origin: whitelist,
        methods: ['GET', "POST"]
    }
})

io.on('connection', socket => {
    socket.on('join', data => {
        socket.join(data.username)
    })

    socket.on('message', data => {
        // Send private message to "data.to" username
        io.sockets.in(data.to).emit('chat', {
            from: data.username,
            message: data.message
        })
    })
})

server.listen(PORT, () => {
    console.log("Server running on port " + PORT)
})
