import { Server } from 'socket.io'

let io

export const initializeSocket = (server) => {

    io = new Server(server,{
        cors:{
            origin:process.env.FRONTEND_URL,
            credentials:true
        }
    })

    io.on('connection',(socket)=>{

        console.log('Client connected:', socket.id)

        socket.on('disconnect',()=>{
            console.log('Client disconnected:', socket.id)
        })
    })
}

export const getIO = () => {

    if(!io){
        throw new Error('Socket.IO not initialized')
    }

    return io
}