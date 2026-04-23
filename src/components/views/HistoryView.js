import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { unifiedPageStyles } from './sharedPageStyles.js';

export class HistoryView extends LitElement {
    static styles = [
        unifiedPageStyles,
        css`
            .unified-page {
                overflow-y: hidden;
            }

            .unified-wrap {
                height: 100%;
            }

            .search-wrap {
                position: relative;
                max-width: 280px;
            }

            .search-icon {
                position: absolute;
                left: 10px;
                top: 50%;
                transform: translateY(-50%);
                width: 14px;
                height: 14px;
                color: var(--text-muted);
                pointer-events: none;
            }

            .search-wrap .control {
                padding-left: 30px;
            }

            .list-shell {
                border: 1px solid var(--border);
                border-radius: var(--radius-md);
                background: var(--bg-surface);
                overflow: hidden;
                flex: 1;
                display: flex;
                flex-direction: column;
                min-height: 0;
            }

            .sessions-list {
                overflow-y: auto;
                flex: 1;
            }

            .session-card {
                width: 100%;
                border: none;
                border-bottom: 1px solid var(--border);
                background: transparent;
                text-align: left;
                padding: var(--space-sm) var(--space-md);
                cursor: pointer;
                transition: background var(--transition);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: var(--space-sm);
            }

            .session-card:hover {
                background: var(--bg-hover);
            }

            .session-left {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .session-profile {
                color: var(--text-primary);
                font-size: var(--font-size-sm);
            }

            .session-date {
                color: var(--text-muted);
                font-size: var(--font-size-xs);
            }

            .session-badge {
                color: var(--text-secondary);
                font-size: var(--font-size-xs);
                background: var(--bg-elevated);
                border: 1px solid var(--border);
                border-radius: var(--radius-sm);
                padding: 2px 8px;
                white-space: nowrap;
            }

            .detail-top {
                display: flex;
                align-items: center;
                gap: var(--space-sm);
            }

            .back-btn {
                border: none;
                background: none;
                color: var(--text-muted);
                padding: 0;
                font-size: var(--font-size-sm);
                cursor: pointer;
                display: flex;
                align-items: center;
            }

            .back-btn svg {
                cursor: pointer;
            }

            .back-btn:hover {
                color: var(--text-primary);
            }

            .detail-info {
                color: var(--text-secondary);
                font-size: var(--font-size-sm);
            }

            .tab-row {
                display: flex;
                gap: 6px;
            }

            .tab-btn {
                border: 1px solid var(--border);
                border-radius: var(--radius-sm);
                background: transparent;
                color: var(--text-muted);
                padding: 6px 10px;
                cursor: pointer;
                font-size: var(--font-size-xs);
            }

            .tab-btn:hover {
                color: var(--text-secondary);
            }

            .tab-btn.active {
                color: var(--text-primary);
                border-color: var(--text-secondary);
            }

            .details-scroll {
                overflow-y: auto;
                flex: 1;
                min-height: 0;
                display: flex;
                flex-direction: column;
                gap: var(--space-sm);
                padding: var(--space-sm) 0;
            }

            .message-row {
                display: flex;
            }

            .message-row.user {
                justify-content: flex-end;
            }

            .message-row.ai,
            .message-row.screen {
                justify-content: flex-start;
            }

            .message {
                max-width: 75%;
                border-radius: 16px;
                padding: 8px 12px;
                word-break: break-word;
                user-select: text;
                cursor: text;
                font-size: var(--font-size-sm);
                line-height: 1.45;
            }

            .message-body {
                white-space: pre-wrap;
            }

            .message-meta {
                font-size: 10px;
                margin-top: 4px;
                opacity: 0.5;
            }

            .message-row.user .message {
                background: var(--accent);
                color: var(--bg-app);
                border-bottom-right-radius: 4px;
            }

            .message-row.user .message-meta {
                text-align: right;
            }

            .message-row.ai .message {
                background: var(--bg-elevated);
                color: var(--text-primary);
                border: 1px solid var(--border);
                border-bottom-left-radius: 4px;
            }

            .message-row.screen .message {
                background: var(--bg-elevated);
                color: var(--text-primary);
                border: 1px solid var(--border);
                border-bottom-left-radius: 4px;
            }

            .context-row {
                display: flex;
                align-items: flex-start;
                gap: var(--space-sm);
                padding: var(--space-sm);
                border: 1px solid var(--border);
                border-radius: var(--radius-sm);
                background: var(--bg-elevated);
            }

            .context-key {
                width: 84px;
                color: var(--text-muted);
                font-size: var(--font-size-xs);
                text-transform: uppercase;
                letter-spacing: 0.4px;
                flex-shrink: 0;
            }

            .context-value {
                color: var(--text-primary);
                font-size: var(--font-size-sm);
                line-height: 1.45;
                white-space: pre-wrap;
                word-break: break-word;
                user-select: text;
                cursor: text;
            }

            .empty {
                color: var(--text-muted);
                font-size: var(--font-size-sm);
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 120px;
                border: 1px dashed var(--border);
                border-radius: var(--radius-sm);
            }

            .export-row {
                display: flex;
                gap: 6px;
                margin-left: auto;
            }

            .export-btn {
                border: 1px solid var(--border);
                border-radius: var(--radius-sm);
                background: transparent;
                color: var(--text-muted);
                padding: 4px 10px;
                cursor: pointer;
                font-size: var(--font-size-xs);
                font-family: var(--font-mono);
                display: flex;
                align-items: center;
                gap: 4px;
                transition: border-color var(--transition), color var(--transition);
            }

            .export-btn:hover {
                color: var(--text-primary);
                border-color: var(--accent);
            }

            .export-btn:disabled {
                opacity: 0.4;
                cursor: default;
            }
        `,
    ];

