# Meta Max Pro

> [!NOTE]
> Use latest MacOS and Windows version, older versions have limited support

> [!NOTE]
> During testing it wont answer if you ask something, you need to simulate interviewer asking question, which it will answer

A real-time AI assistant that provides contextual help during video calls, interviews, presentations, and meetings using screen capture and audio analysis.

## Features

- **Live AI Assistance**: Real-time help powered by Google Gemini 2.0 Flash Live
- **Screen & Audio Capture**: Analyzes what you see and hear for contextual responses
- **Multiple Profiles**: Interview, Sales Call, Business Meeting, Presentation, Negotiation
- **Transparent Overlay**: Always-on-top window that can be positioned anywhere
- **Click-through Mode**: Make window transparent to clicks when needed
- **Cross-platform**: Works on macOS, Windows, and Linux (kinda, dont use, just for testing rn)

## Download

Get the latest release from the [Releases page](https://github.com/mar7799/demo_poc/releases/latest).

| Platform | File |
|---|---|
| macOS Apple Silicon (M1/M2/M3) | `Meta Max Pro-x.x.x-arm64.dmg` |
| macOS Intel | `Meta Max Pro-x.x.x-x64.dmg` |
| Windows x64 | `Meta Max Pro-win32-x64-x.x.x.zip` |
| Windows ARM | `Meta Max Pro-win32-arm64-x.x.x.zip` |

---

## ⚠️ Installation — Security Warnings

The app is not code-signed yet. Both macOS and Windows will show a security warning on first launch. Follow the steps below to open it.

### macOS — "Meta Max Pro is damaged and can't be opened"

**Option A — Right-click to open (easiest):**
1. Drag `Meta Max Pro.app` to your **Applications** folder
2. **Right-click** (or Control-click) the app → click **Open**
3. Click **Open** in the dialog that appears

**Option B — Remove the quarantine flag via Terminal:**
```bash
xattr -cr "/Applications/Meta Max Pro.app"
```
Then double-click to open normally.

### Windows — "Windows protected your PC" / no signature warning

1. Click **More info** in the SmartScreen popup
2. Click **Run anyway**

For the ZIP: extract the folder, then right-click `Meta Max Pro.exe` → **Properties** → check **Unblock** at the bottom → **Apply** → **OK**, then double-click to launch.

## Setup (Development)

1. **Get a Gemini API Key**: Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. **Install Dependencies**: `npm install`
3. **Run the App**: `npm start`

## Usage

1. Enter your Gemini API key in the main window
2. Choose your profile and language in settings
3. Click "Start Session" to begin
4. Position the window using keyboard shortcuts
5. The AI will provide real-time assistance based on your screen and what interview asks

## Keyboard Shortcuts

- **Window Movement**: `Ctrl/Cmd + Arrow Keys` - Move window
- **Toggle Visibility**: `Ctrl/Cmd + \` - Hide or show the window
- **Click-through**: `Ctrl/Cmd + M` - Toggle mouse click-through
- **Analyze Screen**: `Ctrl/Cmd + Enter` - Single screenshot + analyze immediately (or solve buffered captures)
- **Capture to Buffer**: `Ctrl/Cmd + Shift + C` - Add screenshot to buffer (press multiple times for multi-page questions, then `Cmd+Enter` to solve all)
- **Previous Response**: `Ctrl/Cmd + [` - Navigate to previous answer
- **Next Response**: `Ctrl/Cmd + ]` - Navigate to next answer
- **Scroll Up/Down**: `Ctrl/Cmd + Shift + Up/Down`
- **Emergency Erase**: `Ctrl/Cmd + Shift + E` - Hide and clear screen

## Audio Capture

- **macOS**: [SystemAudioDump](https://github.com/Mohammed-Yasin-Mulla/Sound) for system audio
- **Windows**: Loopback audio capture
- **Linux**: Microphone input

## Requirements

- Electron-compatible OS (macOS, Windows, Linux)
- Gemini API key
- Screen recording permissions
- Microphone/audio permissions
