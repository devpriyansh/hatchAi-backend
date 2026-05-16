import { ai } from '../config/ai.js'

import {
   executeTool
} from '../ai/tools.js'

import {
   toolDeclarations
} from '../ai/toolDeclarations.js'

export async function runAgent({

   prompt,
   socket
}){

   const history = [

      {
         role:'user',
         parts:[
            {
               text:prompt
            }
         ]
      }

   ]

   while(true){

      const response =
         await ai.models.generateContent({

            model:'gemini-2.5-flash',

            contents:history,

            config:{

               systemInstruction:`

You are an expert fullstack AI software engineer.

Rules:
- always create production-ready code
- always create complete files
- always use modern UI
- always fix errors properly
- never generate broken code
- always think step-by-step

               `,

               tools:[
                  {
                     functionDeclarations:
                        [toolDeclarations]
                  }
               ]
            }
         })

      if(
         response.functionCalls &&
         response.functionCalls.length > 0
      ){

         const call =
            response.functionCalls[0]

         socket.emit(
            'tool:start',
            {
               tool:call.name
            }
         )

         const result =
            await executeTool(
               call.name,
               call.args
            )

         socket.emit(
            'tool:end',
            {
               tool:call.name,
               result
            }
         )

         history.push({
            role:'model',
            parts:[
               {
                  functionCall:call
               }
            ]
         })

         history.push({
            role:'user',
            parts:[
               {
                  functionResponse:{
                     name:call.name,
                     response:{
                        result
                     }
                  }
               }
            ]
         })

      }else{

         socket.emit(
            'ai:chunk',
            response.text
         )

         socket.emit('ai:end')

         break
      }
   }
}