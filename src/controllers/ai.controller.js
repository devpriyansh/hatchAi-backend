import { runAgent } from '../services/agent.service.js'
import { getIO } from '../sockets/socket.js'
import { getApiKeyForSocket } from '../routes/set-api-key.routes.js'

export const chatController = async (req, res) => {
  try {

    const { prompt, socketId } = req.body

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'PROMPT_REQUIRED',
          message: 'Prompt is required'
        }
      })
    }

    if (!socketId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'SOCKET_ID_REQUIRED',
          message: 'Socket ID is required'
        }
      })
    }

    const apiKey = getApiKeyForSocket(socketId)

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'API_KEY_MISSING',
          message:
            'API key not set. Please enter Gemini API key.'
        }
      })
    }

    const io = getIO()
    const socket = io.sockets.sockets.get(socketId)

    if (!socket) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'SOCKET_NOT_FOUND',
          message: 'Socket not found. Please reconnect.'
        }
      })
    }

    const response = await runAgent(
      prompt,
      socket,
      apiKey
    )

    return res.status(200).json({
      success: true,
      response
    })

  } catch (error) {

    console.error('chatController error =>', error)

    return res.status(error.statusCode || 500).json({
      success: false,
      error: {
        code:
          error.code ||
          'INTERNAL_SERVER_ERROR',

        message:
          error.customMessage ||
          error.message ||
          'Something went wrong',

        details: process.env.NODE_ENV === 'development'
          ? error.stack
          : undefined
      }
    })
  }
}