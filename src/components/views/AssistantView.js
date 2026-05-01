import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

export class AssistantView extends LitElement {
    static styles = css`
        :host {
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        * {
            font-family: var(--font);
            cursor: default;
        }

        /* ── Response area ── */

        .response-container {
            flex: 1;
            overflow-y: auto;
            font-size: var(--response-font-size, 15px);
            line-height: var(--line-height);
            background: var(--bg-app);
            padding: var(--space-sm) var(--space-md);
            scroll-behavior: smooth;
            user-select: text;
            cursor: text;
            color: var(--text-primary);
        }

        .response-container * {
            user-select: text;
            cursor: text;
        }

        .response-container a {
            cursor: pointer;
        }

        .response-container [data-word] {
            display: inline-block;
        }

        /* ── Markdown ── */

        .response-container h1,
        .response-container h2,
        .response-container h3,
        .response-container h4,
        .response-container h5,
        .response-container h6 {
            margin: 1em 0 0.5em 0;
            color: var(--text-primary);
            font-weight: var(--font-weight-semibold);
        }

        .response-container h1 { font-size: 1.5em; }
        .response-container h2 { font-size: 1.3em; }
        .response-container h3 { font-size: 1.15em; }
        .response-container h4 { font-size: 1.05em; }
        .response-container h5,
        .response-container h6 { font-size: 1em; }

        .response-container p {
            margin: 0.6em 0;
            color: var(--text-primary);
        }

        .response-container ul,
        .response-container ol {
            margin: 0.6em 0;
            padding-left: 1.5em;
            color: var(--text-primary);
        }

        .response-container li {
            margin: 0.3em 0;
        }

        .response-container blockquote {
            margin: 0.8em 0;
            padding: 0.5em 1em;
            border-left: 2px solid var(--border-strong);
            background: var(--bg-surface);
            border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
        }

        .response-container code {
            background: var(--bg-elevated);
            padding: 0.15em 0.4em;
            border-radius: var(--radius-sm);
            font-family: var(--font-mono);
            font-size: 0.85em;
        }

        .response-container pre {
            background: var(--bg-surface);
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            padding: var(--space-md);
            overflow-x: auto;
            margin: 0.8em 0;
        }

        .response-container pre code {
            background: none;
            padding: 0;
        }

        .response-container a {
            color: var(--accent);
            text-decoration: underline;
            text-underline-offset: 2px;
        }

        .response-container strong,
        .response-container b {
            font-weight: var(--font-weight-semibold);
        }

        .response-container hr {
            border: none;
            border-top: 1px solid var(--border);
            margin: 1.5em 0;
        }

        .response-container table {
            border-collapse: collapse;
            width: 100%;
            margin: 0.8em 0;
        }

        .response-container th,
        .response-container td {
            border: 1px solid var(--border);
            padding: var(--space-sm);
            text-align: left;
        }

        .response-container th {
            background: var(--bg-surface);
            font-weight: var(--font-weight-semibold);
        }

        .response-container::-webkit-scrollbar {
            width: 6px;
        }

        .response-container::-webkit-scrollbar-track {
            background: transparent;
        }

        .response-container::-webkit-scrollbar-thumb {
            background: var(--border-strong);
            border-radius: 3px;
        }

        .response-container::-webkit-scrollbar-thumb:hover {
            background: #444444;
        }

        /* ── Mermaid diagrams ── */

        .response-container .mermaid {
            background: var(--bg-surface);
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            padding: var(--space-md);
            margin: 0.8em 0;
            text-align: center;
            overflow-x: auto;
        }

        .response-container .mermaid svg {
            max-width: 100%;
            height: auto;
        }

        .response-container .mermaid svg text,
        .response-container .mermaid svg .label,
        .response-container .mermaid svg .nodeLabel {
            fill: #F5F5F5 !important;
            color: #F5F5F5 !important;
        }

        /* ── Response navigation strip ── */

        .response-nav {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--space-sm);
            padding: var(--space-xs) var(--space-md);
            border-top: 1px solid var(--border);
            background: var(--bg-app);
        }

        .nav-btn {
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            padding: var(--space-xs);
            border-radius: var(--radius-sm);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color var(--transition);
        }

        .nav-btn:hover:not(:disabled) {
            color: var(--text-primary);
        }

        .nav-btn:disabled {
            opacity: 0.25;
            cursor: default;
        }

        .nav-btn svg {
            width: 14px;
            height: 14px;
        }

        .response-counter {
            font-size: var(--font-size-xs);
            color: var(--text-muted);
            font-family: var(--font-mono);
            min-width: 40px;
            text-align: center;
        }

        /* ── Pinned reference chip strip ── */

        .pin-strip {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 5px var(--space-md);
            border-top: 1px solid var(--border);
            background: var(--bg-app);
            overflow-x: auto;
            flex-shrink: 0;
        }

        .pin-strip::-webkit-scrollbar {
            height: 3px;
        }

        .pin-strip::-webkit-scrollbar-track {
            background: transparent;
        }

        .pin-strip::-webkit-scrollbar-thumb {
            background: var(--border-strong);
            border-radius: 3px;
        }

        .pin-chip {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 3px 10px;
            border-radius: 100px;
            border: 1px solid var(--border);
            background: var(--bg-elevated);
            color: var(--text-muted);
            font-size: 11px;
            font-family: var(--font-mono);
            white-space: nowrap;
            cursor: pointer;
            flex-shrink: 0;
            transition: border-color var(--transition), color var(--transition), background var(--transition);
        }

        .pin-chip:hover {
            border-color: var(--accent);
            color: var(--text-primary);
        }

        .pin-chip.active {
            border-color: var(--accent);
            background: var(--bg-surface);
            color: var(--accent);
        }

        .pin-chip-icon {
            font-size: 10px;
            line-height: 1;
        }

        /* ── Pinned reference panels ── */

        .pinned-panels {
            display: flex;
            flex-direction: column;
            gap: 0;
            overflow-y: auto;
            max-height: 260px;
            flex-shrink: 0;
            background: var(--bg-surface);
            border-top: 1px solid var(--border);
        }

        .pinned-panels::-webkit-scrollbar {
            width: 4px;
        }

        .pinned-panels::-webkit-scrollbar-track {
            background: transparent;
        }

        .pinned-panels::-webkit-scrollbar-thumb {
            background: var(--border-strong);
            border-radius: 3px;
        }

        .pinned-panel {
            padding: var(--space-sm) var(--space-md);
            border-bottom: 1px solid var(--border);
            font-size: 13px;
            line-height: var(--line-height);
            color: var(--text-primary);
            user-select: text;
            cursor: text;
        }

        .pinned-panel:last-child {
            border-bottom: none;
        }

        .pinned-panel * {
            user-select: text;
            cursor: text;
        }

        .pinned-panel .pin-panel-label {
            font-size: 10px;
            font-family: var(--font-mono);
            color: var(--accent);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .pinned-panel pre {
            background: var(--bg-elevated);
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            padding: var(--space-sm);
            overflow-x: auto;
            margin: 0.4em 0;
            font-size: 12px;
        }

        .pinned-panel pre code {
            background: none;
            padding: 0;
            font-size: inherit;
        }

        .pinned-panel code {
            background: var(--bg-elevated);
            padding: 0.1em 0.35em;
            border-radius: var(--radius-sm);
            font-family: var(--font-mono);
            font-size: 0.85em;
        }

        .pinned-panel .mermaid {
            background: var(--bg-elevated);
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            padding: var(--space-sm);
            margin: 0.4em 0;
            text-align: center;
            overflow-x: auto;
        }

        .pinned-panel .mermaid svg {
            max-width: 100%;
            height: auto;
        }

        .pinned-panel .mermaid svg text,
        .pinned-panel .mermaid svg .label,
        .pinned-panel .mermaid svg .nodeLabel {
            fill: #F5F5F5 !important;
            color: #F5F5F5 !important;
        }

        /* ── Bottom input bar ── */

        .input-bar {
            display: flex;
            align-items: center;
            gap: var(--space-sm);
            padding: var(--space-md);
            background: var(--bg-app);
        }

        .input-bar-inner {
            display: flex;
            align-items: center;
            flex: 1;
            background: var(--bg-elevated);
            border: 1px solid var(--border);
            border-radius: 100px;
            padding: 0 var(--space-md);
            height: 32px;
            transition: border-color var(--transition);
        }

        .input-bar-inner:focus-within {
            border-color: var(--accent);
        }

        .input-bar-inner input {
            flex: 1;
            background: none;
            color: var(--text-primary);
            border: none;
            padding: 0;
            font-size: var(--font-size-sm);
            font-family: var(--font);
            height: 100%;
            outline: none;
        }

        .input-bar-inner input::placeholder {
            color: var(--text-muted);
        }

        .capture-btn {
            position: relative;
            background: var(--bg-elevated);
            border: 1px solid var(--border);
            color: var(--text-primary);
            cursor: pointer;
            font-size: var(--font-size-xs);
            font-family: var(--font-mono);
            white-space: nowrap;
            padding: var(--space-xs) var(--space-md);
            border-radius: 100px;
            height: 32px;
            display: flex;
            align-items: center;
            gap: 4px;
            transition: border-color var(--transition), background var(--transition);
            flex-shrink: 0;
        }

        .capture-btn:hover {
            border-color: var(--accent);
            background: var(--bg-surface);
        }

        .capture-btn.has-captures {
            border-color: var(--accent);
            color: var(--accent);
        }

        .capture-count {
            background: var(--accent);
            color: var(--bg-app);
            border-radius: 100px;
            font-size: 10px;
            font-weight: 700;
            min-width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 4px;
        }

        .analyze-btn {
            position: relative;
            background: var(--bg-elevated);
            border: 1px solid var(--border);
            color: var(--text-primary);
            cursor: pointer;
            font-size: var(--font-size-xs);
            font-family: var(--font-mono);
            white-space: nowrap;
            padding: var(--space-xs) var(--space-md);
            border-radius: 100px;
            height: 32px;
            display: flex;
            align-items: center;
            gap: 4px;
            transition: border-color 0.4s ease, background var(--transition);
            flex-shrink: 0;
            overflow: hidden;
        }

        .analyze-btn:hover:not(.analyzing) {
            border-color: var(--accent);
            background: var(--bg-surface);
        }

        .analyze-btn.analyzing {
            cursor: default;
            border-color: transparent;
        }

        .analyze-btn-content {
            display: flex;
            align-items: center;
            gap: 4px;
            transition: opacity 0.4s ease;
            z-index: 1;
            position: relative;
        }

        .analyze-btn.analyzing .analyze-btn-content {
            opacity: 0;
        }

        .analyze-canvas {
            position: absolute;
            inset: -1px;
            width: calc(100% + 2px);
            height: calc(100% + 2px);
            pointer-events: none;
        }
    `;

