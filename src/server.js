import dotenv from 'dotenv'
dotenv.config()

import http from 'http'

import app from './app.js'

import {
    initializeSocket,
    getIO
} from './sockets/socket.js'

const PORT = process.env.PORT || 3000

const server = http.createServer(app)

initializeSocket(server)

app.use((req,res,next)=>{

    req.io = getIO()

    next()
})

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})