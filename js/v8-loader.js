/**
 * ============================================================
 * V8 ADMIN — UNIVERSAL
 * Loader de integração
 * ============================================================
 *
 * Integra automaticamente:
 *
 * - WhatsApp
 * - E-mail
 * - Telefone
 * - Instagram
 * - Facebook
 * - TikTok
 * - YouTube
 * - LinkedIn
 * - Meta Pixel
 * - Google Analytics
 * - Google Tag Manager
 * - Formspree
 * - Leads no V8 Admin
 *
 * USO:
 *
 * <script
 *   src="js/v8-loader.js"
 *   data-project-id="SEU_PROJECT_ID">
 * </script>
 *
 * Opcional:
 *
 * data-api-url="https://seu-worker.workers.dev"
 *
 * ============================================================
 */

(function () {

    "use strict";


    /* ========================================================
       CONFIGURAÇÃO
    ======================================================== */

    const scriptTag = document.currentScript;

    const PROJECT_ID =
        scriptTag &&
        scriptTag.dataset &&
        scriptTag.dataset.projectId;

    const API_URL =
        (
            scriptTag &&
            scriptTag.dataset &&
            scriptTag.dataset.apiUrl
        ) ||
        "https://v8adminuniversal.aisermelk.workers.dev";


    /* ========================================================
       VALIDAÇÃO
    ======================================================== */

    if (!PROJECT_ID) {

        console.warn(
            "V8 Loader: data-project-id não foi definido."
        );

        return;
    }


    /* ========================================================
       UTILIDADES
    ======================================================== */

    function getByPath(object, path) {

        if (!object || !path) {
            return undefined;
        }

        return path
            .split(".")
            .reduce(function (current, key) {

                if (
                    current === null ||
                    current === undefined
                ) {
                    return undefined;
                }

                return current[key];

            }, object);
    }


    function normalizeValue(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        return String(value).trim();
    }


    function injectScript(src, attributes) {

        if (!src) {
            return;
        }

        const script = document.createElement("script");

        script.src = src;

        script.async = true;

        if (attributes) {

            Object.keys(attributes).forEach(function (key) {

                script.setAttribute(
                    key,
                    attributes[key]
                );

            });

        }

        document.head.appendChild(script);
    }


    /* ========================================================
       TRACKING
    ======================================================== */

    function injectTracking(tracking) {

        if (!tracking) {
            return;
        }


        /* ====================================================
           META PIXEL
        ==================================================== */

        const pixel = normalizeValue(
            tracking.pixel
        );

        if (pixel) {

            if (!window.fbq) {

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

                    n = f.fbq = function () {

                        n.callMethod
                            ? n.callMethod.apply(
                                n,
                                arguments
                            )
                            : n.queue.push(arguments);

                    };

                    if (!f._fbq) {
                        f._fbq = n;
                    }

                    n.push = n;

                    n.loaded = true;

                    n.version = "2.0";

                    n.queue = [];

                    t = b.createElement(e);

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

            }


            try {

                window.fbq(
                    "init",
                    pixel
                );

                window.fbq(
                    "track",
                    "PageView"
                );

            } catch (error) {

                console.warn(
                    "V8 Loader: erro ao inicializar Meta Pixel.",
                    error
                );

            }

        }


        /* ====================================================
           GOOGLE ANALYTICS
        ==================================================== */

        const analytics = normalizeValue(
            tracking.analytics
        );

        if (analytics) {

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
                "https://www.googletagmanager.com/gtag/js?id=" +
                encodeURIComponent(analytics)
            );


            window.gtag(
                "js",
                new Date()
            );


            window.gtag(
                "config",
                analytics
            );

        }


        /* ====================================================
           GOOGLE TAG MANAGER
        ==================================================== */

        const tag = normalizeValue(
            tracking.tag
        );

        if (tag) {

            window.dataLayer =
                window.dataLayer || [];


            window.dataLayer.push({
                "gtm.start":
                    new Date().getTime(),

                event:
                    "gtm.js"
            });


            const firstScript =
                document.getElementsByTagName(
                    "script"
                )[0];


            const gtmScript =
                document.createElement(
                    "script"
                );


            gtmScript.async = true;


            gtmScript.src =
                "https://www.googletagmanager.com/gtm.js?id=" +
                encodeURIComponent(tag);


            if (firstScript) {

                firstScript.parentNode.insertBefore(
                    gtmScript,
                    firstScript
                );

            } else {

                document.head.appendChild(
                    gtmScript
                );

            }

        }

    }


    /* ========================================================
       WHATSAPP
    ======================================================== */

    function createWhatsAppUrl(value) {

        const raw =
            normalizeValue(value);

        if (!raw) {
            return "";
        }


        const digits =
            raw.replace(/\D/g, "");


        if (!digits) {
            return "";
        }


        return "https://wa.me/" + digits;

    }


    function configureWhatsApp(element, value) {

        const whatsappUrl =
            createWhatsAppUrl(value);


        if (!whatsappUrl) {

            element.style.display =
                "none";

            return;

        }


        /*
         * Remove comportamentos antigos
         * que podem mandar a página para #.
         */

        element.removeAttribute(
            "onclick"
        );


        /*
         * Define o destino correto.
         */

        element.setAttribute(
            "href",
            whatsappUrl
        );


        /*
         * Abre o WhatsApp em nova aba.
         */

        element.setAttribute(
            "target",
            "_blank"
        );


        element.setAttribute(
            "rel",
            "noopener noreferrer"
        );


        /*
         * Impede que o link original
         * faça scroll para o topo.
         */

        element.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                window.open(
                    whatsappUrl,
                    "_blank",
                    "noopener,noreferrer"
                );

            },
            false
        );

    }


    /* ========================================================
       CAMPOS DATA-V8
    ======================================================== */

    function fillFields(config) {

        const elements =
            document.querySelectorAll(
                "[data-v8]"
            );


        elements.forEach(
            function (element) {

                const path =
                    element.dataset.v8;


                const value =
                    getByPath(
                        config,
                        path
                    );


                const normalized =
                    normalizeValue(value);


                /*
                 * Se estiver vazio,
                 * oculta o elemento.
                 */

                if (!normalized) {

                    element.style.display =
                        "none";

                    return;

                }


                /*
                 * WHATSAPP
                 */

                if (
                    path ===
                    "contact.whatsapp"
                ) {

                    configureWhatsApp(
                        element,
                        normalized
                    );

                    return;

                }


                /*
                 * E-MAIL
                 */

                if (
                    path ===
                    "contact.email"
                ) {

                    if (
                        element.tagName ===
                        "A"
                    ) {

                        element.href =
                            "mailto:" +
                            normalized;

                    } else {

                        element.textContent =
                            normalized;

                    }

                    return;

                }


                /*
                 * TELEFONE
                 */

                if (
                    path ===
                    "contact.phone"
                ) {

                    if (
                        element.tagName ===
                        "A"
                    ) {

                        const phone =
                            normalized.replace(
                                /\D/g,
                                ""
                            );


                        element.href =
                            "tel:" +
                            phone;

                    } else {

                        element.textContent =
                            normalized;

                    }

                    return;

                }


                /*
                 * REDES SOCIAIS
                 */

                if (
                    path.indexOf(
                        "social."
                    ) === 0
                ) {

                    if (
                        element.tagName ===
                        "A"
                    ) {

                        element.href =
                            normalized;

                        element.target =
                            "_blank";

                        element.rel =
                            "noopener noreferrer";

                    } else {

                        element.textContent =
                            normalized;

                    }

                    return;

                }


                /*
                 * OUTROS CAMPOS
                 */

                if (
                    element.tagName ===
                    "A"
                ) {

                    element.href =
                        normalized;

                } else {

                    element.textContent =
                        normalized;

                }

            }
        );

    }


    /* ========================================================
       FORMULÁRIO
    ======================================================== */

    function wireForms(
        projectId,
        formspreeUrl
    ) {

        const forms =
            document.querySelectorAll(
                "[data-v8-form]"
            );


        if (!forms.length) {
            return;
        }


        forms.forEach(
            function (form) {


                /*
                 * Configura Formspree
                 */

                if (formspreeUrl) {

                    form.action =
                        formspreeUrl;

                }


                /*
                 * Evita instalar
                 * o listener duas vezes.
                 */

                if (
                    form.dataset.v8Wired ===
                    "true"
                ) {

                    return;

                }


                form.dataset.v8Wired =
                    "true";


                form.addEventListener(
                    "submit",
                    function () {


                        try {

                            const formData =
                                new FormData(
                                    form
                                );


                            const data =
                                Object.fromEntries(
                                    formData.entries()
                                );


                            const lead = {

                                name:
                                    data.name ||
                                    data.nome ||
                                    "",

                                email:
                                    data.email ||
                                    "",

                                message:
                                    data.message ||
                                    data.mensagem ||
                                    ""

                            };


                            /*
                             * Salva no painel.
                             *
                             * Não bloqueia
                             * o Formspree.
                             */

                            fetch(
                                API_URL +
                                "/api/public/leads/" +
                                encodeURIComponent(
                                    projectId
                                ),
                                {

                                    method:
                                        "POST",

                                    headers: {

                                        "Content-Type":
                                            "application/json"

                                    },

                                    body:
                                        JSON.stringify(
                                            lead
                                        ),

                                    keepalive:
                                        true

                                }
                            ).catch(
                                function () {}
                            );


                        } catch (error) {

                            console.warn(
                                "V8 Loader: não foi possível registrar o lead.",
                                error
                            );

                        }

                    },
                    false
                );

            }
        );

    }


    /* ========================================================
       EVENTO DE CLIQUE PARA TRACKING
    ======================================================== */

    function setupConversionTracking() {

        document.addEventListener(
            "click",
            function (event) {

                const element =
                    event.target.closest(
                        "[data-v8]"
                    );


                if (!element) {
                    return;
                }


                const type =
                    element.dataset.v8;


                /*
                 * Meta Pixel
                 */

                if (
                    window.fbq &&
                    type ===
                    "contact.whatsapp"
                ) {

                    try {

                        window.fbq(
                            "track",
                            "Contact"
                        );

                    } catch (error) {}

                }


                /*
                 * Google Analytics
                 */

                if (
                    window.gtag &&
                    type ===
                    "contact.whatsapp"
                ) {

                    try {

                        window.gtag(
                            "event",
                            "whatsapp_click",
                            {

                                event_category:
                                    "contact",

                                event_label:
                                    "WhatsApp"

                            }
                        );

                    } catch (error) {}

                }

            },
            false
        );

    }


    /* ========================================================
       CARREGAMENTO DA CONFIGURAÇÃO
    ======================================================== */

    function loadConfig() {

        const endpoint =
            API_URL +
            "/api/public/config/" +
            encodeURIComponent(
                PROJECT_ID
            );


        fetch(
            endpoint,
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
        )

        .then(
            function (response) {

                if (!response.ok) {

                    throw new Error(
                        "HTTP " +
                        response.status
                    );

                }

                return response.json();

            }
        )

        .then(
            function (config) {

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
                 * Campos dinâmicos
                 */

                fillFields(
                    config
                );


                /*
                 * Formulários
                 */

                wireForms(
                    PROJECT_ID,
                    config.formspree
                );


                /*
                 * Tracking de conversões
                 */

                setupConversionTracking();


                /*
                 * Evento interno
                 */

                document.dispatchEvent(
                    new CustomEvent(
                        "v8admin:ready",
                        {
                            detail: config
                        }
                    )
                );


                console.log(
                    "V8 Admin Universal: configuração carregada."
                );

            }
        )

        .catch(
            function (error) {

                console.warn(
                    "V8 Loader: não foi possível carregar a configuração.",
                    error
                );

            }
        );

    }


    /* ========================================================
       INICIALIZAÇÃO
    ======================================================== */

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
