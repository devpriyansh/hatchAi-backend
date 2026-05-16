import {
    startPreviewServer,
    getPreviewUrl
} from '../services/preview/preview.service.js'

import {
    getWorkspacePath
} from '../services/workspace.service.js'

import {
    getIO
} from '../sockets/socket.js'

// export const startPreviewController =
// async(req,res)=>{

//     try{

//         const workspace =
//             getWorkspacePath()

//         const io = getIO()

//         const result =
//             await startPreviewServer(
//                 workspace,
//                 io
//             )

//         return res.json({
//             success:true,
//             ...result
//         })

//     }catch(error){

//         return res.status(500).json({
//             success:false,
//             message:error.message
//         })
//     }
// }

// startPreviewController.js
export const startPreviewController = async (req, res) => {
  try {
    const workspace = getWorkspacePath();
    const io = getIO();
    const result = await startPreviewServer(workspace, io);
    return res.json({ success: true, previewPort: result.previewPort });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPreviewController =
(req,res)=>{

    try{

        const workspace =
            getWorkspacePath()

        const previewUrl =
            getPreviewUrl(workspace)

        return res.json({
            success:true,
            previewUrl
        })

    }catch(error){

        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}