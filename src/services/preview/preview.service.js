import net from 'net';
import express from 'express';
import { runTerminalCommand } from '../terminal/terminal.service.js';
import { detectFramework } from './framework-detector.service.js';
import httpProxy from 'http-proxy';

// Map: workspacePath -> { server: http.Server, url: string }
const activePreviews = new Map();

/**
 * Returns a free port on localhost
 */
const getFreePort = () => {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', reject);
  });
};

/**
 * Check if a port is open (already listening)
 */
const isPortOpen = (port) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);

    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => resolve(false));
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, '127.0.0.1');
  });
};

/**
 * Start a simple static file server using Express
 */
const startStaticServer = async (workspacePath, io) => {
  const port = await getFreePort();
  const app = express();
  app.use(express.static(workspacePath));

  return new Promise((resolve, reject) => {
    const server = app.listen(port, '127.0.0.1', () => {
      const url = `http://localhost:${port}`;
      activePreviews.set(workspacePath, { server, url });

      io.emit('preview:started', { previewUrl: url });
      resolve({ previewUrl: url });
    });

    server.on('error', reject);
  });
};

/**
 * Stop and remove any previous preview for this workspace
 */
const stopPreviousPreview = (workspacePath) => {
  const current = activePreviews.get(workspacePath);
  if (current) {
    current.server.close();
    activePreviews.delete(workspacePath);
  }
};

/**
 * Main function – starts framework or fallback static server
 */
export const startPreviewServer = async (workspacePath, io) => {
  // Stop existing server (if any)
  stopPreviousPreview(workspacePath);

  // Try to detect a framework
  const framework = detectFramework(workspacePath);

  // if (!framework) {
  //   // No framework → start static server
  //   return await startStaticServer(workspacePath, io);
  // }

  if (!framework) {
    // Start static server
    const port = await getFreePort();
    const app = express();
    app.use(express.static(workspacePath));

    return new Promise((resolve, reject) => {
      const server = app.listen(port, '127.0.0.1', () => {
        const previewPort = port; // store port, not URL
        activePreviews.set(workspacePath, { server, port: previewPort });
        // Emit a special event – we'll handle it on the frontend later
        io.emit('preview:started', { port: previewPort });
        resolve({ previewPort });
      });
      server.on('error', reject);
    });
  }


  // Framework detected → run its command
  await runTerminalCommand(framework.command, workspacePath, io);

  // Wait for the default port to become available
  let retries = 15;
  while (retries-- > 0) {
    const running = await isPortOpen(framework.defaultPort);
    if (running) {
      const url = `http://localhost:${framework.defaultPort}`;
      // We don't have a server object here, but we store just the URL
      activePreviews.set(workspacePath, { url });
      io.emit('preview:started', { previewUrl: url });
      return { previewUrl: url };
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // If it didn't start, throw
  stopPreviousPreview(workspacePath);
  throw new Error('Preview server failed to start');
};

/**
 * Get the current preview URL (if any)
 */
export const getPreviewUrl = (workspacePath) => {
  const entry = activePreviews.get(workspacePath);
  return entry ? entry.url : null;
};