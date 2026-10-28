/**
 * Boot script that reads user preference values from cookies or localStorage
 * based on the configured persistence mode.
 *
 * Runs early in <head> to apply the correct data attributes before hydration,
 * preventing layout or theme flicker and keeping RootLayout fully static.
 */
import { PREFERENCE_REGISTRY } from "@/lib/preferences/preferences-config";

export function ThemeBootScript() {
  const registry = JSON.stringify(PREFERENCE_REGISTRY);

  const code = `
    (function () {
      var _rawOpen;
      var _safeOpenHolder;
      try {
        if (typeof window !== "undefined") {
          _rawOpen = window.open;
          _safeOpenHolder = _rawOpen;

          function installOpenShim(obj) {
            if (!obj) return false;
            try {
              var desc = Object.getOwnPropertyDescriptor(obj, "open");
              if (!desc || desc.configurable) {
                Object.defineProperty(obj, "open", {
                  get: function() {
                    return _safeOpenHolder;
                  },
                  set: function(val) {
                    _safeOpenHolder = val;
                  },
                  configurable: true,
                  enumerable: true,
                });
                return true;
              }
            } catch (err) {
              return false;
            }
            return false;
          }

          if (!installOpenShim(window) && typeof Window !== "undefined" && Window.prototype) {
            installOpenShim(Window.prototype);
          }

          // Global error listener to prevent chrome extension content scripts from breaking React error boundaries
          window.addEventListener(
            "error",
            function(evt) {
              var file = (evt && evt.filename) || "";
              var msg = (evt && evt.message) || "";
              if (
                file.indexOf("chrome-extension://") !== -1 ||
                msg.indexOf("read only property") !== -1 ||
                msg.indexOf("blockPopupsFunc") !== -1 ||
                msg.indexOf("popups-script.js") !== -1
              ) {
                if (typeof evt.stopImmediatePropagation === "function") {
                  evt.stopImmediatePropagation();
                }
                if (typeof evt.preventDefault === "function") {
                  evt.preventDefault();
                }
                return true;
              }
            },
            true
          );
        }

        var root = document.documentElement;
        var REGISTRY = ${registry};

        function readCookie(name) {
          var match = document.cookie.split("; ").find(function(c) {
            return c.startsWith(name + "=");
          });
          return match ? decodeURIComponent(match.split("=")[1]) : null;
        }

        function readLocal(name) {
          try {
            return window.localStorage.getItem(name);
          } catch (e) {
            return null;
          }
        }

        function readPreference(key, definition) {
          var mode = definition.persistence;
          var value = null;

          if (mode === "localStorage") {
            value = readLocal(key);
          }

          if (!value && (mode === "client-cookie" || mode === "server-cookie")) {
            value = readCookie(key);
          }

          return definition.values.indexOf(value) >= 0 ? value : definition.defaultValue;
        }

        var preferences = {};

        Object.keys(REGISTRY).forEach(function(key) {
          var definition = REGISTRY[key];
          var value = readPreference(key, definition);

          preferences[key] = value;
          root.setAttribute(definition.attribute, value);
        });

        var mode = preferences.theme_mode;
        var resolvedMode =
          mode === "system" && window.matchMedia
            ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
            : mode === "dark"
              ? "dark"
              : "light";

        root.classList.toggle("dark", resolvedMode === "dark");
        root.style.colorScheme = resolvedMode;

      } catch (e) {
        console.warn("ThemeBootScript error:", e);
      }
    })();
  `;

  /* biome-ignore lint/security/noDangerouslySetInnerHtml: required for pre-hydration boot script */
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
