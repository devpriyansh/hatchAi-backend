import path from 'path'
import fs from 'fs'

const WORKSPACE_ROOT = path.resolve('workspaces')

export const getWorkspacePath = (projectId='project-1') => {

    const workspacePath =
        path.join(WORKSPACE_ROOT, projectId)

    if(!fs.existsSync(workspacePath)){
        fs.mkdirSync(workspacePath,{
            recursive:true
        })
    }

    return workspacePath
}