    static properties = {
        sessions: { type: Array },
        selectedSession: { type: Object },
        selectedSessionId: { type: String },
        loading: { type: Boolean },
        activeTab: { type: String },
        searchQuery: { type: String },
    };

    constructor() {
        super();
        this.sessions = [];
        this.selectedSession = null;
        this.selectedSessionId = null;
        this.loading = true;
        this.activeTab = 'conversation';
        this.searchQuery = '';
        this.loadSessions();
    }

    async loadSessions() {
        try {
            this.loading = true;
            this.sessions = await metaMaxPro.storage.getAllSessions();
        } catch (error) {
            console.error('Error loading sessions:', error);
            this.sessions = [];
        } finally {
            this.loading = false;
            this.requestUpdate();
        }
    }

    async openSession(sessionId) {
        try {
            const session = await metaMaxPro.storage.getSession(sessionId);
            if (session) {
                this.selectedSession = session;
                this.selectedSessionId = sessionId;
                this.activeTab = 'conversation';
                this.requestUpdate();
            }
        } catch (error) {
            console.error('Error loading session:', error);
        }
    }

    closeSession() {
        this.selectedSession = null;
        this.selectedSessionId = null;
        this.activeTab = 'conversation';
    }

    handleSearchInput(e) {
        this.searchQuery = e.target.value;
    }

    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
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

    _getProfileLabel(session) {
        if (session.profile) {
            const names = this.getProfileNames();
            return names[session.profile] || session.profile;
        }
        return 'Session';
    }

    getSessionPreview(session) {
        const parts = [];
        if (session.messageCount > 0) parts.push(`${session.messageCount} messages`);
        if (session.screenAnalysisCount > 0) parts.push(`${session.screenAnalysisCount} screen`);
        if (session.profile) {
            const profileNames = this.getProfileNames();
            parts.push(profileNames[session.profile] || session.profile);
        }
        return parts.length > 0 ? parts.join(' · ') : 'Empty session';
    }

    getFilteredSessions() {
        if (!this.searchQuery.trim()) return this.sessions;
        const q = this.searchQuery.toLowerCase();
        return this.sessions.filter(session => {
            const preview = this.getSessionPreview(session).toLowerCase();
            const date = this.formatDate(session.createdAt).toLowerCase();
            return preview.includes(q) || date.includes(q);
        });
    }

    collectConversation(session) {
        const messages = [];
        const history = session.conversationHistory || [];
        history.forEach(turn => {
            if (turn.transcription) messages.push({ type: 'user', content: turn.transcription, timestamp: turn.timestamp });
            if (turn.ai_response) messages.push({ type: 'ai', content: turn.ai_response, timestamp: turn.timestamp });
        });
        return messages;
    }

