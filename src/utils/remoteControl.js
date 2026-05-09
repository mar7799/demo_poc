const http = require('http');
const { WebSocketServer } = require('ws');
const { networkInterfaces } = require('os');

const PORT = 3847;

let server = null;
let wss = null;
let connections = new Set();
let onCommandCallback = null;

// Current app state mirrored to all connected helpers
let currentState = {
    response: '',
    responseIndex: 0,
    responseCount: 0,
    pinnedRefs: [],    // [{id, label, icon, active}]
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

function broadcast(payload) {
    const msg = JSON.stringify(payload);
    for (const ws of connections) {
        if (ws.readyState === 1) ws.send(msg);
    }
}

function updateState(partial) {
    Object.assign(currentState, partial);
    broadcast({ type: 'state', ...currentState });
}

function startServer(onCommand) {
    if (server) return { ip: getLocalIP(), port: PORT };

    onCommandCallback = onCommand;

    server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(buildRemoteHTML());
    });

    wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        connections.add(ws);
        // Send full current state to the new helper immediately
        ws.send(JSON.stringify({ type: 'state', ...currentState }));

        ws.on('message', (data) => {
            try {
                const msg = JSON.parse(data.toString());
                if (onCommandCallback) onCommandCallback(msg);
            } catch {}
        });

        ws.on('close', () => connections.delete(ws));
        ws.on('error', () => connections.delete(ws));
    });

    server.listen(PORT, '0.0.0.0');
    console.log(`[RemoteControl] Server started on port ${PORT}`);
    return { ip: getLocalIP(), port: PORT };
}

function stopServer() {
    for (const ws of connections) {
        try { ws.close(); } catch {}
    }
    connections.clear();
    if (wss) { wss.close(); wss = null; }
    if (server) { server.close(); server = null; }
    onCommandCallback = null;
    console.log('[RemoteControl] Server stopped');
}

function isRunning() {
    return server !== null;
}

function buildRemoteHTML() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<title>Meta Max Pro — Remote</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0e0e0e;
    --surface: #1a1a1a;
    --border: #2a2a2a;
    --accent: #ffffff;
    --text: #e0e0e0;
    --muted: #666;
    --helper: #3b82f6;
    --helper-bg: rgba(59,130,246,0.12);
    --danger: #ef4444;
    --success: #22c55e;
  }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 14px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* ── Header ── */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .header-title { font-size: 13px; font-weight: 600; color: var(--text); }
  .status-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--danger);
    transition: background 0.3s;
  }
  .status-dot.connected { background: var(--success); }
  .counter {
    font-size: 11px;
    font-family: monospace;
    color: var(--muted);
    background: var(--border);
    padding: 2px 8px;
    border-radius: 10px;
  }

  /* ── Main content ── */
  .content { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 12px; }

  /* ── Response display ── */
  .response-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px;
  }
  .card-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--muted);
    margin-bottom: 8px;
  }
  .response-text {
    color: var(--text);
    line-height: 1.55;
    font-size: 13px;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 220px;
    overflow-y: auto;
  }
  .response-text::-webkit-scrollbar { width: 4px; }
  .response-text::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  /* ── Button grid ── */
  .btn-section { display: flex; flex-direction: column; gap: 8px; }
  .btn-row { display: grid; gap: 8px; }
  .btn-row-2 { grid-template-columns: 1fr 1fr; }
  .btn-row-3 { grid-template-columns: 1fr 1fr 1fr; }
  .btn-row-1 { grid-template-columns: 1fr; }

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px 8px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.15s, border-color 0.15s;
    user-select: none;
  }
  .btn:active { background: #2a2a2a; }
  .btn.accent { border-color: var(--accent); color: var(--accent); }
  .btn.accent:active { background: rgba(255,255,255,0.08); }
  .btn.copy-btn { border-color: var(--success); color: var(--success); }
  .btn.copy-btn:active { background: rgba(34,197,94,0.1); }
  .btn.danger { border-color: var(--danger); color: var(--danger); }
  .btn.danger:active { background: rgba(239,68,68,0.1); }
  .btn svg { width: 16px; height: 16px; flex-shrink: 0; }

  /* ── Pins section ── */
  .pins-wrap {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 10px 12px;
  }
  .pins-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .pins-list { display: flex; flex-wrap: wrap; gap: 6px; }
  .pin-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 20px;
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--muted);
    font-size: 11px;
    font-family: monospace;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
    -webkit-tap-highlight-color: transparent;
  }
  .pin-chip.active { border-color: var(--accent); color: var(--accent); background: #1f1f1f; }
  .pin-chip:active { opacity: 0.7; }
  .no-pins { font-size: 11px; color: var(--muted); }

  /* ── Helper message area ── */
  .helper-section {
    background: var(--surface);
    border: 1px solid var(--helper);
    border-radius: 10px;
    padding: 12px;
  }
  .helper-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--helper);
    margin-bottom: 8px;
  }
  .helper-textarea {
    width: 100%;
    background: var(--bg);
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 10px;
    font-size: 13px;
    font-family: inherit;
    resize: vertical;
    min-height: 80px;
    outline: none;
    line-height: 1.5;
  }
  .helper-textarea:focus { border-color: var(--helper); }
  .helper-send {
    width: 100%;
    margin-top: 8px;
    padding: 12px;
    background: var(--helper);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: opacity 0.15s;
  }
  .helper-send:active { opacity: 0.8; }
  .helper-send:disabled { opacity: 0.4; cursor: default; }

  /* ── Divider ── */
  .section-title {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--muted);
  }
