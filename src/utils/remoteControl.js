const http = require('http');
const { networkInterfaces } = require('os');

const PORT = 3847;

let server = null;
let onCommandCallback = null;
let connections = new Set(); // SSE response objects

let currentState = {
    response: '',
    responseIndex: 0,
    responseCount: 0,
    pinnedRefs: [],
    status: 'Listening...',
};

function getLocalIP() {
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return '127.0.0.1';
}

function updateState(partial) {
    Object.assign(currentState, partial);
    // Also push to any open SSE connections
    const data = `data: ${JSON.stringify({ ok: true, ...currentState })}\n\n`;
    for (const res of connections) {
        try { res.write(data); } catch { connections.delete(res); }
    }
}

function startServer(onCommand) {
    if (server) return { ip: getLocalIP(), port: PORT };

    onCommandCallback = onCommand;

    server = http.createServer((req, res) => {
        const cors = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        if (req.method === 'OPTIONS') {
            res.writeHead(204, cors); res.end(); return;
        }

        // GET /state — JSON snapshot of current state
        if (req.url.startsWith('/state') && req.method === 'GET') {
            res.writeHead(200, { ...cors, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true, ...currentState }));
            return;
        }

        // GET /events — SSE stream (optional, for JS-capable browsers)
        if (req.url.startsWith('/events') && req.method === 'GET') {
            res.writeHead(200, {
                ...cors,
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            });
            res.flushHeaders();
            res.write(`data: ${JSON.stringify({ ok: true, ...currentState })}\n\n`);
            connections.add(res);
            req.on('close', () => connections.delete(res));
            return;
        }

        // POST /command — handle a command from the helper (form or fetch)
        if (req.url === '/command' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
                try {
                    let msg;
                    const ct = req.headers['content-type'] || '';
                    if (ct.includes('application/json')) {
                        msg = JSON.parse(body);
                    } else {
                        // HTML form POST (urlencoded)
                        const params = new URLSearchParams(body);
                        msg = { command: params.get('command'), id: params.get('id'), text: params.get('text') };
                    }
                    if (onCommandCallback && msg.command) onCommandCallback(msg);
                } catch (e) {}
                // Redirect back to the page so the form submission refreshes
                res.writeHead(303, { Location: '/', 'Cache-Control': 'no-cache' });
                res.end();
            });
            return;
        }

        // GET / — server-rendered page, state baked in, meta-refresh every 1.5s
        const noCache = {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
        };
        res.writeHead(200, noCache);
        res.end(buildPage());
    });

    server.on('error', (err) => console.error('[RemoteControl] Server error:', err));

    server.listen(PORT, '0.0.0.0', () => {
        console.log(`[RemoteControl] Server ready — http://${getLocalIP()}:${PORT}`);
    });

    return { ip: getLocalIP(), port: PORT };
}

function stopServer() {
    for (const res of connections) { try { res.end(); } catch {} }
    connections.clear();
    if (server) { server.close(); server = null; }
    onCommandCallback = null;
    console.log('[RemoteControl] Server stopped');
}

function isRunning() { return server !== null; }

