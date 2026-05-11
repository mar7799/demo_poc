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
  <span class="badge" id="badge">${esc(counter)}</span>
</div>
<div id="offline" style="display:none;background:#1a0a0a;border-bottom:2px solid var(--red);padding:10px 16px;align-items:center;gap:8px;font-size:13px;color:var(--red)">
  &#9888; App is offline — waiting for it to restart...
</div>
<div class="wrap">

  <div class="card">
    <div class="lbl">Current Response</div>
    <div id="resp" class="resp${s.response ? '' : ' muted'}" data-last="${esc(s.response)}">${s.response ? esc(s.response) : 'No response yet.'}</div>
  </div>

  <div style="display:flex;flex-direction:column;gap:8px">
    <div class="slbl">Navigate</div>
    <div class="g2">
      <button type="button" class="acc" id="btn-prev">&#8249; Previous</button>
      <button type="button" class="acc" id="btn-next">Next &#8250;</button>
    </div>
    <div class="g2">
      <button type="button" id="btn-up">&#8593; Scroll Up</button>
      <button type="button" id="btn-down">&#8595; Scroll Down</button>
    </div>
    <div class="g1">
      <button type="button" class="grn" id="btn-copy">&#128203; Copy to App Clipboard</button>
    </div>
  </div>

  <div class="card">
    <div class="ph">
      <span class="slbl">Pinned Designs &amp; Code</span>
      <button type="button" class="red" id="btn-closeall" style="padding:4px 10px;font-size:11px;width:auto">Close All</button>
    </div>
    <div class="pins" id="pins">${pinsHTML}</div>
  </div>

  <div class="hcard">
    <div class="hlbl">Send to Screen</div>
    <textarea id="msg" placeholder="Type or paste anything — code, notes, a better answer...&#10;It will appear on the interview screen."></textarea>
    <button type="button" class="sbtn" id="btn-send">Send to Screen</button>
  </div>

</div>
<script>
var failCount = 0;

function post(body) {
  var x = new XMLHttpRequest();
  x.open('POST', '/command', true);
  x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  x.send(body);
}

function sendCmd(command, id) {
  var b = 'command=' + encodeURIComponent(command);
  if (id) b += '&id=' + encodeURIComponent(id);
  post(b);
}

function getState(cb) {
  var x = new XMLHttpRequest();
  x.open('GET', '/state?t=' + Date.now(), true);
  x.onreadystatechange = function() {
    if (x.readyState === 4) {
      if (x.status === 200) {
        try { cb(null, JSON.parse(x.responseText)); } catch(e) { cb(e); }
      } else {
        cb(new Error('status ' + x.status));
      }
    }
  };
  x.send();
}

function loop() {
  var msg = document.getElementById('msg');
  if (msg && document.activeElement === msg) {
    setTimeout(loop, 1000);
    return;
  }
  getState(function(err, s) {
    if (err) {
      failCount++;
      if (failCount >= 3) {
        var b = document.getElementById('offline');
        if (b) b.style.display = 'flex';
        var badge = document.getElementById('badge');
        if (badge) badge.textContent = '-';
      }
      setTimeout(loop, 2000);
      return;
    }
    failCount = 0;
    var b = document.getElementById('offline');
    if (b) b.style.display = 'none';

    var idx = (s.responseIndex || 0) + 1;
    var total = s.responseCount || 0;
    var badge = document.getElementById('badge');
    if (badge) badge.textContent = total > 0 ? (idx + ' / ' + total) : '0 / 0';

    var el = document.getElementById('resp');
    if (el) {
      var newText = s.response || '';
      if (el.getAttribute('data-last') !== newText) {
        var st = el.scrollTop;
        var atBottom = st > el.scrollHeight - el.clientHeight - 60;
        el.textContent = newText || 'No response yet.';
        el.setAttribute('data-last', newText);
        el.className = 'resp' + (newText ? '' : ' muted');
        el.scrollTop = atBottom ? el.scrollHeight : st;
      }
    }

    var pins = document.getElementById('pins');
    if (pins) {
      var list = s.pinnedRefs || [];
      if (list.length === 0) {
        pins.innerHTML = '<span class="muted" style="font-size:11px">No pinned items yet</span>';
      } else {
        var html = '';
        for (var i = 0; i < list.length; i++) {
          var p = list[i];
          html += '<button type="button" class="chip' + (p.active ? ' active' : '') + '" data-id="' + p.id + '">' + p.icon + ' ' + p.label + '</button>';
        }
        pins.innerHTML = html;
        pins.querySelectorAll('button[data-id]').forEach(function(btn) {
          btn.addEventListener('click', function() { sendCmd('toggle-pin', this.getAttribute('data-id')); });
        });
      }
    }

    setTimeout(loop, 800);
  });
}

function scrollResp(dir) {
  sendCmd(dir === 'up' ? 'scroll-up' : 'scroll-down');
  var el = document.getElementById('resp');
  if (el) el.scrollTop += dir === 'up' ? -(el.clientHeight * 0.4) : (el.clientHeight * 0.4);
}

window.addEventListener('load', function() {
  var wire = function(id, fn) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', fn);
  };
  wire('btn-prev',    function() { sendCmd('prev-response'); });
  wire('btn-next',    function() { sendCmd('next-response'); });
  wire('btn-up',      function() { scrollResp('up'); });
  wire('btn-down',    function() { scrollResp('down'); });
  wire('btn-copy',    function() { sendCmd('copy-to-clipboard'); });
  wire('btn-closeall',function() { sendCmd('close-all-pins'); });
  wire('btn-send', function() {
    var msg = document.getElementById('msg');
    var text = msg ? msg.value.trim() : '';
    if (!text) return;
    post('command=helper-message&text=' + encodeURIComponent(text));
    msg.value = '';
    msg.blur();
  });
  loop();
});
</script>
</body>
</html>`;
}

module.exports = { startServer, stopServer, updateState, isRunning, getLocalIP, PORT };