    static properties = {
        responses: { type: Array },
        currentResponseIndex: { type: Number },
        selectedProfile: { type: String },
        onSendText: { type: Function },
        shouldAnimateResponse: { type: Boolean },
        isAnalyzing: { type: Boolean, state: true },
        capturedCount: { type: Number, state: true },
        _pinnedRefs: { type: Array, state: true },
        _activePins: { type: Object, state: true },
    };

    constructor() {
        super();
        this.responses = [];
        this.currentResponseIndex = -1;
        this.selectedProfile = 'interview';
        this.onSendText = () => {};
        this.isAnalyzing = false;
        this.capturedCount = 0;
        this._animFrame = null;
        this._pinnedRefs = [];
        this._activePins = {};
        this._designCount = 0;
        this._codeCount = 0;
        this._pinFocusIndex = -1;
    }

    getProfileNames() {
        return {
            interview: 'Job Interview',
            sales: 'Sales Call',
            meeting: 'Business Meeting',
            presentation: 'Presentation',
            negotiation: 'Negotiation',
            exam: 'Exam Assistant',
        };
    }

    getCurrentResponse() {
        const profileNames = this.getProfileNames();
        return this.responses.length > 0 && this.currentResponseIndex >= 0
            ? this.responses[this.currentResponseIndex]
            : `Listening to your ${profileNames[this.selectedProfile] || 'session'}...`;
    }

