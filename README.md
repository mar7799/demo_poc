# ShadowAI

> Your always-ready personal AI assistant — voice-activated, hands-free, and built for high-stakes professional moments.

ShadowAI runs as a lightweight floating overlay that listens, understands, and gives you clear, structured answers in real time. Whether you're preparing for an important meeting, thinking through a technical problem, or rehearsing for a presentation, ShadowAI stays out of your way until you need it.

---

## Download

Get the latest release from the [Releases page](https://github.com/mar7799/demo_poc/releases/latest).

| Platform | File |
|---|---|
| macOS Apple Silicon (M1/M2/M3/M4) | `ShadowAI-darwin-arm64.dmg` |
| macOS Intel | `ShadowAI-darwin-x64.dmg` |
| Windows x64 | `ShadowAI-win32-x64.zip` |
| Windows ARM | `ShadowAI-win32-arm64.zip` |

---

## Installation

### macOS

> [!IMPORTANT]
> Follow these steps in order. Running `xattr` before the app is in Applications will fail.

**Step 1 — Install:**
1. Open `ShadowAI.dmg`
2. Drag `ShadowAI.app` into the **Applications** folder
3. Eject the DMG

**Step 2 — Allow the app** (macOS Gatekeeper blocks unsigned apps by default):

Option A — Right-click to open (no terminal needed):
1. Right-click `ShadowAI.app` → **Open** → click **Open** in the dialog

Option B — Terminal (macOS Monterey 12+):
```bash
xattr -cr "/Applications/ShadowAI.app"
```

Option C — Terminal (all macOS versions, use if Option B says "option -r not recognized"):
```bash
xattr -d com.apple.quarantine "/Applications/ShadowAI.app"
xattr -d com.apple.quarantine "/Applications/ShadowAI.app/Contents/Resources/SystemAudioDump"
```

Option D — System Settings (no terminal):
1. Open **System Settings → Privacy & Security**
2. Scroll down to the blocked app notice → click **Open Anyway**

**Step 3 — Launch:**
Double-click `ShadowAI.app` in Applications.

The assistant window appears at the top of your screen. It runs as a minimal floating overlay — no Dock icon, no Cmd+Tab entry — so it stays out of your workspace and focuses entirely on assisting you.

### Windows

1. Extract the ZIP
2. If Windows shows "Windows protected your PC" → click **More info** → **Run anyway**
3. To unblock permanently: right-click `ShadowAI.exe` → **Properties** → check **Unblock** → **Apply**

---

## Run from Source

```bash
cd "/path/to/ShadowAI"
npm install
npm start
```

> **First time from source (macOS):**
> ```bash
> xattr -d com.apple.quarantine "/path/to/ShadowAI/src/assets/SystemAudioDump"
> chmod +x "/path/to/ShadowAI/src/assets/SystemAudioDump"
> ```

---

## Setup

### 1. Get API Keys

ShadowAI works with leading AI providers. You need at least one:

| Provider | Where to get it | Role |
|---|---|---|
| **Anthropic (Claude)** | [console.anthropic.com](https://console.anthropic.com) | Primary — best quality |
| **Groq** | [console.groq.com](https://console.groq.com) | Fallback — free tier available |
| **Google Gemini** | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | Live audio transcription (BYOK mode) |

Keys are stored locally on your device and are only sent to their respective API provider.

### 2. Configure

On first launch, enter your API keys in the **Settings** tab. The app initializes instantly and is ready as soon as you see the status indicator turn green.

---

## What ShadowAI Does

ShadowAI is a personal AI thinking partner. It runs hands-free in the background and responds the moment it hears something worth answering.

1. **Listens** — captures audio from your system (meetings, calls, videos, your own voice)
2. **Understands** — classifies what kind of question or situation it heard
3. **Responds** — streams a structured, relevant answer with key terms highlighted
4. **Adapts** — adjusts depth, format, and tone based on the context (technical, behavioral, conversational)
5. **Learns your style** — paste your background and custom instructions once; every answer reflects your experience from then on

---

## Custom Instructions

Open **AI Context → Custom Prompt** to write your own instructions. Examples:

- *"Keep every answer under 3 sentences. Be direct."*
- *"I have 10 years of backend engineering experience. Emphasize system design."*
- *"Always answer in first person using STAR format."*

When set, these override the built-in behavior. Leave it blank to use the default prompts.

The **Context** tab holds your resume/background and a target job description — ShadowAI weaves them into every answer automatically.

---

## Profiles

| Profile | Best for |
|---|---|
| **Interview** | Technical and behavioral questions, system design, coding |
| **Exam** | Dense factual answers with full acronym expansion |
| **Sales Call** | Product positioning, objection handling, rapport |
| **Business Meeting** | Summaries, action items, decision support |
| **Presentation** | Clear explanations, narrative structure |
| **Negotiation** | Framing, anchoring, counter-offer language |

---

## Keyboard Shortcuts

All shortcuts are customizable in the **Customize** tab.

### Navigation

| Action | Default |
|---|---|
| Previous response | `Cmd+[` / `Ctrl+[` |
| Next response | `Cmd+]` / `Ctrl+]` |
| Scroll up | `Cmd+Shift+↑` |
| Scroll down | `Cmd+Shift+↓` |

### Window

| Action | Default |
|---|---|
| Move window | `Cmd/Ctrl + Arrow keys` |
| Hide / show | `Cmd+\` / `Ctrl+\` |
| Toggle click-through | `Cmd+M` / `Ctrl+M` |
| Resize taller / shorter | `Alt+Shift+↑/↓` |
| Resize wider / narrower | `Alt+Shift+←/→` |

### Capture & Analysis

| Action | Default |
|---|---|
| Analyze current screen | `Cmd+Enter` / `Ctrl+Enter` |
| Add screenshot to buffer | `Cmd+Shift+C` / `Ctrl+Shift+C` |
| Clear screen | `Cmd+Shift+E` / `Ctrl+Shift+E` |

---

## Audio Capture

| Platform | Method |
|---|---|
| macOS | [SystemAudioDump](https://github.com/Mohammed-Yasin-Mulla/Sound) — system audio without a virtual driver |
| Windows | Loopback audio via `getDisplayMedia` |
| Linux | Microphone input only |

---

## Minimal Footprint

ShadowAI is designed to be present without being intrusive:

- No Dock icon — launches and runs quietly in the background
- No Cmd+Tab / Alt+Tab entry — doesn't clutter your app switcher
- No menu bar entries — nothing added to the macOS menu bar
- Floating overlay — always accessible, never in the way

---

## Self-Healing Responses

ShadowAI monitors its own output quality:

- Truncated responses (unclosed code fences, mid-sentence cuts) are automatically retried
- Format violations are corrected before display
- Mermaid diagrams are stripped from history before coding questions to preserve token budget
- Every request is logged with `[Audit]` in the terminal for debugging

---

## Requirements

- macOS 13+ or Windows 10/11
- Screen recording permission (for screen analysis)
- Audio capture permission
- At least one API key (Anthropic Claude recommended)