</style>
</head>
<body>

<div class="header">
  <div style="display:flex;align-items:center;gap:8px">
    <div class="status-dot" id="dot"></div>
    <span class="header-title">Meta Max Pro Remote</span>
  </div>
  <span class="counter" id="counter">0 / 0</span>
</div>

<div class="content">

  <!-- Current response display -->
  <div class="response-card">
    <div class="card-label">Current response</div>
    <div class="response-text" id="responseText">Connecting...</div>
  </div>

  <!-- Navigation -->
  <div class="btn-section">
    <div class="section-title">Navigate</div>
    <div class="btn-row btn-row-2">
      <button class="btn accent" onclick="send('prev-response')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Previous
      </button>
      <button class="btn accent" onclick="send('next-response')">
        Next
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
    <div class="btn-row btn-row-2">
      <button class="btn" onclick="send('scroll-up')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
        Scroll Up
      </button>
      <button class="btn" onclick="send('scroll-down')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        Scroll Down
      </button>
    </div>
    <div class="btn-row btn-row-1">
      <button class="btn copy-btn" onclick="copyToApp()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        Copy to App Clipboard
      </button>
    </div>
  </div>

  <!-- Pinned panels -->
  <div class="pins-wrap">
    <div class="pins-header">
      <span class="section-title">Pinned Designs &amp; Code</span>
      <button class="btn danger" style="padding:4px 10px;font-size:11px" onclick="send('close-all-pins')">Close All</button>
    </div>
    <div class="pins-list" id="pinsList">
      <span class="no-pins">No pinned items yet</span>
    </div>
  </div>

  <!-- Helper message -->
  <div class="helper-section">
    <div class="helper-label">Send to screen</div>
    <textarea class="helper-textarea" id="helperInput" placeholder="Type or paste anything — code, notes, a better answer...&#10;It will appear on the interview screen."></textarea>
    <button class="helper-send" id="sendBtn" onclick="sendHelperMessage()">Send to Screen</button>
  </div>

</div>

<script>
  let ws = null;
  let state = { response: '', responseIndex: 0, responseCount: 0, pinnedRefs: [] };
  const WS_URL = 'ws://' + location.host;

  function connect() {
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      document.getElementById('dot').classList.add('connected');
    };

    ws.onclose = () => {
      document.getElementById('dot').classList.remove('connected');
      setTimeout(connect, 2000); // auto-reconnect
    };

    ws.onerror = () => ws.close();

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'state') {
          state = msg;
          render();
        }
      } catch {}
    };
  }

  function render() {
    // Response text
    const txt = state.response || 'No response yet.';
    document.getElementById('responseText').textContent = txt;

    // Counter
    const idx = (state.responseIndex || 0) + 1;
    const total = state.responseCount || 0;
    document.getElementById('counter').textContent = total > 0 ? idx + ' / ' + total : '0 / 0';

    // Pins
    const list = document.getElementById('pinsList');
    const pins = state.pinnedRefs || [];
    if (pins.length === 0) {
      list.innerHTML = '<span class="no-pins">No pinned items yet</span>';
    } else {
      list.innerHTML = pins.map(p =>
        '<button class="pin-chip ' + (p.active ? 'active' : '') + '" onclick="send(\\'toggle-pin\\', \\''+p.id+'\\')">' +
        p.icon + ' ' + p.label +
        '</button>'
      ).join('');
    }
  }

  function send(command, id) {
    if (!ws || ws.readyState !== 1) return;
    ws.send(JSON.stringify({ command, id }));
  }

  function copyToApp() {
    send('copy-to-clipboard');
    const btn = document.querySelector('.copy-btn');
    const orig = btn.innerHTML;
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.innerHTML = orig; }, 1500);
  }

  function sendHelperMessage() {
    const textarea = document.getElementById('helperInput');
    const text = textarea.value.trim();
    if (!text) return;
    if (!ws || ws.readyState !== 1) return;
    ws.send(JSON.stringify({ command: 'helper-message', text }));
    textarea.value = '';
  }

  // Send on Ctrl/Cmd+Enter in textarea
  document.getElementById('helperInput').addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      sendHelperMessage();
    }
  });

  connect();
</script>
</body>
</html>`;
}

module.exports = { startServer, stopServer, updateState, isRunning, getLocalIP, PORT };