    renderMarkdown(content) {
        if (typeof window !== 'undefined' && window.marked) {
            try {
                window.marked.setOptions({
                    breaks: true,
                    gfm: true,
                    sanitize: false,
                });
                let rendered = window.marked.parse(content);
                rendered = this.wrapWordsInSpans(rendered);
                // Convert mermaid code blocks — store code as base64 data attribute to avoid HTML parsing issues
                rendered = rendered.replace(/<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g, (_, code) => {
                    const decoded = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
                    const encoded = btoa(unescape(encodeURIComponent(decoded)));
                    return `<div class="mermaid" data-code="${encoded}"></div>`;
                });
                return rendered;
            } catch (error) {
                console.warn('Error parsing markdown:', error);
                return content;
            }
        }
        return content;
    }

    wrapWordsInSpans(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const tagsToSkip = ['PRE'];

        function wrap(node) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() && !tagsToSkip.includes(node.parentNode.tagName)) {
                const words = node.textContent.split(/(\s+)/);
                const frag = document.createDocumentFragment();
                words.forEach(word => {
                    if (word.trim()) {
                        const span = document.createElement('span');
                        span.setAttribute('data-word', '');
                        span.textContent = word;
                        frag.appendChild(span);
                    } else {
                        frag.appendChild(document.createTextNode(word));
                    }
                });
                node.parentNode.replaceChild(frag, node);
            } else if (node.nodeType === Node.ELEMENT_NODE && !tagsToSkip.includes(node.tagName)) {
                Array.from(node.childNodes).forEach(wrap);
            }
        }
        Array.from(doc.body.childNodes).forEach(wrap);
        return doc.body.innerHTML;
    }

    navigateToPreviousResponse() {
        if (this.currentResponseIndex > 0) {
            this.currentResponseIndex--;
            this.dispatchEvent(new CustomEvent('response-index-changed', { detail: { index: this.currentResponseIndex } }));
            this.requestUpdate();
        }
    }

    navigateToNextResponse() {
        if (this.currentResponseIndex < this.responses.length - 1) {
            this.currentResponseIndex++;
            this.dispatchEvent(new CustomEvent('response-index-changed', { detail: { index: this.currentResponseIndex } }));
            this.requestUpdate();
        }
    }

    scrollResponseUp() {
        const container = this.shadowRoot.querySelector('.response-container');
        if (container) {
            const scrollAmount = container.clientHeight * 0.3;
            container.scrollTop = Math.max(0, container.scrollTop - scrollAmount);
        }
    }

    scrollResponseDown() {
        const container = this.shadowRoot.querySelector('.response-container');
        if (container) {
            const scrollAmount = container.clientHeight * 0.3;
            container.scrollTop = Math.min(container.scrollHeight - container.clientHeight, container.scrollTop + scrollAmount);
        }
    }

    connectedCallback() {
        super.connectedCallback();

        if (window.require) {
            const { ipcRenderer } = window.require('electron');

            this.handlePreviousResponse = () => this.navigateToPreviousResponse();
            this.handleNextResponse = () => this.navigateToNextResponse();
            this.handleScrollUp = () => this.scrollResponseUp();
            this.handleScrollDown = () => this.scrollResponseDown();
            this.handlePinLeft = () => this.navigatePinChip(-1);
            this.handlePinRight = () => this.navigatePinChip(1);

            ipcRenderer.on('navigate-previous-response', this.handlePreviousResponse);
            ipcRenderer.on('navigate-next-response', this.handleNextResponse);
            ipcRenderer.on('scroll-response-up', this.handleScrollUp);
            ipcRenderer.on('scroll-response-down', this.handleScrollDown);
            ipcRenderer.on('pin-navigate-left', this.handlePinLeft);
            ipcRenderer.on('pin-navigate-right', this.handlePinRight);
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._stopWaveformAnimation();

        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            if (this.handlePreviousResponse) ipcRenderer.removeListener('navigate-previous-response', this.handlePreviousResponse);
            if (this.handleNextResponse) ipcRenderer.removeListener('navigate-next-response', this.handleNextResponse);
            if (this.handleScrollUp) ipcRenderer.removeListener('scroll-response-up', this.handleScrollUp);
            if (this.handleScrollDown) ipcRenderer.removeListener('scroll-response-down', this.handleScrollDown);
            if (this.handlePinLeft) ipcRenderer.removeListener('pin-navigate-left', this.handlePinLeft);
            if (this.handlePinRight) ipcRenderer.removeListener('pin-navigate-right', this.handlePinRight);
        }
    }

    async handleSendText() {
        const textInput = this.shadowRoot.querySelector('#textInput');
        if (textInput && textInput.value.trim()) {
            const message = textInput.value.trim();
            textInput.value = '';
            await this.onSendText(message);
        }
    }

    handleTextKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSendText();
        }
    }

    async handleCaptureScreenshot() {
        if (window.captureScreenshotToBuffer) {
            const count = await window.captureScreenshotToBuffer();
            this.capturedCount = count;
        }
    }

    async handleScreenAnswer() {
        if (this.isAnalyzing) return;
        this.isAnalyzing = true;
        this._responseCountWhenStarted = this.responses.length;

        if (this.capturedCount > 0 && window.analyzeWithCapturedScreenshots) {
            await window.analyzeWithCapturedScreenshots();
            this.capturedCount = 0;
        } else if (window.captureManualScreenshot) {
            window.captureManualScreenshot();
        }
    }

    _startWaveformAnimation() {
        const canvas = this.shadowRoot.querySelector('.analyze-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const dangerColor = getComputedStyle(this).getPropertyValue('--danger').trim() || '#EF4444';
        const startTime = performance.now();
        const FADE_IN = 0.5; // seconds
        const PARTICLE_SPREAD = 4; // px inward from border
        const PARTICLE_COUNT = 250;

        // Pill perimeter helpers
        const w = rect.width;
        const h = rect.height;
        const r = h / 2; // pill radius = half height
        const straightLen = w - 2 * r;
        const arcLen = Math.PI * r;
        const perimeter = 2 * straightLen + 2 * arcLen;

        // Given a distance along the perimeter, return {x, y, nx, ny} (position + inward normal)
        const pointOnPerimeter = (d) => {
            d = ((d % perimeter) + perimeter) % perimeter;
            // Top straight: left to right
            if (d < straightLen) {
                return { x: r + d, y: 0, nx: 0, ny: 1 };
            }
            d -= straightLen;
            // Right arc
            if (d < arcLen) {
                const angle = -Math.PI / 2 + (d / arcLen) * Math.PI;
                return {
                    x: w - r + Math.cos(angle) * r,
                    y: r + Math.sin(angle) * r,
                    nx: -Math.cos(angle),
                    ny: -Math.sin(angle),
                };
            }
            d -= arcLen;
            // Bottom straight: right to left
            if (d < straightLen) {
                return { x: w - r - d, y: h, nx: 0, ny: -1 };
            }
            d -= straightLen;
            // Left arc
            const angle = Math.PI / 2 + (d / arcLen) * Math.PI;
            return {
                x: r + Math.cos(angle) * r,
                y: r + Math.sin(angle) * r,
                nx: -Math.cos(angle),
                ny: -Math.sin(angle),
            };
        };

        // Pre-seed random offsets for stable particles
        const seeds = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            seeds.push({ pos: Math.random(), drift: Math.random(), depthSeed: Math.random() });
        }

        const draw = (now) => {
            const elapsed = (now - startTime) / 1000;
            const fade = Math.min(1, elapsed / FADE_IN);

            ctx.clearRect(0, 0, w, h);

            // ── Particle border ──
            ctx.fillStyle = dangerColor;
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const s = seeds[i];
                const along = (s.pos + s.drift * elapsed * 0.03) * perimeter;
                const depth = s.depthSeed * PARTICLE_SPREAD;
                const density = 1 - depth / PARTICLE_SPREAD;

                if (Math.random() > density) continue;

                const p = pointOnPerimeter(along);
                const px = p.x + p.nx * depth;
                const py = p.y + p.ny * depth;
                const size = 0.8 + density * 0.6;

                ctx.globalAlpha = fade * density * 0.85;
                ctx.beginPath();
                ctx.arc(px, py, size, 0, Math.PI * 2);
                ctx.fill();
            }

            // ── Waveform ──
            const midY = h / 2;
            const waves = [
                { freq: 3, amp: 0.35, speed: 2.5, opacity: 0.9, width: 1.8 },
                { freq: 5, amp: 0.2, speed: 3.5, opacity: 0.5, width: 1.2 },
                { freq: 7, amp: 0.12, speed: 5, opacity: 0.3, width: 0.8 },
            ];

            for (const wave of waves) {
                ctx.beginPath();
                ctx.strokeStyle = dangerColor;
                ctx.globalAlpha = wave.opacity * fade;
                ctx.lineWidth = wave.width;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                for (let x = 0; x <= w; x++) {
                    const norm = x / w;
                    const envelope = Math.sin(norm * Math.PI);
                    const y = midY + Math.sin(norm * Math.PI * 2 * wave.freq + elapsed * wave.speed) * (midY * wave.amp) * envelope;
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            ctx.globalAlpha = 1;
            this._animFrame = requestAnimationFrame(draw);
        };

        this._animFrame = requestAnimationFrame(draw);
    }

    _stopWaveformAnimation() {
        if (this._animFrame) {
            cancelAnimationFrame(this._animFrame);
            this._animFrame = null;
        }
        const canvas = this.shadowRoot.querySelector('.analyze-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    _extractPinLabel(content, type) {
        if (type === 'design') {
            // Grab the first heading in the response as the label
            const match = content.match(/^#{1,3}\s+(.{4,40})/m);
            if (match) return match[1].replace(/[*_`]/g, '').trim().substring(0, 24);
            this._designCount += 1;
            return `Design ${this._designCount}`;
        } else {
            // Grab the first function/class/method name from code
            const match = content.match(/(?:function|class|def|const|let|var)\s+([A-Za-z_]\w*)/);
            if (match) return match[1].substring(0, 24);
            this._codeCount += 1;
            return `Code ${this._codeCount}`;
        }
    }

    _maybeAddPinnedRef(content) {
        if (!content || typeof content !== 'string') return;
        const hasMermaid = /```mermaid/i.test(content);
        const hasCode = /```[a-z]/.test(content) && !hasMermaid;
        if (!hasMermaid && !hasCode) return;

        const type = hasMermaid ? 'design' : 'code';
        const icon = hasMermaid ? '⬡' : '{ }';
        const label = this._extractPinLabel(content, type);
        const id = `pin-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

        this._pinnedRefs = [...this._pinnedRefs, { id, label, icon, type, content }];
    }

    navigatePinChip(direction) {
        if (this._pinnedRefs.length === 0) return;
        // Move focus index by direction (-1 left, +1 right), wrap around
        this._pinFocusIndex = (this._pinFocusIndex + direction + this._pinnedRefs.length) % this._pinnedRefs.length;
        const ref = this._pinnedRefs[this._pinFocusIndex];
        if (ref) this._togglePin(ref.id);
    }

    _togglePin(id) {
        this._activePins = { ...this._activePins, [id]: !this._activePins[id] };
        // After toggling on, render mermaid diagrams inside that panel
        if (this._activePins[id]) {
            this.updateComplete.then(() => this._renderMermaidInPinnedPanel(id));
        }
    }

    _renderMermaidInPinnedPanel(id) {
        const panel = this.shadowRoot.querySelector(`[data-pin-id="${id}"] .pin-panel-body`);
        if (!panel || !window.mermaid) return;
        const diagrams = panel.querySelectorAll('.mermaid[data-code]');
        diagrams.forEach(async (el, i) => {
            if (el.dataset.rendered) return;
            const encoded = el.getAttribute('data-code');
            if (!encoded) return;
            const raw = decodeURIComponent(escape(atob(encoded)));
            const code = raw.replace(/```\s*"?\s*$/, '').trim()
                .split('\n').map(line =>
                    line.replace(/\["(.+)"\]/g, (_, l) => `["${l.replace(/"/g, '')}"]`)
                        .replace(/\("(.+)"\)/g, (_, l) => `("${l.replace(/"/g, '')}")`)
                        .replace(/\[([^\]"]*[\/\(\)][^\]"]*)\]/g, (_, l) => `["${l}"]`)
                ).join('\n');
            try {
                const svgId = `pin-mermaid-${id}-${i}-${Date.now()}`;
                const { svg } = await window.mermaid.render(svgId, code);
                el.innerHTML = svg;
                el.dataset.rendered = '1';
            } catch (e) {
                el.innerHTML = `<pre style="color:#999;font-size:10px;overflow-x:auto;">${code}</pre>`;
            }
        });
    }

    scrollToBottom() {
        setTimeout(() => {
            const container = this.shadowRoot.querySelector('.response-container');
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }, 0);
    }

    firstUpdated() {
        super.firstUpdated();
        this.updateResponseContent();
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('responses') || changedProperties.has('currentResponseIndex')) {
            this.updateResponseContent();
        }

        if (changedProperties.has('isAnalyzing')) {
            if (this.isAnalyzing) {
                this._startWaveformAnimation();
            } else {
                this._stopWaveformAnimation();
            }
        }

        if (changedProperties.has('responses') && this.isAnalyzing) {
            if (this.responses.length > this._responseCountWhenStarted) {
                this.isAnalyzing = false;
            }
        }

        if (changedProperties.has('_activePins')) {
            // Render mermaid diagrams in any newly activated pinned panels
            Object.entries(this._activePins).forEach(([id, active]) => {
                if (active) this._renderMermaidInPinnedPanel(id);
            });
        }

        if (changedProperties.has('responses')) {
            const prev = changedProperties.get('responses') || [];
            // Session reset — clear all pins
            if (this.responses.length === 0 && prev.length > 0) {
                this._pinnedRefs = [];
                this._activePins = {};
                this._designCount = 0;
                this._codeCount = 0;
                return;
            }
            // A new response arrived — the one before it is now finalized
            if (this.responses.length > prev.length && this.responses.length >= 2) {
                this._maybeAddPinnedRef(this.responses[this.responses.length - 2]);
            }
        }
    }

    updateResponseContent() {
        const container = this.shadowRoot.querySelector('#responseContainer');
        if (container) {
            const currentResponse = this.getCurrentResponse();
            const renderedResponse = this.renderMarkdown(currentResponse);
            container.innerHTML = renderedResponse;
            // Debounce mermaid rendering — updateResponseContent fires on every streaming chunk,
            // so we wait until streaming settles before rendering diagrams
            if (typeof window !== 'undefined' && window.mermaid && container.querySelector('.mermaid')) {
                if (this._mermaidTimer) clearTimeout(this._mermaidTimer);
                this._mermaidTimer = setTimeout(async () => {
                    const diagrams = container.querySelectorAll('.mermaid');
                    if (!diagrams.length) return;
                    for (let i = 0; i < diagrams.length; i++) {
                        const el = diagrams[i];
                        const encoded = el.getAttribute('data-code');
                        if (!encoded) continue;
                        const raw = decodeURIComponent(escape(atob(encoded)));
                        const code = raw
                            .replace(/```\s*"?\s*$/, '').trim()
                            .split('\n').map(line =>
                                line.replace(/\["(.+)"\]/g, (_, l) => `["${l.replace(/"/g, '')}"]`)
                                    .replace(/\("(.+)"\)/g, (_, l) => `("${l.replace(/"/g, '')}")`)
                                    .replace(/\[([^\]"]*[\/\(\)][^\]"]*)\]/g, (_, l) => `["${l}"]`)
                                    .replace(/^(\s*participant\s+)([^"\n]*[\/\(\)\.][^"\n]*)$/g, (_, p, name) => `${p}"${name.trim()}"`)
                            ).join('\n');
                        try {
                            const id = 'mermaid-svg-' + i + '-' + Date.now();
                            const { svg } = await window.mermaid.render(id, code);
                            el.innerHTML = svg;
                        } catch (e) {
                            console.warn('Mermaid render error:', e);
                            el.innerHTML = `<div style="color:#EF4444;font-size:11px;padding:8px;">Diagram error: ${e.message}</div><pre style="color:#999;font-size:10px;overflow-x:auto;">${code}</pre>`;
                        }
                    }
                }, 400);
            }
            if (this.shouldAnimateResponse) {
                this.dispatchEvent(new CustomEvent('response-animation-complete', { bubbles: true, composed: true }));
            }
        }
    }

    render() {
        const hasPrev = this.currentResponseIndex > 0;
        const hasNext = this.currentResponseIndex < this.responses.length - 1;
        const showNav = this.responses.length > 0;
        const activePins = this._pinnedRefs.filter(r => this._activePins[r.id]);

        return html`
            <div class="response-container" id="responseContainer"></div>

            ${showNav ? html`
            <div class="response-nav">
                <button class="nav-btn" ?disabled=${!hasPrev} @click=${this.navigateToPreviousResponse} title="Previous response">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6"/>
                    </svg>
                </button>
                <span class="response-counter">${this.currentResponseIndex + 1} / ${this.responses.length}</span>
                <button class="nav-btn" ?disabled=${!hasNext} @click=${this.navigateToNextResponse} title="Next response">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                    </svg>
                </button>
            </div>
            ` : ''}

            ${this._pinnedRefs.length > 0 ? html`
            <div class="pin-strip">
                ${this._pinnedRefs.map(ref => html`
                    <button
                        class="pin-chip ${this._activePins[ref.id] ? 'active' : ''}"
                        @click=${() => this._togglePin(ref.id)}
                        title="${ref.label}"
                    >
                        <span class="pin-chip-icon">${ref.icon}</span>
                        ${ref.label}
                    </button>
                `)}
            </div>
            ` : ''}

            ${activePins.length > 0 ? html`
            <div class="pinned-panels">
                ${activePins.map(ref => html`
                    <div class="pinned-panel" data-pin-id="${ref.id}">
                        <div class="pin-panel-label">
                            <span>${ref.icon}</span>
                            <span>${ref.label}</span>
                        </div>
                        <div class="pin-panel-body" .innerHTML=${this.renderMarkdown(ref.content)}></div>
                    </div>
                `)}
            </div>
            ` : ''}

            <div class="input-bar">
                <div class="input-bar-inner">
                    <input
                        type="text"
                        id="textInput"
                        placeholder="Type a message..."
                        @keydown=${this.handleTextKeydown}
                    />
                </div>
                <button
                    class="capture-btn ${this.capturedCount > 0 ? 'has-captures' : ''}"
                    @click=${this.handleCaptureScreenshot}
                    title="Capture screenshot (click multiple times to capture the full question, then click Solve)"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/>
                        <circle cx="12" cy="13" r="3"/>
                    </svg>
                    Capture
                    ${this.capturedCount > 0 ? html`<span class="capture-count">${this.capturedCount}</span>` : ''}
                </button>
                <button class="analyze-btn ${this.isAnalyzing ? 'analyzing' : ''}" @click=${this.handleScreenAnswer}>
                    <canvas class="analyze-canvas"></canvas>
                    <span class="analyze-btn-content">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 3v7h6l-8 11v-7H5z" />
                        </svg>
                        ${this.capturedCount > 0 ? 'Solve' : 'Analyze Screen'}
                    </span>
                </button>
            </div>
        `;
    }
}

customElements.define('assistant-view', AssistantView);
