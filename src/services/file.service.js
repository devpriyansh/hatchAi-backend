import fs from 'fs'
import path from 'path'

export const readFileContent = (filePath) => {

    return fs.readFileSync(filePath,'utf-8')
}

export const writeFileContent = (
    filePath,
    content
) => {

    fs.writeFileSync(filePath, content)

    return true
}

export const createFile = (filePath) => {

    fs.writeFileSync(filePath,'')

    return true
}

export const deleteFile = (filePath) => {

    fs.unlinkSync(filePath)

    return true
}