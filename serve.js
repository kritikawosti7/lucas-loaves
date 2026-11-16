const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const root = path.resolve(__dirname);
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.dtd': 'text/xml; charset=utf-8',
  '.gif': 'image/gif',
  '.wav': 'audio/wav',
  '.xml': 'application/xml; charset=utf-8',
  '.xsl': 'application/xslt+xml; charset=utf-8',
};

http.createServer((request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400).end('Bad request');
    return;
  }
  if (pathname === '/') pathname = '/lucas_loaves.xml';

  const filePath = path.resolve(root, `.${pathname}`);
  const relativePath = path.relative(root, filePath);
  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      response.writeHead(404).end('Not found');
      return;
    }
    response.writeHead(200, {
      'Content-Length': stats.size,
      'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
    });
    if (request.method === 'HEAD') response.end();
    else fs.createReadStream(filePath).pipe(response);
  });
}).listen(4173, '127.0.0.1', () => {
  console.log('Luca\'s Loaves preview: http://127.0.0.1:4173/lucas_loaves.xml');
});