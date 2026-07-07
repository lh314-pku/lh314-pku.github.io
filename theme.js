(function () {
  var storageKey = "lh314-theme";
  var root = document.documentElement;

  function preferredTheme() {
    try {
      var saved = localStorage.getItem(storageKey);
      if (saved === "light" || saved === "dark") return saved;
    } catch (error) {
      // Ignore unavailable storage.
    }
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var toggle = document.querySelector("[data-theme-toggle]");
    if (!toggle) return;
    var isDark = theme === "dark";
    toggle.setAttribute("aria-label", isDark ? "切换到日间模式" : "切换到夜间模式");
    toggle.setAttribute("aria-pressed", String(isDark));
    var icon = toggle.querySelector(".theme-toggle-icon");
    var text = toggle.querySelector(".theme-toggle-text");
    if (icon) icon.textContent = isDark ? "☀" : "☾";
    if (text) text.textContent = isDark ? "日间模式" : "夜间模式";
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      // Ignore unavailable storage.
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(root.getAttribute("data-theme") || preferredTheme());
    var toggle = document.querySelector("[data-theme-toggle]");
    if (!toggle) return;
    toggle.addEventListener("click", function () {
      var nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      saveTheme(nextTheme);
    });
  });
})();
