import path from 'path'
import { getIO } from '../sockets/socket.js'
import fs from 'fs/promises'

import {
    getWorkspacePath
} from '../services/workspace.service.js'

import {
    readFileContent,
    writeFileContent,
    createFile,
    deleteFile
} from '../services/file.service.js'

import {
    getDirectoryTree
} from '../services/directory.service.js'

export const getFileContentController =
async (req,res)=>{

   try{

      const workspace =
         getWorkspacePath()

      const filePath =
         path.join(
            workspace,
            req.query.path
         )

      const content =
         await fs.readFile(
            filePath,
            'utf-8'
         )

      res.json({
         success:true,
         content
      })

   }
   catch(error){

      res.status(500).json({
         success:false,
         message:error.message
      })

   }

}

export const getFilesController = (req,res)=>{

    try{

        const workspace =
            getWorkspacePath()

        const tree =
            getDirectoryTree(workspace)

        return res.json({
            success:true,
            files:tree
        })

    }catch(error){

        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const readFileController = (req,res)=>{

    try{

        const { filePath } = req.query

        const workspace =
            getWorkspacePath()

        const absolutePath =
            path.join(workspace, filePath)

        const content =
            readFileContent(absolutePath)

        return res.json({
            success:true,
            content
        })

    }catch(error){

        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const writeFileController = (req,res)=>{

    try{

        const {
            filePath,
            content
        } = req.body

        const workspace =
            getWorkspacePath()

        const absolutePath =
            path.join(workspace, filePath)

        writeFileContent(
            absolutePath,
            content
        )

        const io = getIO()

        io.emit('file:updated',{
            filePath,
            content
        })

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

export const createFileController = (req,res)=>{

    try{

        const { filePath } = req.body

        const workspace =
            getWorkspacePath()

        const absolutePath =
            path.join(workspace, filePath)

        createFile(absolutePath)

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

export const deleteFileController = (req,res)=>{

    try{

        const { filePath } = req.body

        const workspace =
            getWorkspacePath()

        const absolutePath =
            path.join(workspace, filePath)

        deleteFile(absolutePath)

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