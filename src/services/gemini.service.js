// import { GoogleGenAI } from '@google/genai'
// import dotenv from 'dotenv'
// dotenv.config()
// import { getApiKeyForSocket } from '../routes/set-api-key.routes'; // adjust path


// export const ai = new GoogleGenAI({
//     apiKey:process.env.GEMINI_API_KEY
// })

//===================By user apiKey=========

// services/gemini.service.js
import { GoogleGenAI } from '@google/genai';

export const createAIInstance = (apiKey) => {
  return new GoogleGenAI({ apiKey:apiKey });
};

// No more default export using process.env