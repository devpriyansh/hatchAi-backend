import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import aiRoutes from './routes/ai.routes.js'
import fileRoutes from './routes/file.routes.js'
import terminalRoutes from './routes/terminal.routes.js'
import previewRoutes from './routes/preview.routes.js'
import ai_2Routes from './routes/ai.routes.js'
import setApiKeyRoutes from './routes/set-api-key.routes.js'

import httpProxy from 'http-proxy';
const previewProxy = httpProxy.createProxyServer({});

import { configDotenv } from 'dotenv'


import healthRoutes from './routes/health.routes.js'

import { errorMiddleware } from './middlewares/error.middleware.js'

const app = express()

app.use(cors({
    // origin: process.env.FRONTEND_URL,
    // origin: 'http://localhost:5173',
    origin: 'https://hatch-ai-frontend.vercel.app',
    credentials:true
}))

// app.use(helmet())
app.use(helmet({
  frameguard: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      frameAncestors: ["'self'", "https://hatch-ai-frontend.vercel.app"],
    },
  },
}))

app.use(morgan('dev'))

app.use(express.json({
    limit:'10mb'
}))

app.use(express.urlencoded({
    extended:true
}))

app.use('/api/health', healthRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/files', fileRoutes)
app.use('/api/terminal', terminalRoutes)

app.use('/preview/:port', (req, res, next) => {
  const port = parseInt(req.params.port, 10);
  if (isNaN(port)) {
    // Not a numeric port – likely /preview/start or /preview/
    return next();
  }

  const target = `http://127.0.0.1:${port}`;
  // Strip the /preview/:port prefix so the internal server sees the file path
  req.url = req.url.substring(`/preview/${port}`.length) || '/';

  previewProxy.web(req, res, { target }, (err) => {
    console.error('Proxy error:', err);
    res.status(500).send('Preview not available');
  });
});

app.use('/preview', previewRoutes)




app.use('/api/ai2', ai_2Routes)
app.use('/api/key', setApiKeyRoutes);

app.use(errorMiddleware)

export default app