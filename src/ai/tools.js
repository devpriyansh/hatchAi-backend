import path from 'path'

import {
   createFile,
   writeFileContent,
   readFileContent
} from '../services/file.service.js'

import {
   getWorkspacePath
} from '../services/workspace.service.js'

export async function executeTool(
   toolName,
   args
){

   const workspace =
      getWorkspacePath()

   switch(toolName){

      case 'createFile':{

         const fullPath =
            path.join(
               workspace,
               args.path
            )

         createFile(fullPath)

         return 'File created'
      }

      case 'writeFile':{

         const fullPath =
            path.join(
               workspace,
               args.path
            )

         writeFileContent(
            fullPath,
            args.content
         )

         return 'File updated'
      }

      case 'readFile':{

         const fullPath =
            path.join(
               workspace,
               args.path
            )

         return readFileContent(
            fullPath
         )
      }

      default:
         return 'Unknown tool'
   }
}