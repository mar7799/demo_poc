# Remote Control — Testing Guide

This guide walks through testing every part of the remote control feature on your local machine before using it in a real interview.

---

## Prerequisites

- App running via `npm start` on the **interview machine** (your Mac/Windows laptop)
- A **helper device** on the same WiFi — this can be:
  - Your phone
  - Another laptop/tablet
  - Even a second browser tab on the same machine (for solo testing)
- Both devices connected to the **same WiFi network**

---

## Step 1 — Start the App

```bash
cd "/Users/mar/Downloads/meta max pro"
npm start
```

Wait until you see in the terminal:
```
[Anthropic] Mode initialized — profile: interview
SystemAudioDump stderr: ✅ Capturing system audio.
```

---

## Step 2 — Enable Remote Control

1. Open the app window
2. Click the **Settings** tab (gear icon in the sidebar)
3. Scroll down to the **Remote Control** section
4. Toggle **"Enable remote control"** ON

You should see a URL appear, e.g.:
```
http://192.168.0.225:3847
```

> If you see `http://127.0.0.1:3847` instead of a real IP, your machine may not be connected to WiFi — check your network connection.

---

## Step 3 — Connect the Helper Device

On the helper device (phone, tablet, or another laptop):

1. Open a browser (Safari, Chrome, Firefox — any works)
2. Type the URL shown in the Settings panel exactly as shown
3. You should see the **Meta Max Pro Remote** page load — dark theme with connection controls

**Verify connection:**
- The green dot (●) in the top-left of the remote page should be **green**
- If it stays red, check both devices are on the same WiFi and try refreshing

> **Solo testing:** Open a new browser tab on the same machine and go to `http://localhost:3847`

---

## Step 4 — Test Navigation Controls

Start an interview session first:
1. Click **Start Session** on the main screen (or press `Cmd+Enter`)
2. Wait for "Claude Live" or "Anthropic Live" status

Now simulate a few AI responses — speak a question or type one in the text box. You should get AI responses visible in the app.

On the **helper's remote page**:

| Action | Expected result |
|--------|-----------------|
| Tap **Next →** | App moves to the next AI response (same as `Cmd+]`) |
| Tap **← Previous** | App moves back one response (same as `Cmd+[`) |
| Tap **↑ Scroll Up** | Main response area scrolls up |
| Tap **↓ Scroll Down** | Main response area scrolls down |

**Verify:** The response counter at the top-right of the remote page should update (e.g. `2 / 5`) to reflect the current position.

---

## Step 5 — Test "Copy to App Clipboard"

1. Navigate to any AI response using the remote
2. Tap **Copy to App Clipboard** button on the remote page
3. On the **interview machine**, open any text field (Notes, browser URL bar, etc.)
4. Press `Cmd+V` (Mac) or `Ctrl+V` (Windows)

**Expected:** The current response text pastes into the field.

> This is useful for pasting an AI-generated answer into a coding editor, chat window, or any form field during the interview — without touching the mouse.

---

## Step 6 — Test Helper Message (Send to Screen)

This is the most important feature — the helper can send any text directly to your screen.

1. On the helper's remote page, scroll down to the **"Send to screen"** blue section
2. Type or paste any text — e.g. a code snippet, a note, a better answer
3. Tap **Send to Screen** (or press `Ctrl+Enter` / `Cmd+Enter` on desktop)

**Expected on the interview machine:**
- A new response appears with a **blue left border** and "💬 From your helper" badge at the top
- The app automatically navigates to that response
- It is clearly visually distinct from AI-generated responses

**Test with code:**
```java
// paste this in the helper text area
public static int findMax(int[] arr) {
    int max = arr[0];
    for (int x : arr) if (x > max) max = x;
    return max;
}
```
You should see the code appear with proper formatting on the interview screen.

---

## Step 7 — Test Pinned Panel Controls

First create a pinned design or code:
1. Have the AI generate a system design (ask "design a notification system")
2. After the response, a chip button should appear at the bottom strip (e.g. "⬡ Notification System")
3. Click it once to open the pinned panel

On the **helper's remote page**:
1. Scroll to the **"Pinned Designs & Code"** section
2. You should see the chip listed there (e.g. "⬡ Notification System")
3. Tap the chip to **toggle it** — the panel should open/close on the interview machine
4. Tap **Close All** — all open pinned panels should close immediately

**Verify:** Chip shows as highlighted/active in the remote UI when the panel is open on the main screen.

---

## Step 8 — Test Auto-Sync (State Stays in Sync)

1. Navigate between responses using the **keyboard shortcuts** on the interview machine (`Cmd+[` / `Cmd+]`)
2. Watch the **helper's remote page** — the response text and counter should update automatically within a fraction of a second
3. Ask a new question — when the new AI response comes in, the remote page should update to show the new text

**Expected:** The remote page always reflects what's currently shown on the interview machine.

---

## Step 9 — Test Disconnect and Reconnect

1. On the helper device, turn WiFi off and back on (or reload the page)
2. The green dot should briefly go red, then turn green again once reconnected
3. Current state should be restored — the helper sees the current response and position

---

## Step 10 — Disable Remote Control

When done testing:
1. Go back to **Settings → Remote Control**
2. Toggle **OFF**
3. The URL disappears and the server stops — helper's page goes to a red dot (disconnected)

---

## Troubleshooting

**Helper page won't load:**
- Confirm both devices are on the same WiFi (not 4G/LTE vs WiFi)
- Check the IP in Settings — if it shows `127.0.0.1` the machine isn't on WiFi
- Try disabling the Mac firewall: System Settings → Network → Firewall → turn off temporarily for testing
- On Windows: allow the app through Windows Firewall when prompted

**Green dot stays red (can't connect):**
- Try `http://localhost:3847` on the same machine to confirm the server is up
- Check the terminal for `[RemoteControl] Server started on port 3847`
- Restart the app and re-enable remote control

**Helper messages not appearing:**
- Check the terminal for any errors after tapping Send
- Make sure you have an active session started (not just on the main screen)

**Copy to clipboard not working:**
- This copies to the interview machine's clipboard, not the helper's
- Try pressing `Cmd+V` / `Ctrl+V` in a text field on the interview machine after tapping the button

**Pins not showing on remote:**
- Pins only appear after the AI generates a response containing a mermaid diagram or code block
- The chip must be visible in the strip at the bottom of the assistant view first

---

## Quick Test Checklist

- [ ] Remote URL shows in Settings when toggled on
- [ ] Helper page loads and shows green dot
- [ ] Next/Prev buttons navigate responses on main screen
- [ ] Response text updates on remote page when navigating
- [ ] Copy to clipboard works (`Cmd+V` pastes on interview machine)
- [ ] Helper message appears with blue border and badge on main screen
- [ ] Pin chips show on remote and toggle correctly
- [ ] Close All pins works from remote
- [ ] Disconnecting and reconnecting restores state
- [ ] Toggle off stops the server
