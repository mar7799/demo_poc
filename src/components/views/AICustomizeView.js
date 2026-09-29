import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { unifiedPageStyles } from './sharedPageStyles.js';

export class AICustomizeView extends LitElement {
    static styles = [
        unifiedPageStyles,
        css`
            .unified-page { height: 100%; }
            .unified-wrap { height: 100%; }
            section.surface {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
            .form-grid {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
            .form-group.vertical {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
            textarea.control {
                flex: 1;
                resize: none;
                overflow-y: auto;
                min-height: 0;
            }

            /* ── Tab bar ── */
            .tab-bar {
                display: flex;
                gap: 2px;
                background: var(--bg-elevated);
                border: 1px solid var(--border);
                border-radius: var(--radius-sm);
                padding: 3px;
                margin-bottom: var(--space-md);
                flex-shrink: 0;
            }
            .tab-btn {
                flex: 1;
                padding: 7px 10px;
                border: none;
                background: transparent;
                color: var(--text-secondary);
                font-size: var(--font-size-sm);
                border-radius: calc(var(--radius-sm) - 2px);
                cursor: pointer;
                transition: background var(--transition), color var(--transition);
                font-family: inherit;
                white-space: nowrap;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
            }
            .tab-btn.active {
                background: var(--bg-surface);
                color: var(--text-primary);
                border: 1px solid var(--border);
            }
            .tab-btn:hover:not(.active) {
                color: var(--text-primary);
                background: rgba(255,255,255,0.04);
            }
            .dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: var(--success);
                flex-shrink: 0;
            }

            /* ── Instructions tab ── */
            .instructions-wrap {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: var(--space-sm);
            }
            .status-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-shrink: 0;
            }
            .status-badge {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                font-size: 11px;
                padding: 3px 9px;
                border-radius: 99px;
            }
            .status-badge.active {
                background: rgba(74,222,128,0.12);
                color: var(--success);
                border: 1px solid rgba(74,222,128,0.25);
            }
            .status-badge.inactive {
                background: var(--bg-elevated);
                color: var(--text-muted);
                border: 1px solid var(--border);
            }
            .save-flash {
                font-size: 11px;
                color: var(--success);
                opacity: 0;
                transition: opacity 0.3s;
            }
            .save-flash.visible { opacity: 1; }

            .instructions-textarea {
                flex: 1;
                min-height: 140px;
                resize: none;
                font-family: var(--font-mono);
                font-size: var(--font-size-sm);
                line-height: 1.6;
                background: var(--bg-elevated);
                color: var(--text-primary);
                border: 1px solid var(--border);
                border-radius: var(--radius-sm);
                padding: var(--space-sm);
                box-sizing: border-box;
                outline: none;
                transition: border-color var(--transition);
            }
            .instructions-textarea:focus { border-color: var(--accent); }

            .meta-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-shrink: 0;
            }
            .char-count {
                font-size: 11px;
                color: var(--text-muted);
                font-family: var(--font-mono);
            }
            .action-row {
                display: flex;
                gap: var(--space-sm);
                flex-shrink: 0;
            }
            .upload-btn {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                padding: 8px 12px;
                border: 1px dashed var(--border);
                border-radius: var(--radius-sm);
                background: transparent;
                color: var(--text-secondary);
                font-size: var(--font-size-sm);
                cursor: pointer;
                transition: border-color var(--transition), color var(--transition);
                font-family: inherit;
            }
            .upload-btn:hover { border-color: var(--accent); color: var(--text-primary); }
            .clear-btn {
                padding: 8px 16px;
                border: 1px solid var(--border);
                border-radius: var(--radius-sm);
                background: transparent;
                color: var(--text-muted);
                font-size: var(--font-size-sm);
                cursor: pointer;
                font-family: inherit;
                white-space: nowrap;
                transition: border-color var(--transition), color var(--transition);
            }
            .clear-btn:hover { border-color: var(--danger); color: var(--danger); }
            .hint {
                font-size: 11px;
                color: var(--text-muted);
                line-height: 1.5;
                flex-shrink: 0;
            }
            .file-hidden { display: none; }
        `,
    ];

    static properties = {
        selectedProfile: { type: String },
        onProfileChange: { type: Function },
        _tab: { state: true },
        _context: { state: true },
        _jobDescription: { state: true },
        _instructions: { state: true },
        _saved: { state: true },
    };

    constructor() {
        super();
        this.selectedProfile = 'interview';
        this.onProfileChange = () => {};
        this._tab = 'context';
        this._context = '';
        this._jobDescription = '';
        this._instructions = '';
        this._saved = false;
        this._loadFromStorage();
    }

    async _loadFromStorage() {
        try {
            const prefs = await metaMaxPro.storage.getPreferences();
            this._context = prefs.customPrompt || '';
            this._jobDescription = prefs.jobDescription || '';
            this._instructions = prefs.customInstructions || '';
            this.requestUpdate();
        } catch (error) {
            console.error('Error loading AI customize storage:', error);
        }
    }

    _handleProfileChange(e) { this.onProfileChange(e.target.value); }

    async _save(key, val) {
        await metaMaxPro.storage.updatePreference(key, val);
        // Push live update so changes apply to the current session immediately
        await metaMaxPro.updateCustomContext(this._instructions, this._context, this._jobDescription).catch(() => {});
        this._flashSaved();
    }

