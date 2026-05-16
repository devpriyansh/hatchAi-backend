import { spawn } from 'child_process'

import { v4 as uuidv4 } from 'uuid'

import {
    addProcess,
    getProcess,
    removeProcess
} from './process.service.js'

const blockedCommands = [
    'rm',
    'sudo',
    'shutdown',
    'reboot',
    'mkfs'
]

export const runTerminalCommand = (
    command,
    cwd,
    io
) => {

    return new Promise((resolve,reject)=>{

        const isBlocked =
            blockedCommands.some(cmd =>
                command.includes(cmd)
            )

        if(isBlocked){

            return reject(
                new Error('Dangerous command blocked')
            )
        }

        const processId = uuidv4()

        const childProcess = spawn(
            command,
            [],
            {
                cwd,
                shell:true
            }
        )

        addProcess(
            processId,
            childProcess
        )

        io.emit('terminal:data',{
            processId,
            type:'command',
            content:command
        })

        childProcess.stdout.on('data',(data)=>{

            io.emit('terminal:data',{
                processId,
                type:'stdout',
                content:data.toString()
            })
        })

        childProcess.stderr.on('data',(data)=>{

            io.emit('terminal:data',{
                processId,
                type:'stderr',
                content:data.toString()
            })
        })

        childProcess.on('close',(code)=>{

            io.emit('terminal:data',{
                processId,
                type:'exit',
                content:`Process exited with code ${code}`
            })

            removeProcess(processId)

            resolve({
                processId,
                code
            })
        })

        childProcess.on('error',(error)=>{

            io.emit('terminal:data',{
                processId,
                type:'error',
                content:error.message
            })

            removeProcess(processId)

            reject(error)
        })
    })
}

export const stopTerminalProcess = (
    processId
) => {

    const process =
        getProcess(processId)

    if(!process){
        throw new Error('Process not found')
    }

    process.kill()

    removeProcess(processId)

    return true
}