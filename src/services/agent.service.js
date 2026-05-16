// // import { ai } from './gemini.service.js'
// import { SYSTEM_PROMPT } from './prompt.service.js'
// import { executeCommand } from './tools.service.js'
// import { createAIInstance } from './gemini.service.js';  // <-- factory function

// const executeCommandDeclaration = {
//     name: 'executeCommand',
//     description: 'Execute terminal command',
//     parameters: {
//         type: 'OBJECT',
//         properties: {
//             command: {
//                 type: 'STRING'
//             }
//         },
//         required: ['command']
//     }
// }

// export const runAgent = async (message, socket, apiKey) => {   // <-- new parameter
//   try {
//     // Create a fresh AI instance with the user's key
//     const ai = createAIInstance(apiKey);

//     const history = [
//       {
//         role: 'user',
//         parts: [{ text: message }]
//       }
//     ];

//     let iterations = 0;
//     while (iterations < 10) {
//       iterations++;

//       const response = await ai.models.generateContent({
//         model: 'gemini-2.5-flash',
//         contents: history,
//         config: {
//           systemInstruction: SYSTEM_PROMPT,
//           tools: [
//             { functionDeclarations: [executeCommandDeclaration] }
//           ]
//         }
//       });

//       const functionCall = response.functionCalls?.[0];

//       if (functionCall) {
//         const command = functionCall.args.command;

//         if (socket) {
//           socket.emit('terminal:data', { type: 'command', content: command });
//         }

//         const result = await executeCommand(command, './workspaces/project-1');

//         if (socket) {
//           socket.emit('terminal:data', { type: 'result', content: result });
//         }

//         history.push({
//           role: 'model',
//           parts: [{ functionCall: { name: functionCall.name, args: functionCall.args } }]
//         });

//         history.push({
//           role: 'user',
//           parts: [{
//             functionResponse: {
//               name: functionCall.name,
//               response: { result }
//             }
//           }]
//         });
//       } else {
//         const text = response.text;
//         if (socket) {
//           socket.emit('ai:stream', { content: text });
//         }
//         return text;
//       }
//     }

//     return 'Max iterations reached';
//   } catch (error) {
//     console.error('Error in runAgent = ', error);
//     return `Error: ${error.message}`;
//   }
// };

//================= Better error responses ==================

import { SYSTEM_PROMPT } from './prompt.service.js'
import { executeCommand } from './tools.service.js'
import { createAIInstance } from './gemini.service.js'

const executeCommandDeclaration = {
  name: 'executeCommand',
  description: 'Execute terminal command',
  parameters: {
    type: 'OBJECT',
    properties: {
      command: {
        type: 'STRING'
      }
    },
    required: ['command']
  }
}

export const runAgent = async (message, socket, apiKey) => {

  // validate input
  if (!message) {
    const err = new Error('Prompt is required')
    err.statusCode = 400
    throw err
  }

  try {
    const ai = createAIInstance(apiKey)

    const history = [
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ]

    let iterations = 0

    while (iterations < 10) {
      iterations++

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: history,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          tools: [
            {
              functionDeclarations: [executeCommandDeclaration]
            }
          ]
        }
      })

      const functionCall = response.functionCalls?.[0]

      if (functionCall) {
        const command = functionCall.args.command

        socket?.emit('terminal:data', {
          type: 'command',
          content: command
        })

        const result = await executeCommand(
          command,
          './workspaces/project-1'
        )

        socket?.emit('terminal:data', {
          type: 'result',
          content: result
        })

        history.push({
          role: 'model',
          parts: [
            {
              functionCall: {
                name: functionCall.name,
                args: functionCall.args
              }
            }
          ]
        })

        history.push({
          role: 'user',
          parts: [
            {
              functionResponse: {
                name: functionCall.name,
                response: { result }
              }
            }
          ]
        })
      } else {
        const text = response.text

        socket?.emit('ai:stream', {
          content: text
        })

        return text
      }
    }

    const err = new Error('Max iterations reached')
    err.statusCode = 429
    throw err

  } catch (error) {

    console.error('runAgent error =>', error)

    /*
      GEMINI ERRORS
    */

    // invalid api key
    if (
      error.message?.includes('API key') ||
      error.message?.includes('invalid api key')
    ) {
      error.statusCode = 401
      error.customMessage = 'Invalid Gemini API key'
    }

    // quota exceeded
    else if (
      error.message?.includes('quota') ||
      error.message?.includes('rate limit') ||
      error.message?.includes('429')
    ) {
      error.statusCode = 429
      error.customMessage =
        'Gemini API quota exceeded. Please try later.'
    }

    // model not found
    else if (
      error.message?.includes('model') &&
      error.message?.includes('not found')
    ) {
      error.statusCode = 404
      error.customMessage = 'Gemini model not found'
    }

    // token limit exceeded
    else if (
      error.message?.includes('token') ||
      error.message?.includes('context length')
    ) {
      error.statusCode = 400
      error.customMessage =
        'Token/context limit exceeded'
    }

    // permission denied
    else if (
      error.message?.includes('permission') ||
      error.message?.includes('access denied')
    ) {
      error.statusCode = 403
      error.customMessage = 'Access denied'
    }

    // timeout
    else if (
      error.message?.includes('timeout') ||
      error.code === 'ETIMEDOUT'
    ) {
      error.statusCode = 504
      error.customMessage = 'Request timeout'
    }

    // fallback
    else {
      error.statusCode = error.statusCode || 500
      error.customMessage =
        error.message || 'Internal server error'
    }

    throw error
  }
}