# Meta Max Pro

> [!NOTE]
> Requires macOS 13+ or Windows 10/11. Older OS versions have limited support.

A real-time AI interview assistant that runs as a stealth overlay — invisible in the Dock, Taskbar, Cmd+Tab, and Mission Control. It listens to the interview audio, classifies each question, and streams a tailored response in plain paragraphs with bold keywords.

---

## Download

Get the latest release from the [Releases page](https://github.com/mar7799/demo_poc/releases/latest).

| Platform | File |
|---|---|
| macOS Apple Silicon (M1/M2/M3/M4) | `Meta Max Pro-darwin-arm64.dmg` |
| macOS Intel | `Meta Max Pro-darwin-x64.dmg` |
| Windows x64 | `Meta Max Pro-win32-x64.zip` |
| Windows ARM | `Meta Max Pro-win32-arm64.zip` |

---

## Installation — Security Warnings

The app is not code-signed. Both macOS and Windows will show a warning on first launch.

### macOS — "damaged and can't be opened"

**Option A — Right-click to open:**
1. Drag `Meta Max Pro.app` to **Applications**
2. Right-click → **Open** → click **Open** in the dialog

**Option B — Remove quarantine flag:**
```bash
xattr -cr "/Applications/Meta Max Pro.app"
```

### Windows — "Windows protected your PC"

1. Click **More info** → **Run anyway**

For the ZIP: extract, right-click `Meta Max Pro.exe` → **Properties** → check **Unblock** → **Apply** → **OK**.

---

## Before You Run — Required First Time

> [!IMPORTANT]
> **Run this command once before launching the app, or audio capture will silently fail.**

macOS blocks the system audio binary with a quarantine flag the first time it's downloaded. Remove it with:

**Installed app (from DMG):**
```bash
xattr -cr "/Applications/Meta Max Pro.app"
```

**Development (running from source):**
```bash
xattr -cr "/path/to/meta max pro/src/assets/SystemAudioDump"
chmod +x "/path/to/meta max pro/src/assets/SystemAudioDump"
```

You only need to do this once. If the app launches but produces no AI responses when the interviewer speaks, this is almost always the cause.

---

## Setup

### 1. Get API Keys

You need at least one of these:

| Provider | Where to get it | Used for |
|---|---|---|
| **Anthropic (Claude)** | [console.anthropic.com](https://console.anthropic.com) | Primary AI responses |
| **Groq** | [console.groq.com](https://console.groq.com) | Fallback (free tier available) |
| **Google Gemini** | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | Audio transcription (BYOK mode) |

Claude (Anthropic) is the recommended primary model. Groq is the free fallback. Gemini is only needed for live audio transcription in BYOK mode.

### 2. Install Dependencies (dev only)

```bash
npm install
```

### 3. Run

```bash
npm start
```

### 4. Configure

On first launch, enter your API keys in the settings screen. The app saves them locally — they are never sent anywhere except the respective API provider.

---

## How It Works

1. The app captures system audio (what the interviewer says)
2. Speech is transcribed in real time
3. A classifier detects the question type (behavioral, coding, system design, technical, etc.)
4. The matching prompt and token budget are selected automatically
5. The answer streams to the overlay as dense paragraphs with bold keywords
6. For coding questions, the full program is generated (up to 8000 tokens)
7. For system design, a Mermaid UML diagram is rendered inline

The overlay is always on top, transparent, frame-less, and completely invisible to screen-sharing software (`setContentProtection` is enabled).

---

## Keyboard Shortcuts

All shortcuts are customizable in the **Customize** tab.

### Navigation

| Action | Default |
|---|---|
| Previous response | `Cmd+[` / `Ctrl+[` |
| Next response | `Cmd+]` / `Ctrl+]` |
| Scroll response up | `Cmd+Shift+Up` |
| Scroll response down | `Cmd+Shift+Down` |

### Window

| Action | Default |
|---|---|
| Move window | `Cmd/Ctrl + Arrow Keys` |
| Toggle visibility (hide/show) | `Cmd+\` / `Ctrl+\` |
| Toggle click-through | `Cmd+M` / `Ctrl+M` |
| Resize taller / shorter | `Alt+Shift+Up/Down` |
| Resize wider / narrower | `Alt+Shift+Left/Right` |

### Capture & Analysis

| Action | Default |
|---|---|
| Analyze screen now | `Cmd+Enter` / `Ctrl+Enter` |
| Add screenshot to buffer | `Cmd+Shift+C` / `Ctrl+Shift+C` |
| Emergency erase | `Cmd+Shift+E` / `Ctrl+Shift+E` |

---

## Audio Capture

| Platform | Method |
|---|---|
| macOS | [SystemAudioDump](https://github.com/Mohammed-Yasin-Mulla/Sound) — captures system audio without a virtual driver |
| Windows | Loopback audio via `getDisplayMedia` |
| Linux | Microphone input only |

---

## Stealth — What Is Hidden

| Surface | Status |
|---|---|
| macOS Dock | Hidden (`app.dock.hide()`) |
| macOS Cmd+Tab switcher | Hidden (`accessory` activation policy) |
| macOS Mission Control | Hidden (`setHiddenInMissionControl`) |
| macOS menu bar | No app menus registered |
| Windows Taskbar | Hidden (`setSkipTaskbar`) |
| Screen sharing / recording | Protected (`setContentProtection`) |

---

## Profiles

- **Interview** — behavioral, coding, system design, technical, resume deep-dives
- **Exam** — dense factual answers with acronym expansion
- **Sales Call**, **Business Meeting**, **Presentation**, **Negotiation** — tone-matched responses

---

## Self-Healing

The app monitors its own responses:

- If a response is truncated (unclosed code fence, mid-sentence cut), it automatically retries with a fresh context window
- If format rules are violated (headers, bullets), the response is corrected before display
- Mermaid diagrams are stripped from history before coding questions to free token budget
- Every request is logged with `[Audit]` prefix in the terminal for debugging

---

## Requirements

- macOS 13+ or Windows 10/11
- Screen recording permission
- Audio capture permission
- At least one API key (Anthropic recommended)
