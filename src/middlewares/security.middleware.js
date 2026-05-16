const blockedCommands = [
    'rm -rf',
    'shutdown',
    'reboot',
    'mkfs',
    'sudo',
]

export const validateCommand = (command) => {

    const isBlocked = blockedCommands.some(cmd =>
        command.includes(cmd)
    )

    if(isBlocked){
        throw new Error('Dangerous command blocked')
    }

    return true
}