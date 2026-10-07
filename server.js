/**
 * EcoQuest - Standalone Lightweight Node Server
 *
 * Provides POST /api/generate-quest and serves static files from dist/
 * Zero external backend frameworks needed (uses native Node.js http).
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { handleGenerateQuestRequest } from './server/questApiHandler.js';

const PORT = process.env.PORT || 5173;
const DIST_DIR = path.resolve(process.cwd(), 'dist');

// MIME types for static assets
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // Route: POST /api/generate-quest
  if (url.pathname === '/api/generate-quest') {
    handleGenerateQuestRequest(req, res);
    return;
  }

  // Serve static files from dist/ if available
  if (fs.existsSync(DIST_DIR)) {
    let filePath = path.join(DIST_DIR, url.pathname === '/' ? 'index.html' : url.pathname);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.statusCode = 500;
        res.end('Server error loading file');
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      res.end(content);
    });
    return;
  }

  res.statusCode = 404;
  res.end('Not found');
});

if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  server.listen(PORT, () => {
    console.log(`[EcoQuest Server] Running at http://localhost:${PORT}`);
  });
}

export default server;
