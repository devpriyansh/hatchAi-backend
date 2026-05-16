// routes/api.js (or add to your existing routes)
import express from 'express';
import { getIO } from '../sockets/socket.js';

const router = express.Router();

// In-memory store for API keys: socketId -> apiKey
const userApiKeys = new Map();

// Set API key
router.post('/set-api-key', (req, res) => {
  const { apiKey, socketId } = req.body;
  if (!apiKey || !socketId) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }
  userApiKeys.set(socketId, apiKey);
  return res.json({ success: true });
});

// Check if API key exists for a socket
router.get('/has-api-key', (req, res) => {
  const socketId = req.query.socketId;
  if (!socketId) return res.json({ hasKey: false });
  const key = userApiKeys.get(socketId);
  return res.json({ hasKey: !!key });
});

// Helper to retrieve the key for a socket
export const getApiKeyForSocket = (socketId) => userApiKeys.get(socketId) || null;

export default router;