const runningProcesses = new Map()

export const addProcess = (
    processId,
    process
) => {

    runningProcesses.set(processId, process)
}

export const getProcess = (
    processId
) => {

    return runningProcesses.get(processId)
}

export const removeProcess = (
    processId
) => {

    runningProcesses.delete(processId)
}