    _flashSaved() {
        this._saved = true;
        this.requestUpdate();
        setTimeout(() => { this._saved = false; this.requestUpdate(); }, 2000);
    }

    async _handleFileUpload(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        const text = (await file.text()).trim().replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');
        this._instructions = text;
        await this._save('customInstructions', text);
        e.target.value = '';
        this.requestUpdate();
    }

    async _clearInstructions() {
        this._instructions = '';
        await this._save('customInstructions', '');
        this.requestUpdate();
    }

    _renderTabBar() {
        const hasInstructions = !!this._instructions?.trim();
        const hasContext = !!(this._context?.trim() || this._jobDescription?.trim());
        return html`
            <div class="tab-bar">
                <button class="tab-btn ${this._tab === 'context' ? 'active' : ''}"
                    @click=${() => { this._tab = 'context'; this.requestUpdate(); }}>
                    ${hasContext ? html`<span class="dot"></span>` : ''}
                    Context
                </button>
                <button class="tab-btn ${this._tab === 'instructions' ? 'active' : ''}"
                    @click=${() => { this._tab = 'instructions'; this.requestUpdate(); }}>
                    ${hasInstructions ? html`<span class="dot"></span>` : ''}
                    Custom Prompt
                </button>
            </div>
        `;
    }

    _renderContextTab() {
        const profiles = [
            { value: 'interview', label: 'Job Interview' },
            { value: 'sales', label: 'Sales Call' },
            { value: 'meeting', label: 'Business Meeting' },
            { value: 'presentation', label: 'Presentation' },
            { value: 'negotiation', label: 'Negotiation' },
            { value: 'exam', label: 'Exam Assistant' },
        ];
        return html`
            <section class="surface">
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Profile</label>
                        <select class="control" .value=${this.selectedProfile} @change=${this._handleProfileChange}>
                            ${profiles.map(p => html`<option value=${p.value}>${p.label}</option>`)}
                        </select>
                    </div>
                    <div class="form-group vertical">
                        <label class="form-label">Resume / Background</label>
                        <textarea
                            class="control"
                            placeholder="Paste your resume, experience, skills, projects, companies, achievements..."
                            .value=${this._context}
                            @input=${e => { this._context = e.target.value; this._save('customPrompt', e.target.value); }}
                        ></textarea>
                        <div class="form-help">Your background — grounds every answer in real experience.</div>
                    </div>
                    <div class="form-group vertical">
                        <label class="form-label">Job Description (JD)</label>
                        <textarea
                            class="control"
                            placeholder="Paste the job description or role requirements..."
                            .value=${this._jobDescription}
                            @input=${e => { this._jobDescription = e.target.value; this._save('jobDescription', e.target.value); }}
                        ></textarea>
                        <div class="form-help">Answers will highlight what this specific role values.</div>
                    </div>
                </div>
            </section>
        `;
    }

    _renderInstructionsTab() {
        const hasInstructions = !!this._instructions?.trim();
        return html`
            <section class="surface">
                <div class="instructions-wrap">
                    <div class="status-row">
                        <span class="status-badge ${hasInstructions ? 'active' : 'inactive'}">
                            ${hasInstructions ? '● Active — overrides default behavior' : '○ Empty — using built-in prompts'}
                        </span>
                        <span class="save-flash ${this._saved ? 'visible' : ''}">Saved</span>
                    </div>

                    <textarea
                        class="instructions-textarea"
                        placeholder="Write instructions for how the AI should respond. Examples:

• Keep every answer under 3 sentences. Be concise and direct.
• I am applying for a Staff Engineer role. Emphasize system design experience.
• Always answer in first person. Use 'I' not 'the candidate'.
• When asked about weaknesses, always pivot to growth story.
• Respond like a principal engineer with 10+ years at FAANG."
                        .value=${this._instructions || ''}
                        @input=${e => { this._instructions = e.target.value; this._save('customInstructions', e.target.value); }}
                    ></textarea>

                    <div class="meta-row">
                        <span class="char-count">${this._instructions?.length || 0} characters</span>
                    </div>

                    <div class="action-row">
                        <button class="upload-btn"
                            @click=${() => this.shadowRoot.querySelector('#instr-file').click()}>
                            ↑ Upload file (.txt, .md)
                        </button>
                        ${hasInstructions ? html`
                            <button class="clear-btn" @click=${this._clearInstructions}>Clear</button>
                        ` : ''}
                    </div>

                    <input id="instr-file" class="file-hidden" type="file" accept=".txt,.md,.text"
                        @change=${this._handleFileUpload} />

                    <div class="hint">
                        These instructions are placed at the top of every prompt sent to Claude and Groq —
                        they override the built-in behavior. Your Resume and JD from the Context tab are
                        also included automatically. Changes apply from the next question onward.
                    </div>
                </div>
            </section>
        `;
    }

    render() {
        return html`
            <div class="unified-page">
                <div class="unified-wrap">
                    <div class="page-title">AI Context</div>
                    ${this._renderTabBar()}
                    ${this._tab === 'instructions' ? this._renderInstructionsTab() : this._renderContextTab()}
                </div>
            </div>
        `;
    }
}

customElements.define('ai-customize-view', AICustomizeView);