    _buildExportText(session) {
        const profileNames = this.getProfileNames();
        const profile = profileNames[session.profile] || session.profile || 'Session';
        const date = this.formatDate(session.createdAt);
        const time = this.formatTime(session.createdAt);
        const lines = [
            `${profile.toUpperCase()}`,
            `${date} · ${time}`,
            '═'.repeat(60),
            '',
        ];
        const history = session.conversationHistory || [];
        history.forEach((turn, i) => {
            const ts = this.formatTime(turn.timestamp);
            if (turn.transcription) {
                lines.push(`[${ts}] Interviewer:`);
                lines.push(turn.transcription.trim());
                lines.push('');
            }
            if (turn.ai_response) {
                lines.push(`[${ts}] Answer:`);
                lines.push(turn.ai_response.trim());
                lines.push('');
                if (i < history.length - 1) lines.push('─'.repeat(40), '');
            }
        });
        const screen = session.screenAnalysisHistory || [];
        if (screen.length) {
            lines.push('', '═'.repeat(60), 'SCREEN ANALYSIS', '═'.repeat(60), '');
            screen.forEach(entry => {
                const ts = this.formatTime(entry.timestamp);
                lines.push(`[${ts}]`);
                lines.push(entry.response?.trim() || '');
                lines.push('');
            });
        }
        lines.push('═'.repeat(60));
        return lines.join('\n');
    }

