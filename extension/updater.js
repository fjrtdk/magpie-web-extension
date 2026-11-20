/**
 * Magpie Version Updater
 * Checks the local Magpie gateway and the web extension for updates.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MagpieUpdater = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const CACHE_KEY = 'magpie_updater_cache';
  const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
  const DEFAULT_MAGPIE_URL = 'http://127.0.0.1:3425';
  const DEFAULT_REPO = 'fjrtdk/magpie-web-extension';
  const MAGPIE_RELEASES_REPO = 'yetone/magpie-releases';
  const UPDATE_COMMAND = 'curl -fsSL https://usemagpie.ai/install.sh | sh';

  /**
   * Cleans a semver string (strips leading 'v', metadata, etc.)
   */
  function cleanSemver(v) {
    if (!v || typeof v !== 'string') return '0.0.0';
    const trimmed = v.trim().replace(/^v/i, '');
    const clean = trimmed.split(/[-+]/)[0];
    return clean || '0.0.0';
  }

  /**
   * Compares two semver strings.
   * Returns: 1 if v1 > v2, -1 if v1 < v2, 0 if equal.
   */
  function compareVersions(v1, v2) {
    const p1 = cleanSemver(v1).split('.').map(n => parseInt(n, 10) || 0);
    const p2 = cleanSemver(v2).split('.').map(n => parseInt(n, 10) || 0);
    const len = Math.max(p1.length, p2.length, 3);

    for (let i = 0; i < len; i++) {
      const num1 = p1[i] || 0;
      const num2 = p2[i] || 0;
      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
    }
    return 0;
  }

  /**
   * Latest Magpie release from GitHub (yetone/magpie-releases).
   * Returns null when the check fails.
   */
  async function fetchLatestRelease(repo, fetchFn) {
    try {
      const res = await fetchFn(`https://api.github.com/repos/${repo}/releases/latest`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Magpie-Web-Extension'
        }
      });
      if (res && res.ok) {
        const data = await res.json();
        return {
          version: cleanSemver(data.tag_name || data.name || ''),
          url: data.html_url || `https://github.com/${repo}/releases`
        };
      }
    } catch (e) {
      // Release check failed
    }
    return null;
  }

  /**
   * Checks the local Magpie gateway (GET /api/hello -> {name, version})
   * against the latest GitHub release. When the gateway is unreachable,
   * reports the latest release only.
   */
  async function checkMagpieServer(baseUrl, apiKey, fetchFn) {
    const _fetch = fetchFn || (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : null);
    if (!_fetch) throw new Error('No fetch function available');

    const cleanUrl = (baseUrl || DEFAULT_MAGPIE_URL).replace(/\/+$/, '');
    const headers = { 'Accept': 'application/json' };
    if (apiKey && apiKey.trim()) {
      headers['Authorization'] = `Bearer ${apiKey.trim()}`;
    }

    let current = null;
    try {
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 4000) : null;

      const res = await _fetch(`${cleanUrl}/api/hello`, {
        method: 'GET',
        headers,
        signal: controller ? controller.signal : undefined
      });
      if (timeoutId) clearTimeout(timeoutId);

      if (res && res.ok) {
        const data = await res.json();
        current = data.version || null;
      }
    } catch (e) {
      // Gateway offline or failed
    }

    const release = await fetchLatestRelease(MAGPIE_RELEASES_REPO, _fetch);

    if (!current) {
      return {
        status: 'server_offline',
        current: null,
        latest: release ? release.version : null,
        updateAvailable: false,
        updateCommand: UPDATE_COMMAND,
        releaseUrl: release ? release.url : null
      };
    }

    const latest = release ? release.version : current;
    const updateAvailable = release ? compareVersions(latest, current) > 0 : false;

    return {
      status: updateAvailable ? 'update_available' : 'up_to_date',
      current,
      latest,
      updateAvailable,
      updateCommand: UPDATE_COMMAND,
      releaseUrl: release ? release.url : null
    };
  }

  /**
   * Checks GitHub releases for the latest version of this extension.
   */
  async function checkExtensionRelease(currentVersion, repo, fetchFn) {
    const _fetch = fetchFn || (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : null);
    if (!_fetch) throw new Error('No fetch function available');

    const targetRepo = repo || DEFAULT_REPO;
    const defaultReleaseUrl = `https://github.com/${targetRepo}/releases`;

    try {
      const res = await _fetch(`https://api.github.com/repos/${targetRepo}/releases/latest`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Magpie-Web-Extension'
        }
      });

      if (res && res.ok) {
        const data = await res.json();
        const tag = data.tag_name || data.name || '';
        const cleanLatest = cleanSemver(tag);
        const cleanCurrent = cleanSemver(currentVersion);
        const updateAvailable = compareVersions(cleanLatest, cleanCurrent) > 0;

        return {
          status: updateAvailable ? 'update_available' : 'up_to_date',
          current: cleanCurrent,
          latest: cleanLatest,
          updateAvailable,
          releaseUrl: data.html_url || defaultReleaseUrl,
          releaseName: data.name || tag
        };
      }
    } catch (e) {
      // GitHub check failed
    }

    return {
      status: 'up_to_date',
      current: cleanSemver(currentVersion),
      latest: cleanSemver(currentVersion),
      updateAvailable: false,
      releaseUrl: defaultReleaseUrl
    };
  }

  /**
   * Orchestrates full check with cache support.
   */
  async function checkForUpdates(options = {}) {
    const storage = options.storage || (typeof chrome !== 'undefined' && chrome.storage ? chrome.storage.local : null);
    const fetchFn = options.fetchFn;
    const forceRefresh = !!options.forceRefresh;
    const currentExtVersion = options.currentExtVersion || (typeof chrome !== 'undefined' && chrome.runtime?.getManifest ? chrome.runtime.getManifest().version : '8.0.0');
    const magpieUrl = options.magpieUrl || DEFAULT_MAGPIE_URL;
    const apiKey = options.apiKey || '';

    // Check cache
    if (!forceRefresh && storage) {
      try {
        const cached = await storage.get(CACHE_KEY);
        const cacheEntry = cached ? cached[CACHE_KEY] : null;
        if (cacheEntry && cacheEntry.timestamp && (Date.now() - cacheEntry.timestamp) < CACHE_TTL_MS) {
          return cacheEntry;
        }
      } catch (e) {
        // Ignore cache read error
      }
    }

    // Run parallel checks
    const [serverRes, extRes] = await Promise.all([
      checkMagpieServer(magpieUrl, apiKey, fetchFn),
      checkExtensionRelease(currentExtVersion, DEFAULT_REPO, fetchFn)
    ]);

    const result = {
      timestamp: Date.now(),
      server: serverRes,
      extension: extRes,
      hasUpdate: !!(serverRes.updateAvailable || extRes.updateAvailable)
    };

    // Save cache
    if (storage) {
      try {
        await storage.set({ [CACHE_KEY]: result });
      } catch (e) {
        // Ignore cache write error
      }
    }

    return result;
  }

  return {
    cleanSemver,
    compareVersions,
    checkMagpieServer,
    checkExtensionRelease,
    checkForUpdates,
    UPDATE_COMMAND,
    DEFAULT_MAGPIE_URL
  };
});
