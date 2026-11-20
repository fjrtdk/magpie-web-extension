# Magpie Web Extension

[![Chrome Manifest V3](https://img.shields.io/badge/Manifest-V3-00a8ff.svg?style=flat-square)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Companion for Magpie](https://img.shields.io/badge/Companion-Magpie-23ff9a.svg?style=flat-square)](https://github.com/yetone/magpie)
[![Multi-Language](https://img.shields.io/badge/Locales-EN%20%7C%20PT%20%7C%20ES%20%7C%20DE%20%7C%20FR%20%7C%20IT-blue.svg?style=flat-square)](extension/_locales)
[![Zero Exfiltration](https://img.shields.io/badge/Privacy-100%25%20Local%20%2F%20Zero%20Exfil-brightgreen.svg?style=flat-square)](#security--privacy)

A community browser extension companion for **[Magpie](https://github.com/yetone/magpie)**. Detects, extracts, and formats session credentials for 25+ AI web providers with a single click, copying them to the clipboard so you can paste them wherever you configure that provider. It also keeps your Magpie gateway and the extension up to date with a built-in version updater.

---

## Table of Contents
- [Key Features](#key-features)
- [Supported AI Platforms](#supported-ai-platforms)
- [Installation Guide](#installation-guide)
- [How to Use](#how-to-use)
- [Magpie Version Updater](#magpie-version-updater)
- [Settings & Configuration](#settings--configuration)
- [Security & Privacy](#security--privacy)
- [Attribution & Credits](#attribution--credits)

---

## Key Features

- ⚡ **1-Click Credential Extraction**: Automatically detects active AI platform tabs, extracts the required credentials (cookies, Bearer tokens, or LocalStorage keys), formats them, and copies them to the clipboard.
- 🔄 **Built-in Magpie Version Updater**: Reads your running local Magpie gateway (`GET /api/hello` on `127.0.0.1:3425`) and compares it with the latest release of `yetone/magpie-releases`, with a 1-click copy of the install command (`curl -fsSL https://usemagpie.ai/install.sh | sh`).
- 🧩 **Extension Release Alerts**: Monitors GitHub releases of `fjrtdk/magpie-web-extension` for new extension versions.
- 🌐 **Multi-Language Support**: English by default, with live switching to Portuguese (`PT`), Spanish (`ES`), German (`DE`), French (`FR`), and Italian (`IT`).
- 🛠️ **Deep Gemini Cookie Detection**: `.google.com` domain traversal, URL querying, and live `webRequest` header capture for rotating `__Secure-1PSIDTS` cookies.
- 🔒 **100% Local & Privacy-Preserving**: Zero tracking, zero telemetry, zero remote data exfiltration. All processing happens inside your browser.

---

## Supported AI Platforms

The extension supports 25+ AI platforms across various authentication mechanisms:

| Provider ID | Platform Name | Extraction Method | Required Credential |
|---|---|---|---|
| `gemini` | **Google Gemini** | Full request Cookie | `SID` + `HSID` + `SSID` + `APISID` + `SAPISID` |
| `gemini-business` | **Gemini Business** | Full request Cookie | `SID` + `HSID` + `SSID` + `APISID` + `SAPISID` |
| `chatgpt` | **ChatGPT Web** | Cookie Prefix | `__Secure-next-auth.session-token` |
| `claude` | **Claude Web** | Cookie First Match | `sessionKey` / `__Secure-next-auth.session-token` |
| `deepseek` | **DeepSeek Web** | Local Storage | `userToken` |
| `grok` | **Grok Web** | Cookie Header | `sso` + `sso-rw` |
| `perplexity` | **Perplexity AI** | Cookie Prefix | `__Secure-next-auth.session-token` |
| `poe` | **Poe Web** | Cookie Value | `p-b` |
| `huggingchat` | **HuggingChat** | Cookie Header | `hf-chat` |
| `blackbox` | **Blackbox Web** | Cookie Prefix | `__Secure-authjs.session-token` |
| `copilot` | **Microsoft Copilot** | Captured Token | `access_token` (webRequest) |
| `m365` | **Microsoft 365 Copilot** | Chathub WS Token | `access_token` + WebSocket segment |
| `qwen` | **Qwen Web (Alibaba)** | Storage / SSO | `token` or `tongyi_sso_ticket` |
| `kimi` | **Kimi Web** | Cookie Header | `kimi-auth` |
| `dola` | **Dola Web (ByteDance)**| Cookie Header | `sessionid` + `ttwid` |
| `t3` | **t3.chat** | Hybrid | `convex-session-id` + Cookie |
| `yuanbao` | **Tencent Yuanbao** | Cookie Header | `hy_user` + `hy_token` |
| `v0` | **v0 Vercel Web** | Cookie Header | Session cookie |
| `venice` | **Venice Web** | Cookie Header | Session cookie |
| `zai` | **Z.ai Web** | Cookie Header | `token` |
| `zenmux` | **ZenMux Free** | Cookie Header | Session cookies |
| `adapta` | **Adapta.org** | Cookie Value | `__client` |
| `inner` | **Inner.ai** | Hybrid | Bearer Token + Account Email |
| `muse` | **Meta AI / Muse Spark**| Cookie First Match | `ecto_1_sess` or `abra_sess` |
| `arena` | **Arena.ai** | Cookie Header | `arena-auth-prod-v1.0` |

---

## Installation Guide

1. **Clone or Download** this repository:
   ```bash
   git clone https://github.com/fjrtdk/magpie-web-extension.git
   ```
2. Open **Google Chrome** and navigate to:
   ```text
   chrome://extensions
   ```
3. Enable **Developer mode** using the toggle switch in the top-right corner.
4. Click the **Load unpacked** button in the top-left corner.
5. Select the **`extension`** folder inside the cloned repository directory:
   ```text
   magpie-web-extension/extension
   ```
6. The extension icon will appear in your Chrome toolbar. Pin it for quick access.

---

## How to Use

1. Open your browser and navigate to any supported AI platform (e.g., [gemini.google.com](https://gemini.google.com) or [chatgpt.com](https://chatgpt.com)) and sign in.
2. Click the **Magpie Web** icon in your toolbar.
3. The active platform is automatically detected.
4. Click **AUTHORIZE AND COPY**.
5. The formatted credential is on your clipboard, ready to paste wherever you configure that provider.

---

## Magpie Version Updater

The extension includes an integrated updater for your local Magpie installation and the extension itself:

1. **Header Badge**: Displays your current status at a glance:
   - 🟢 `v8.2.0` (Up to date)
   - 🟠 **Update Available** (Pulsing amber badge when newer versions exist)
2. **Updater Modal**: Click the header badge to open the Updater view:
   - **Magpie Gateway Card**: Reads the running gateway's version from `GET /api/hello` and compares it with the latest release of [`yetone/magpie-releases`](https://github.com/yetone/magpie-releases/releases).
   - **1-Click Update**: Click **Copy Update Command** to copy `curl -fsSL https://usemagpie.ai/install.sh | sh`.
   - **Web Extension Card**: Checks GitHub releases of this repository for newer extension versions with a direct download link.
   - **Check Now**: Bypasses the 1-hour cache for a fresh live check.

---

## Settings & Configuration

Right-click the extension icon and select **Options** (or click the ⚙ gear icon in the popup):

- **Magpie Gateway URL**: Your Magpie gateway address (default: `http://127.0.0.1:3425`). Change it if Magpie runs on a custom port.
- **Gateway Key**: Optional. The gateway accepts any key from this machine; set one only when reaching a gateway shared on the network.
- **Test Connection**: Checks live connectivity and displays the detected gateway version.
- **Auto-check Toggle**: Runs a background update check when the popup opens (enabled by default).
- **Clear Captured Data**: Purges temporary memory caches and authorization headers.

---

## Security & Privacy

- **100% Local Execution**: All extraction and clipboard operations take place strictly within Chrome's local sandbox.
- **No External Analytics**: The extension contains no tracking scripts, telemetry, or external analytics.
- **Scoped Host Permissions**: Network requests are restricted to supported AI provider domains, the local machine (`http://127.0.0.1/*` and `http://localhost/*`, so a Magpie gateway on a custom port works), and GitHub releases.
- **Temporary Memory TTL**: Cookies or headers captured during extraction are retained in memory for at most 10 minutes and can be purged at any time with the "Clear captured data" button.

---

## Attribution & Credits

- **[Magpie](https://github.com/yetone/magpie)** is developed by **[yetone](https://github.com/yetone)**.
- This extension descends from **Omniroute-LIMPAKUS** by **[LIMPAKUS // ROOT ACCESS LAB](https://github.com/Anjokal/OMNIROUTE---Limpakus)** (`limpakus@gmail.com`), enhanced by **[Ranjan Kumar Tiwari (@rktiwari00)](https://github.com/rktiwari00)**, and adapted for Magpie by **[@fjrtdk](https://github.com/fjrtdk)**.

---

## License

This project is open-source under the [MIT License](LICENSE).
