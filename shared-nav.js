class GridPlayerNav extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setLanguage(this.preferredLanguage(), false);
  }

  preferredLanguage() {
    const urlLang = new URLSearchParams(window.location.search).get("lang");
    const storedLang = localStorage.getItem("gridplayer-language");
    const browserLang = navigator.language && navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
    return ["zh", "en"].includes(urlLang) ? urlLang : (["zh", "en"].includes(storedLang) ? storedLang : browserLang);
  }

  setLanguage(lang, notify = true) {
    const dictionary = GridPlayerNav.content[lang] || GridPlayerNav.content.zh;
    this.shadowRoot.querySelector("[data-nav-brand-subtitle]").textContent = dictionary.brandSubtitle;
    this.shadowRoot.querySelector("[data-nav-home]").textContent = dictionary.navHome;
    this.shadowRoot.querySelector("[data-nav-privacy]").textContent = dictionary.navPrivacy;
    this.shadowRoot.querySelector("[data-nav-terms]").textContent = dictionary.navTerms;
    this.shadowRoot.querySelector("[data-nav-support]").textContent = dictionary.navSupport;
    this.shadowRoot.querySelectorAll("[data-lang-button]").forEach((button) => {
      button.setAttribute("aria-pressed", button.dataset.langButton === lang ? "true" : "false");
    });
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    localStorage.setItem("gridplayer-language", lang);
    if (notify) {
      window.dispatchEvent(new CustomEvent("gridplayer-language-change", { detail: { lang } }));
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          color: #f6f7fb;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        .page {
          width: min(100% - 100px, 1440px);
          max-width: 1440px;
          margin: 0 auto;
        }

        header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 18px;
          padding: 22px 0 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          min-width: fit-content;
          color: inherit;
          text-decoration: none;
        }

        .brand img {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.28);
        }

        .brand strong {
          display: block;
          font-size: 18px;
          line-height: 1.2;
        }

        .brand small {
          display: block;
          color: #aeb6c8;
          font-size: 12px;
          font-weight: 600;
        }

        .top-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: flex-end;
          min-width: 0;
        }

        nav {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
          min-width: 0;
        }

        nav a,
        .lang-toggle button {
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: #aeb6c8;
          cursor: pointer;
          font: inherit;
          font-size: 14px;
          padding: 8px 13px;
          text-decoration: none;
          transition: background 0.2s ease, color 0.2s ease;
        }

        nav a:hover,
        .lang-toggle button:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #f6f7fb;
        }

        .lang-toggle {
          display: inline-flex;
          padding: 3px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
        }

        .lang-toggle button {
          min-width: 44px;
          padding: 6px 10px;
        }

        .lang-toggle button[aria-pressed="true"] {
          background: #f6f7fb;
          color: #0b0f17;
          font-weight: 700;
        }

        @media (max-width: 680px) {
          .page {
            width: min(100% - 36px, 1440px);
          }

          header,
          .top-actions,
          nav {
            width: 100%;
          }

          header {
            flex-direction: column;
            align-items: flex-start;
          }

          .top-actions,
          nav {
            justify-content: flex-start;
          }

          nav a {
            padding-inline: 10px;
          }
        }
      </style>

      <div class="page">
        <header>
          <a href="https://garycny.github.io/gridplayer-legal/gridplayer.html" class="brand" aria-label="GridPlayer">
            <img src="favicon.png" alt="GridPlayer Logo">
            <span>
              <strong>GridPlayer</strong>
              <small data-nav-brand-subtitle>格子播放器</small>
            </span>
          </a>

          <div class="top-actions">
            <nav aria-label="Primary navigation">
              <a href="https://garycny.github.io/gridplayer-legal/gridplayer.html" data-nav-home>首页</a>
              <a href="https://garycny.github.io/gridplayer-legal/privacy.html" data-nav-privacy>隐私政策</a>
              <a href="https://garycny.github.io/gridplayer-legal/terms.html" data-nav-terms>服务协议</a>
              <a href="https://garycny.github.io/gridplayer-legal/support.html" data-nav-support>技术支持</a>
            </nav>
            <div class="lang-toggle" aria-label="Language">
              <button type="button" data-lang-button="zh" aria-pressed="true">中</button>
              <button type="button" data-lang-button="en" aria-pressed="false">EN</button>
            </div>
          </div>
        </header>
      </div>
    `;

    this.shadowRoot.querySelectorAll("[data-lang-button]").forEach((button) => {
      button.addEventListener("click", () => this.setLanguage(button.dataset.langButton));
    });
  }
}

GridPlayerNav.content = {
  zh: {
    brandSubtitle: "格子播放器",
    navHome: "首页",
    navPrivacy: "隐私政策",
    navTerms: "服务协议",
    navSupport: "技术支持"
  },
  en: {
    brandSubtitle: "Personal music player",
    navHome: "Home",
    navPrivacy: "Privacy",
    navTerms: "Terms",
    navSupport: "Support"
  }
};

customElements.define("gridplayer-nav", GridPlayerNav);
