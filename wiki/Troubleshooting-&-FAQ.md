# Troubleshooting & FAQ

Frequently asked questions and solutions for common issues when using the Magpie Web Extension.

---

## Common Issues & Fixes

### 1. "Could not find __Secure-1PSID" on Google Gemini
**Cause**: You might not be fully signed in, or the Google session cookie is stored on `.google.com` rather than `gemini.google.com`.  
**Solution**:
1. Open [gemini.google.com](https://gemini.google.com) in your browser and ensure you are logged in.
2. Send a test message or refresh the Gemini page.
3. Open the Magpie Web extension and click **AUTHORIZE AND COPY**. The extension will automatically search parent domain cookies and captured network headers.

---

### 2. "Authentication required (401)" when testing the Magpie connection
**Cause**: You are reaching a Magpie gateway that is shared on the network, which requires one of the user's gateway keys.
**Solution**:
1. In Magpie, open **Settings → Network and sharing** and copy a gateway key.
2. Open the Magpie Web extension **Settings** (gear icon) and paste the key into the **Gateway Key** field.
3. Click **Save Settings**, then click **Test Connection**. On this machine the gateway accepts any key, so the field can stay blank.

---

### 3. "Failed to load extension: Variable $FIELDS$ used but not defined"
**Cause**: An old version of the extension had an unescaped Chrome i18n variable syntax.  
**Solution**: This issue was completely resolved in version `8.0.1+`. Please ensure you are running the latest version from [fjrtdk/magpie-web-extension](https://github.com/fjrtdk/magpie-web-extension).

---

### 4. Running Magpie on a custom port
**Cause**: By default, the extension checks `http://127.0.0.1:3425`.
**Solution**:
1. Open the extension Settings page.
2. Change the **Magpie Gateway URL** to your custom address (e.g., `http://127.0.0.1:8080`).
3. Click **Save Settings**.

---

## Frequently Asked Questions (FAQ)

#### Q: Does this extension send my cookies or passwords to any server?
**A**: **No.** The extension has zero tracking or remote communication. Extraction happens entirely inside Chrome's memory on your local machine and copies the result directly to your clipboard.

#### Q: How often do session cookies expire?
**A**: Different providers have different token lifespans:
- Google Gemini `__Secure-1PSIDTS` rotates every few hours to days.
- ChatGPT `__Secure-next-auth.session-token` typically lasts 30 days.
- Claude `sessionKey` lasts between 7 and 30 days.  
Whenever an AI provider returns an authentication error, revisit the provider's website and click **AUTHORIZE AND COPY** again.

#### Q: Can I run this in Brave or Edge?
**A**: **Yes.** The extension runs on any Chromium-based browser supporting Manifest V3. Enable Developer Mode in `brave://extensions` or `edge://extensions` and click "Load unpacked".
