import {
   runAgent
} from '../services/ai.service.js'

export async function chatController(
   req,
   res
){

   try{

      const {
         prompt,
         socketId
      } = req.body

      const io = req.app.get('io')

      const socket =
         io.sockets.sockets.get(
            socketId
         )

      runAgent({
         prompt,
         socket
      })

      return res.json({
         success:true
      })

   }
   catch(error){

      return res.status(500).json({
         success:false,
         message:error.message
      })
   }
}