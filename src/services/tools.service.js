import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const blockedCommands = [
    'rm -rf',
    'shutdown',
    'reboot',
    'mkfs',
    'sudo'
]

export const executeCommand = async(command, cwd)=>{

    try{

        const isBlocked = blockedCommands.some(cmd =>
            command.includes(cmd)
        )

        if(isBlocked){
            return 'Dangerous command blocked'
        }

        const { stdout, stderr } = await execAsync(command,{
            cwd
        })

        if(stderr){
            return stderr
        }

        return stdout

    }catch(error){
        return error.message
    }
}