# Magpie Version Updater Guide

The Magpie Web Extension features a built-in **Software Version Updater** that monitors both your local Magpie gateway and the web extension itself.

---

## How It Works

### 1. Magpie Gateway Version Checking
When you open the extension popup or click the **Check Now** button:
1. The extension contacts your local Magpie gateway at `http://127.0.0.1:3425/api/hello` (customizable in Settings).
2. It sends an `Authorization: Bearer <gatewayKey>` header only if you configured a gateway key in the extension options. On this machine the gateway accepts any key, so the field can stay blank.
3. Magpie answers with the running version:
   ```json
   {
     "name": "magpie",
     "version": "1.2.0"
   }
   ```
4. The extension then fetches the latest release from `https://api.github.com/repos/yetone/magpie-releases/releases/latest` and compares the two semver strings.
5. **Offline Fallback**: If the local gateway is unreachable, the extension still reports the latest published release and marks the gateway as offline.

### 2. Web Extension Version Checking
1. The extension reads its current installed version from `chrome.runtime.getManifest().version` (e.g. `8.0.0`).
2. It queries the GitHub Releases API (`https://api.github.com/repos/fjrtdk/magpie-web-extension/releases/latest`).
3. If a higher semver tag is detected on GitHub, it triggers the update alert.

---

## Using the Updater

### Visual Indicators
- 🟢 **Green Dot (`v8.0.0`)**: Everything is up to date.
- 🟠 **Pulsing Amber Badge ("Update Available")**: A newer version of Magpie or the extension is available.
- 🔵 **Spinner ("Checking...")**: Active network check in progress.

### 1-Click Gateway Update
1. Click the updater badge in the top header to open the dialog.
2. In the **Magpie Gateway** card, click **Copy Update Command**:
   ```bash
   curl -fsSL https://usemagpie.ai/install.sh | sh
   ```
3. Paste and run the command in your terminal. Magpie updates itself on every build, so this is only needed for a manual reinstall.

---

## Caching Behavior
To avoid spamming local ports and hitting GitHub API rate limits:
- Results are cached in `chrome.storage.local` for **1 hour** (`magpie_updater_cache`).
- Clicking **Check Now** in the updater modal bypasses the cache immediately and forces a fresh network check.
