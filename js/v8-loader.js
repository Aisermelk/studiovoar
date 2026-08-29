/**
 * V8 ADMIN — Universal | Loader de integração
 *
 * Coloque este arquivo em qualquer site (ex: js/v8-loader.js) e inclua assim,
 * perto do fim do <body>, trocando SEU_PROJECT_ID pelo ID gerado no painel:
 *
 *   <script src="js/v8-loader.js" data-project-id62c5b2a7-031e-460b-9bad-915d1489d350ID"></script>
 *
 * O que ele faz sozinho, sem mais nada:
 *   1. Busca a config pública do projeto no Worker
 *   2. Injeta Meta Pixel / Google Analytics / Google Tag, se preenchidos
 *   3. Preenche qualquer elemento com atributo data-v8="..." (ver convenção abaixo)
 *   4. Se existir um formulário com data-v8-form, aponta ele pro Formspree
 *      certo E também salva uma cópia do lead no painel (aba Leads do projeto)
 *
 * CONVENÇÃO data-v8 (coloque no HTML do site, uma vez, e nunca mais mexe):
 *
 *   <a data-v8="contact.whatsapp">Falar no WhatsApp</a>
 *   <a data-v8="contact.email">E-mail</a>
 *   <a data-v8="contact.phone">Telefone</a>
 *   <a data-v8="social.instagram">Instagram</a>
 *   <a data-v8="social.facebook">Facebook</a>
 *   <a data-v8="social.tiktok">TikTok</a>
 *   <a data-v8="social.youtube">YouTube</a>
 *   <a data-v8="social.linkedin">LinkedIn</a>
 *
 * Qualquer um desses campos que estiver vazio no painel some da tela sozinho
 * (display:none) — não precisa checar nada manualmente no HTML.
 *
 * Formulário de contato:
 *
 *   <form data-v8-form>
 *     <input name="name">
 *     <input name="email">
 *     <textarea name="message"></textarea>
 *     <button type="submit">Enviar</button>
 *   </form>
 */

(function () {
  const scriptTag = document.currentScript;
  const PROJECT_ID = scriptTag && scriptTag.dataset.projectId;
  const API_URL =
    (scriptTag && scriptTag.dataset.apiUrl) ||
    "https://v8adminuniversal.aisermelk.workers.dev";

  if (!PROJECT_ID) {
    console.warn("V8 Loader: defina data-project-id no <script> do v8-loader.js");
    return;
  }

  function getByPath(obj, path) {
    return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
  }

  function injectScript(src, attrs) {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    if (attrs) Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
    document.head.appendChild(s);
  }

  function injectTracking(tracking) {
    if (!tracking) return;

    if (tracking.pixel) {
      /* eslint-disable */
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
        t = b.createElement(e); t.async = !0; t.src = v;
        s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
      })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      window.fbq("init", tracking.pixel);
      window.fbq("track", "PageView");
      /* eslint-enable */
    }

    if (tracking.analytics) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      injectScript(`https://www.googletagmanager.com/gtag/js?id=${tracking.analytics}`);
      window.gtag("js", new Date());
      window.gtag("config", tracking.analytics);
    }

    if (tracking.tag) {
      (function (w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
        const f = d.getElementsByTagName(s)[0], j = d.createElement(s);
        j.async = true;
        j.src = "https://www.googletagmanager.com/gtm.js?id=" + i;
        f.parentNode.insertBefore(j, f);
      })(window, document, "script", "dataLayer", tracking.tag);
    }
  }

  function fillFields(config) {
    document.querySelectorAll("[data-v8]").forEach((el) => {
      const path = el.dataset.v8;
      const value = getByPath(config, path);

      if (!value) {
        el.style.display = "none";
        return;
      }

      if (el.tagName === "A") {
        if (path === "contact.whatsapp") {
          const digits = String(value).replace(/\D/g, "");
          el.href = `https://wa.me/${digits}`;
        } else if (path === "contact.email") {
          el.href = `mailto:${value}`;
        } else if (path === "contact.phone") {
          el.href = `tel:${String(value).replace(/\D/g, "")}`;
        } else {
          el.href = value;
        }
      } else {
        el.textContent = value;
      }
    });
  }

  function wireForm(projectId, formspreeUrl) {
    const form = document.querySelector("[data-v8-form]");
    if (!form) return;

    if (formspreeUrl) form.action = formspreeUrl;

    form.addEventListener("submit", async (e) => {
      const data = Object.fromEntries(new FormData(form).entries());

      // salva cópia do lead no painel (não bloqueia o envio ao Formspree)
      fetch(`${API_URL}/api/public/leads/${encodeURIComponent(projectId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name || data.nome || "",
          email: data.email || "",
          message: data.message || data.mensagem || "",
        }),
      }).catch(() => {});

      // o envio pro Formspree em si segue o comportamento normal do <form>
      // (não fazemos e.preventDefault() — deixa o Formspree cuidar do resto)
    });
  }

  fetch(`${API_URL}/api/public/config/${encodeURIComponent(PROJECT_ID)}`)
    .then((r) => r.json())
    .then((config) => {
      if (config.error) {
        console.warn("V8 Loader: projeto não encontrado ou config indisponível.");
        return;
      }
      injectTracking(config.tracking);
      fillFields(config);
      wireForm(PROJECT_ID, config.formspree);
    })
    .catch(() => {
      console.warn("V8 Loader: não foi possível carregar a config do projeto.");
    });
})();
