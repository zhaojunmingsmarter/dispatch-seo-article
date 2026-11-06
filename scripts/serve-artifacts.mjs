// Local JSON artifact inspection only; this is not a public blog or tool renderer.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.url === '/') {
    res.end(JSON.stringify({ type: 'article-staging', deployed: false, artifact: '/blog-posts.additions.json' }));
  } else if (req.url === '/blog-posts.additions.json') {
    try { res.end(await readFile('dist/blog-posts.additions.json')); }
    catch { res.writeHead(404); res.end('{"error":"Run npm run build first"}'); }
  } else { res.writeHead(404); res.end('{"error":"No public page renderer in this repository"}'); }
}).listen(4173, '0.0.0.0', () => console.log('Artifact inspection on :4173; not a website deployment'));
