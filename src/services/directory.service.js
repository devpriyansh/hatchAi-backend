import fs from 'fs'
import path from 'path'

export const getDirectoryTree = (dirPath) => {

    const items = fs.readdirSync(dirPath)

    return items.map(item => {

        const fullPath =
            path.join(dirPath, item)

        const stats =
            fs.statSync(fullPath)

        if(stats.isDirectory()){

            return {
                name:item,
                type:'folder',
                children:getDirectoryTree(fullPath)
            }
        }

        return {
            name:item,
            type:fullPath
        }
    })
}