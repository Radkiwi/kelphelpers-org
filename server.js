const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  let filePath = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);
  if (!path.extname(filePath)) filePath = path.join(filePath, 'index.html');
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(__dirname)) { res.writeHead(403); res.end('Forbidden'); return; }
  fs.readFile(resolved, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/html' }); res.end('<h1>404</h1>'); return; }
    res.writeHead(200, { 'Content-Type': mimeTypes[path.extname(resolved)] || 'text/plain' });
    res.end(data);
  });
}).listen(PORT, () => console.log(`kelphelpers.org running on port ${PORT}`));
