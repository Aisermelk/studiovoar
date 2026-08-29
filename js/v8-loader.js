/**
 * V8 ADMIN — Universal | Loader de integração
 *
 * Uso:
 *
 * <script
 *     src="js/v8-loader.js"
 *     data-project-id="SEU_PROJECT_ID"
 *     defer
 * ></script>
 *
 * Projeto Studio Voar:
 *
 * 62c5b2a7-031e-460b-9bad-915d1489d350
 *
 * Funções:
 *
 * 1. Busca a configuração pública do projeto no Worker
 * 2. Injeta Meta Pixel
 * 3. Injeta Google Analytics
 * 4. Injeta Google Tag Manager
 * 5. Preenche elementos [data-v8]
 * 6. Controla automaticamente WhatsApp
 * 7. Controla e-mail
 * 8. Controla telefone
 * 9. Controla redes sociais
 * 10. Esconde campos não configurados
 * 11. Mostra automaticamente campos configurados
 * 12. Configura Formspree
 * 13. Salva leads no V8 Admin
 */

(function () {

    "use strict";


    /* =====================================================
       CONFIGURAÇÃO
    ====================================================== */

    const scriptTag = document.currentScript;

    const PROJECT_ID =
        scriptTag &&
        scriptTag.dataset.projectId;

    const API_URL =
        (scriptTag && scriptTag.dataset.apiUrl) ||
        "https://v8adminuniversal.aisermelk.workers.dev";


    /* =====================================================
       VALIDAÇÃO
    ====================================================== */

    if (!PROJECT_ID) {

        console.warn(
            "V8 Loader: defina data-project-id no <script> do v8-loader.js"
        );

        return;

    }


    /* =====================================================
       FUNÇÃO — BUSCAR VALOR POR CAMINHO
    ====================================================== */

    function getByPath(obj, path) {

        if (!obj || !path) {
            return undefined;
        }

        return path
            .split(".")
            .reduce(
                (current, key) =>
                    current != null
                        ? current[key]
                        : undefined,
                obj
            );

    }


    /* =====================================================
       FUNÇÃO — INJETAR SCRIPT
    ====================================================== */

    function injectScript(src, attrs) {

        if (!src) {
            return;
        }

        const existing =
            document.querySelector(
                `script[src="${src}"]`
            );

        if (existing) {
            return;
        }

        const script =
            document.createElement("script");

        script.src = src;

        script.async = true;

        if (attrs) {

            Object.entries(attrs)
                .forEach(([key, value]) => {

                    script.setAttribute(
                        key,
                        value
                    );

                });

        }

        document.head.appendChild(script);

    }


    /* =====================================================
       TRACKING
    ====================================================== */

    function injectTracking(tracking) {

        if (!tracking) {
            return;
        }


        /* =================================================
           META PIXEL
        ================================================= */

        if (tracking.pixel) {

            if (!window.fbq) {

                /* eslint-disable */

                !(function (
                    f,
                    b,
                    e,
                    v,
                    n,
                    t,
                    s
                ) {

                    if (f.fbq) {
                        return;
                    }

                    n =
                        f.fbq =
                        function () {

                            n.callMethod
                                ? n.callMethod.apply(
                                    n,
                                    arguments
                                )
                                : n.queue.push(
                                    arguments
                                );

                        };

                    if (!f._fbq) {
                        f._fbq = n;
                    }

                    n.push = n;

                    n.loaded = true;

                    n.version = "2.0";

                    n.queue = [];

                    t =
                        b.createElement(e);

                    t.async = true;

                    t.src = v;

                    s =
                        b.getElementsByTagName(e)[0];

                    s.parentNode.insertBefore(
                        t,
                        s
                    );

                })(
                    window,
                    document,
                    "script",
                    "https://connect.facebook.net/en_US/fbevents.js"
                );

                /* eslint-enable */

            }

            window.fbq(
                "init",
                tracking.pixel
            );

            window.fbq(
                "track",
                "PageView"
            );

        }


        /* =================================================
           GOOGLE ANALYTICS
        ================================================= */

        if (tracking.analytics) {

            window.dataLayer =
                window.dataLayer || [];

            window.gtag =
                window.gtag ||
                function () {

                    window.dataLayer.push(
                        arguments
                    );

                };


            injectScript(
                `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
                    tracking.analytics
                )}`
            );


            window.gtag(
                "js",
                new Date()
            );


            window.gtag(
                "config",
                tracking.analytics
            );

        }


        /* =================================================
           GOOGLE TAG MANAGER
        ================================================= */

        if (tracking.tag) {

            (function (
                w,
                d,
                s,
                l,
                i
            ) {

                w[l] =
                    w[l] || [];

                w[l].push({
                    "gtm.start":
                        new Date().getTime(),

                    event:
                        "gtm.js"
                });


                const firstScript =
                    d.getElementsByTagName(s)[0];

                const gtmScript =
                    d.createElement(s);


                gtmScript.async =
                    true;


                gtmScript.src =
                    "https://www.googletagmanager.com/gtm.js?id=" +
                    encodeURIComponent(i);


                firstScript
                    .parentNode
                    .insertBefore(
                        gtmScript,
                        firstScript
                    );

            })(
                window,
                document,
                "script",
                "dataLayer",
                tracking.tag
            );

        }

    }


    /* =====================================================
       CONTROLE DE VISIBILIDADE
    ====================================================== */

    function showElement(el) {

        /*
         * Remove o atributo hidden.
         */

        el.hidden = false;


        /*
         * Remove display:none colocado anteriormente
         * pelo loader.
         */

        el.style.removeProperty(
            "display"
        );

    }


    function hideElement(el) {

        /*
         * Usa hidden de forma nativa.
         */

        el.hidden = true;


        /*
         * Garante compatibilidade com CSS
         * existente.
         */

        el.style.display =
            "none";

    }


    /* =====================================================
       CONFIGURAR LINK WHATSAPP
    ====================================================== */

    function configureWhatsApp(
        el,
        value
    ) {

        const digits =
            String(value)
                .replace(/\D/g, "");


        /*
         * Sem número válido:
         * esconde o elemento.
         */

        if (!digits) {

            hideElement(el);

            return;

        }


        /*
         * URL oficial de abertura do WhatsApp.
         */

        el.href =
            `https://wa.me/${digits}`;


        /*
         * Abre em nova aba.
         */

        el.target =
            "_blank";


        el.rel =
            "noopener noreferrer";


        /*
         * Garante que o elemento fique visível.
         */

        showElement(el);

    }


    /* =====================================================
       CONFIGURAR E-MAIL
    ====================================================== */

    function configureEmail(
        el,
        value
    ) {

        const email =
            String(value)
                .trim();


        if (!email) {

            hideElement(el);

            return;

        }


        el.href =
            `mailto:${email}`;


        showElement(el);

    }


    /* =====================================================
       CONFIGURAR TELEFONE
    ====================================================== */

    function configurePhone(
        el,
        value
    ) {

        const digits =
            String(value)
                .replace(/\D/g, "");


        if (!digits) {

            hideElement(el);

            return;

        }


        el.href =
            `tel:${digits}`;


        showElement(el);

    }


    /* =====================================================
       CONFIGURAR REDES SOCIAIS
    ====================================================== */

    function configureSocial(
        el,
        value
    ) {

        const url =
            String(value)
                .trim();


        if (!url) {

            hideElement(el);

            return;

        }


        el.href =
            url;


        /*
         * Links externos.
         */

        if (
            el.tagName === "A"
        ) {

            el.target =
                "_blank";

            el.rel =
                "noopener noreferrer";

        }


        showElement(el);

    }


    /* =====================================================
       PREENCHER CAMPOS DATA-V8
    ====================================================== */

    function fillFields(config) {

        document
            .querySelectorAll("[data-v8]")
            .forEach((el) => {

                const path =
                    el.dataset.v8;


                if (!path) {
                    return;
                }


                const value =
                    getByPath(
                        config,
                        path
                    );


                /*
                 * Campo vazio no painel.
                 */

                if (
                    value === undefined ||
                    value === null ||
                    String(value).trim() === ""
                ) {

                    hideElement(el);

                    return;

                }


                /* =========================================
                   WHATSAPP
                ========================================== */

                if (
                    path ===
                    "contact.whatsapp"
                ) {

                    configureWhatsApp(
                        el,
                        value
                    );

                    return;

                }


                /* =========================================
                   E-MAIL
                ========================================== */

                if (
                    path ===
                    "contact.email"
                ) {

                    if (
                        el.tagName === "A"
                    ) {

                        configureEmail(
                            el,
                            value
                        );

                    } else {

                        el.textContent =
                            value;

                        showElement(el);

                    }

                    return;

                }


                /* =========================================
                   TELEFONE
                ========================================== */

                if (
                    path ===
                    "contact.phone"
                ) {

                    if (
                        el.tagName === "A"
                    ) {

                        configurePhone(
                            el,
                            value
                        );

                    } else {

                        el.textContent =
                            value;

                        showElement(el);

                    }

                    return;

                }


                /* =========================================
                   REDES SOCIAIS
                ========================================== */

                if (
                    path.startsWith(
                        "social."
                    )
                ) {

                    if (
                        el.tagName === "A"
                    ) {

                        configureSocial(
                            el,
                            value
                        );

                    } else {

                        el.textContent =
                            value;

                        showElement(el);

                    }

                    return;

                }


                /* =========================================
                   OUTROS CAMPOS
                ========================================== */

                if (
                    el.tagName === "INPUT" ||
                    el.tagName === "TEXTAREA"
                ) {

                    el.value =
                        value;

                } else {

                    el.textContent =
                        value;

                }


                showElement(el);

            });

    }


    /* =====================================================
       FORMULÁRIO — V8 ADMIN + FORMSPREE
    ====================================================== */

    function wireForm(
        projectId,
        formspreeUrl
    ) {

        const form =
            document.querySelector(
                "[data-v8-form]"
            );


        if (!form) {
            return;
        }


        /*
         * Configura Formspree.
         */

        if (formspreeUrl) {

            form.action =
                formspreeUrl;

            form.method =
                "POST";

        }


        /*
         * Evita registrar o mesmo formulário
         * duas vezes.
         */

        if (
            form.dataset.v8Wired === "true"
        ) {

            return;

        }


        form.dataset.v8Wired =
            "true";


        form.addEventListener(
            "submit",
            async function (event) {

                const data =
                    Object.fromEntries(
                        new FormData(form)
                            .entries()
                    );


                /*
                 * Salva cópia do lead no V8 Admin.
                 *
                 * Isso não bloqueia o Formspree.
                 */

                fetch(
                    `${API_URL}/api/public/leads/${encodeURIComponent(
                        projectId
                    )}`,
                    {
                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                name:
                                    data.name ||
                                    data.nome ||
                                    "",

                                email:
                                    data.email ||
                                    "",

                                whatsapp:
                                    data.whatsapp ||
                                    data.phone ||
                                    data.telefone ||
                                    "",

                                modality:
                                    data.modality ||
                                    data.modalidade ||
                                    "",

                                message:
                                    data.message ||
                                    data.mensagem ||
                                    ""

                            })

                    }
                )
                .catch(() => {});


                /*
                 * Não usamos preventDefault().
                 *
                 * O navegador continua enviando
                 * normalmente para o Formspree.
                 */

            }
        );

    }


    /* =====================================================
       CARREGAR CONFIGURAÇÃO DO PROJETO
    ====================================================== */

    async function loadConfig() {

        try {

            const response =
                await fetch(
                    `${API_URL}/api/public/config/${encodeURIComponent(
                        PROJECT_ID
                    )}`,
                    {
                        method:
                            "GET",

                        headers: {
                            "Accept":
                                "application/json"
                        },

                        cache:
                            "no-store"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            const config =
                await response.json();


            if (
                !config ||
                config.error
            ) {

                console.warn(
                    "V8 Loader: projeto não encontrado ou configuração indisponível."
                );

                return;

            }


            /*
             * Tracking
             */

            injectTracking(
                config.tracking
            );


            /*
             * Campos data-v8
             */

            fillFields(
                config
            );


            /*
             * Formulário
             */

            wireForm(
                PROJECT_ID,
                config.formspree
            );


            /*
             * Evento personalizado para permitir
             * integrações adicionais no site.
             */

            window.dispatchEvent(
                new CustomEvent(
                    "v8:ready",
                    {
                        detail: {
                            projectId:
                                PROJECT_ID,

                            config:
                                config
                        }
                    }
                )
            );


        } catch (error) {

            console.warn(
                "V8 Loader: não foi possível carregar a configuração do projeto.",
                error
            );

        }

    }


    /* =====================================================
       INICIALIZAÇÃO
    ====================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            loadConfig,
            {
                once: true
            }
        );

    } else {

        loadConfig();

    }


})();
```