function esc(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function buildPage() {
    const s = currentState;
    const idx = (s.responseIndex || 0) + 1;
    const total = s.responseCount || 0;
    const counter = total > 0 ? `${idx} / ${total}` : '0 / 0';

    const responseHTML = s.response
        ? `<div class="resp">${esc(s.response)}</div>`
        : `<div class="resp muted">No response yet.</div>`;

    const pinsHTML = (s.pinnedRefs || []).length === 0
        ? '<span class="muted" style="font-size:11px">No pinned items yet</span>'
        : (s.pinnedRefs || []).map(p =>
            `<form method="POST" action="/command" style="display:inline">
              <input type="hidden" name="command" value="toggle-pin">
              <input type="hidden" name="id" value="${esc(p.id)}">
              <button type="submit" class="chip${p.active ? ' active' : ''}">${esc(p.icon)} ${esc(p.label)}</button>
            </form>`
          ).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<meta http-equiv="refresh" content="1">
<title>Remote — Meta Max Pro</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0e0e0e;--surface:#1a1a1a;--border:#2a2a2a;--text:#e0e0e0;--muted:#666;--blue:#3b82f6;--green:#22c55e;--red:#ef4444;--white:#fff}
body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px}
.bar{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--surface);border-bottom:1px solid var(--border);position:sticky;top:0}
.dot{width:8px;height:8px;border-radius:50%;background:var(--green);flex-shrink:0}
.title{font-size:13px;font-weight:600;margin-left:8px}
.live{font-size:10px;color:var(--muted);margin-left:4px}
.badge{font-size:11px;font-family:monospace;color:var(--muted);background:var(--border);padding:2px 8px;border-radius:10px}
.wrap{padding:12px;display:flex;flex-direction:column;gap:10px}
.card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:12px}
.lbl{font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin-bottom:8px}
.resp{font-size:13px;line-height:1.6;white-space:pre-wrap;word-break:break-word;max-height:45vh;overflow-y:auto}
.resp::-webkit-scrollbar{width:3px}.resp::-webkit-scrollbar-thumb{background:var(--border)}
.muted{color:var(--muted)}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.g1{display:grid;grid-template-columns:1fr;gap:8px}
button[type=submit]{display:flex;align-items:center;justify-content:center;gap:5px;padding:13px 8px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:13px;font-weight:500;cursor:pointer;width:100%;-webkit-tap-highlight-color:transparent}
button[type=submit]:active{background:#2a2a2a}
.acc{border-color:var(--white);color:var(--white)}
.grn{border-color:var(--green);color:var(--green)}
.red{border-color:var(--red);color:var(--red)}
.slbl{font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}
.ph{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.pins{display:flex;flex-wrap:wrap;gap:6px;min-height:18px}
.chip{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:20px;border:1px solid var(--border);background:var(--bg);color:var(--muted);font-size:11px;font-family:monospace;cursor:pointer;width:auto}
.chip.active{border-color:var(--white);color:var(--white)}
.hcard{background:var(--surface);border:1px solid var(--blue);border-radius:10px;padding:12px}
.hlbl{font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:var(--blue);margin-bottom:8px}
textarea{width:100%;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:6px;padding:10px;font-size:13px;font-family:inherit;resize:vertical;min-height:80px;outline:none;line-height:1.5}
textarea:focus{border-color:var(--blue)}
.sbtn{width:100%;margin-top:8px;padding:13px;background:var(--blue);color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer}
.sbtn:active{opacity:.8}
</style>
</head>
<body>
<div class="bar">
  <div style="display:flex;align-items:center">
    <div class="dot"></div>
    <span class="title">Meta Max Pro Remote</span>
    <span class="live">&#x25cf; live</span>
  </div>
  <span class="badge">${esc(counter)}</span>
</div>
<div class="wrap">

  <div class="card">
    <div class="lbl">Current Response</div>
    ${responseHTML}
  </div>

  <div style="display:flex;flex-direction:column;gap:8px">
    <div class="slbl">Navigate</div>
    <div class="g2">
      <form method="POST" action="/command"><input type="hidden" name="command" value="prev-response"><button type="submit" class="acc">&#8249; Previous</button></form>
      <form method="POST" action="/command"><input type="hidden" name="command" value="next-response"><button type="submit" class="acc">Next &#8250;</button></form>
    </div>
    <div class="g2">
      <form method="POST" action="/command"><input type="hidden" name="command" value="scroll-up"><button type="submit">&#8593; Scroll Up</button></form>
      <form method="POST" action="/command"><input type="hidden" name="command" value="scroll-down"><button type="submit">&#8595; Scroll Down</button></form>
    </div>
    <div class="g1">
      <form method="POST" action="/command"><input type="hidden" name="command" value="copy-to-clipboard"><button type="submit" class="grn">&#128203; Copy to App Clipboard</button></form>
    </div>
  </div>

  <div class="card">
    <div class="ph">
      <span class="slbl">Pinned Designs &amp; Code</span>
      <form method="POST" action="/command" style="display:inline">
        <input type="hidden" name="command" value="close-all-pins">
        <button type="submit" class="red" style="padding:4px 10px;font-size:11px;width:auto">Close All</button>
      </form>
    </div>
    <div class="pins">${pinsHTML}</div>
  </div>

  <div class="hcard">
    <div class="hlbl">Send to Screen</div>
    <form method="POST" action="/command">
      <input type="hidden" name="command" value="helper-message">
      <textarea name="text" placeholder="Type or paste anything — code, notes, a better answer...&#10;It will appear on the interview screen."></textarea>
      <button type="submit" class="sbtn">Send to Screen</button>
    </form>
  </div>

</div>
<script>
// Intercept all form submissions and use fetch instead —
// this prevents iOS Safari's "not secure" popup on HTTP form posts
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('form').forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var data = new URLSearchParams(new FormData(form)).toString();
      fetch('/command', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: data
      }).catch(function(){});
      // Clear textarea after send
      var ta = form.querySelector('textarea');
      if (ta) ta.value = '';
    });
  });
});
</script>
</body>
</html>`;
}

module.exports = { startServer, stopServer, updateState, isRunning, getLocalIP, PORT };