    _buildExportHTML(session) {
        const profileNames = this.getProfileNames();
        const profile = profileNames[session.profile] || session.profile || 'Session';
        const date = this.formatDate(session.createdAt);
        const time = this.formatTime(session.createdAt);
        const esc = s => (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');

        const history = session.conversationHistory || [];
        const turns = history.map(turn => {
            const ts = this.formatTime(turn.timestamp);
            const q = turn.transcription ? `<div class="turn-q"><span class="role">Interviewer <span class="ts">${esc(ts)}</span></span><div class="body">${esc(turn.transcription)}</div></div>` : '';
            const a = turn.ai_response ? `<div class="turn-a"><span class="role">Answer</span><div class="body">${esc(turn.ai_response)}</div></div>` : '';
            return `<div class="turn">${q}${a}</div>`;
        }).join('');

        const screen = session.screenAnalysisHistory || [];
        const screenSection = screen.length ? `
            <h2>Screen Analysis</h2>
            ${screen.map(e => `<div class="turn"><div class="turn-a"><div class="body">${esc(e.response)}</div></div></div>`).join('')}
        ` : '';

        return `<!DOCTYPE html><html><head><meta charset="utf-8">
        <title>${esc(profile)} — ${esc(date)}</title>
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 13px; color: #1a1a1a; padding: 40px; max-width: 760px; margin: 0 auto; }
            h1 { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
            .meta { color: #666; font-size: 12px; margin-bottom: 28px; }
            h2 { font-size: 14px; font-weight: 600; color: #444; margin: 28px 0 12px; border-top: 1px solid #e0e0e0; padding-top: 16px; }
            .turn { margin-bottom: 18px; border-bottom: 1px solid #f0f0f0; padding-bottom: 18px; }
            .turn:last-child { border-bottom: none; }
            .role { display: block; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 5px; }
            .ts { font-weight: 400; color: #999; }
            .turn-q .role { color: #2563eb; }
            .turn-a .role { color: #16a34a; }
            .body { line-height: 1.6; white-space: pre-wrap; word-break: break-word; }
            .turn-q { margin-bottom: 10px; }
            @media print { body { padding: 20px; } }
        </style></head><body>
        <h1>${esc(profile)}</h1>
        <div class="meta">${esc(date)} · ${esc(time)} · ${history.length} exchange${history.length !== 1 ? 's' : ''}</div>
        ${turns}${screenSection}
        </body></html>`;
    }

    async _exportAsText() {
        if (!this.selectedSession) return;
        const { ipcRenderer } = window.require('electron');
        const text = this._buildExportText(this.selectedSession);
        const date = new Date(this.selectedSession.createdAt).toISOString().slice(0, 10);
        const profile = (this.selectedSession.profile || 'session').replace(/\s+/g, '-');
        await ipcRenderer.invoke('export-session', { type: 'text', content: text, filename: `${profile}-${date}` });
    }

    async _exportAsPDF() {
        if (!this.selectedSession) return;
        const { ipcRenderer } = window.require('electron');
        const html = this._buildExportHTML(this.selectedSession);
        const date = new Date(this.selectedSession.createdAt).toISOString().slice(0, 10);
        const profile = (this.selectedSession.profile || 'session').replace(/\s+/g, '-');
        await ipcRenderer.invoke('export-session', { type: 'pdf', html, filename: `${profile}-${date}` });
    }

    renderTabContent() {
        if (!this.selectedSession) return html`<div class="empty">Select a session.</div>`;

        if (this.activeTab === 'conversation') {
            const messages = this.collectConversation(this.selectedSession);
            if (!messages.length) return html`<div class="empty">No conversation data.</div>`;
            return messages.map(msg => html`
                <div class="message-row ${msg.type}">
                    <div class="message">
                        <div class="message-body">${msg.content}</div>
                        <div class="message-meta">${this.formatTime(msg.timestamp)}</div>
                    </div>
                </div>
            `);
        }

        if (this.activeTab === 'screen') {
            const screen = this.selectedSession.screenAnalysisHistory || [];
            if (!screen.length) return html`<div class="empty">No screen analysis data.</div>`;
            return screen.map(entry => html`
                <div class="message-row screen">
                    <div class="message">
                        <div class="message-body">${entry.response || ''}</div>
                        <div class="message-meta">${this.formatTime(entry.timestamp)}</div>
                    </div>
                </div>
            `);
        }

        const profile = this.selectedSession.profile;
        const prompt = this.selectedSession.customPrompt;
        if (!profile && !prompt) return html`<div class="empty">No context saved for this session.</div>`;

        return html`
            ${profile ? html`
                <div class="context-row">
                    <span class="context-key">Profile</span>
                    <span class="context-value">${this.getProfileNames()[profile] || profile}</span>
                </div>
            ` : ''}
            ${prompt ? html`
                <div class="context-row">
                    <span class="context-key">Prompt</span>
                    <span class="context-value">${prompt}</span>
                </div>
            ` : ''}
        `;
    }

    renderListView() {
        const filteredSessions = this.getFilteredSessions();
        return html`
            <div class="page-title">History</div>

            <div class="search-wrap">
                <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                    class="control"
                    type="text"
                    placeholder="Search sessions..."
                    .value=${this.searchQuery}
                    @input=${this.handleSearchInput}
                />
            </div>

            <section class="list-shell">
                <div class="sessions-list">
                    ${this.loading ? html`<div class="empty" style="margin:var(--space-md);">Loading sessions...</div>` : ''}
                    ${!this.loading && filteredSessions.length === 0 ? html`<div class="empty" style="margin:var(--space-md);">No matching sessions.</div>` : ''}
                    ${!this.loading ? filteredSessions.map(session => html`
                        <button class="session-card" @click=${() => this.openSession(session.sessionId)}>
                            <div class="session-left">
                                <span class="session-profile">${this._getProfileLabel(session)}</span>
                                <span class="session-date">${this.formatDate(session.createdAt)} · ${this.formatTime(session.createdAt)}</span>
                            </div>
                            ${session.messageCount > 0 ? html`<span class="session-badge">${session.messageCount}</span>` : ''}
                        </button>
                    `) : ''}
                </div>
            </section>
        `;
    }

    renderDetailView() {
        const conversationCount = this.collectConversation(this.selectedSession).length;
        const screenCount = this.selectedSession?.screenAnalysisHistory?.length || 0;

        return html`
            <div class="page-title">Session Detail</div>
            <div class="detail-top">
                <button class="back-btn" @click=${this.closeSession}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6"/>
                    </svg>
                </button>
                <span class="detail-info">${this._getProfileLabel(this.selectedSession)} · ${this.formatDate(this.selectedSession.createdAt)} · ${this.formatTime(this.selectedSession.createdAt)}</span>
                <div class="export-row">
                    <button class="export-btn" @click=${this._exportAsText} title="Save as plain text file">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        TXT
                    </button>
                    <button class="export-btn" @click=${this._exportAsPDF} title="Save as PDF">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                        PDF
                    </button>
                </div>
            </div>
            <div class="tab-row">
                <button class="tab-btn ${this.activeTab === 'conversation' ? 'active' : ''}" @click=${() => { this.activeTab = 'conversation'; }}>
                    Conversation (${conversationCount})
                </button>
                <button class="tab-btn ${this.activeTab === 'screen' ? 'active' : ''}" @click=${() => { this.activeTab = 'screen'; }}>
                    Screen (${screenCount})
                </button>
                <button class="tab-btn ${this.activeTab === 'context' ? 'active' : ''}" @click=${() => { this.activeTab = 'context'; }}>
                    Context
                </button>
            </div>
            <section class="details-scroll">
                ${this.renderTabContent()}
            </section>
        `;
    }

    render() {
        return html`
            <div class="unified-page">
                <div class="unified-wrap">
                    ${this.selectedSession ? this.renderDetailView() : this.renderListView()}
                </div>
            </div>
        `;
    }
}

customElements.define('history-view', HistoryView);
