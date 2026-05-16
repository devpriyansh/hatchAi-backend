import {
    runTerminalCommand,
    stopTerminalProcess
} from '../services/terminal/terminal.service.js'

import {
    getWorkspacePath
} from '../services/workspace.service.js'

import {
    getIO
} from '../sockets/socket.js'

export const runCommandController =
async(req,res)=>{

    try{

        const { command } = req.body

        const workspace =
            getWorkspacePath()

        const io = getIO()

        const result =
            await runTerminalCommand(
                command,
                workspace,
                io
            )

        return res.json({
            success:true,
            result
        })

    }catch(error){

        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const stopCommandController =
(req,res)=>{

    try{

        const { processId } = req.body

        stopTerminalProcess(processId)

        return res.json({
            success:true
        })

    }catch(error){

        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}