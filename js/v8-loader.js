/**
 * =========================================================
 * V8 ADMIN — UNIVERSAL
 * Loader de integração
 * =========================================================
 *
 * Integra automaticamente o site ao V8 Admin Universal.
 *
 * Exemplo:
 *
 * <script
 *     src="js/v8-loader.js"
 *     data-project-id="SEU_PROJECT_ID">
 * </script>
 *
 * Também aceita:
 *
 * data-api-url="https://seu-worker.workers.dev"
 *
 * =========================================================
 */

(function () {

    "use strict";


    /* =====================================================
       CONFIGURAÇÃO
    ===================================================== */

    const scriptTag = document.currentScript;

    const PROJECT_ID =
        scriptTag &&
        scriptTag.dataset.projectId;

    const API_URL =
        (scriptTag && scriptTag.dataset.apiUrl) ||
        "https://v8adminuniversal.aisermelk.workers.dev";


    if (!PROJECT_ID) {

        console.warn(
            "V8 Loader: data-project-id não foi definido."
        );

        return;

    }


    /* =====================================================
       UTILITÁRIOS
    ===================================================== */

    function getByPath(object, path) {

        return path
            .split(".")
            .reduce(
                (current, key) =>
                    current != null
                        ? current[key]
                        : undefined,
                object
            );

    }


    function normalizeWhatsApp(value) {

        if (!value) {
            return "";
        }

        return String(value)
            .replace(/\D/g, "");

    }


    function createWhatsAppUrl(number, message) {

        const digits =
            normalizeWhatsApp(number);

        if (!digits) {
            return "";
        }

        let url =
            "https://wa.me/" + digits;

        if (message) {

            url +=
                "?text=" +
                encodeURIComponent(message);

        }

        return url;

    }


    function injectScript(src, attrs) {

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
    ===================================================== */

    function injectTracking(tracking) {

        if (!tracking) {
            return;
        }


        /* -----------------------------------------------
           META PIXEL
        ------------------------------------------------ */

        if (tracking.pixel) {

            if (!window.fbq) {

                (function (
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

                        if (n.callMethod) {

                            n.callMethod.apply(
                                n,
                                arguments
                            );

                        } else {

                            n.queue.push(
                                arguments
                            );

                        }

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

                    t.src =
                        v;


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


            window.fbq(
                "init",
                tracking.pixel
            );


            window.fbq(
                "track",
                "PageView"
            );

        }


        /* -----------------------------------------------
           GOOGLE ANALYTICS
        ------------------------------------------------ */

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
                "https://www.googletagmanager.com/gtag/js?id=" +
                encodeURIComponent(
                    tracking.analytics
                )
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


        /* -----------------------------------------------
           GOOGLE TAG MANAGER
        ------------------------------------------------ */

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


                const tagScript =
                    d.createElement(s);


                tagScript.async =
                    true;


                tagScript.src =
                    "https://www.googletagmanager.com/gtm.js?id=" +
                    encodeURIComponent(i);


                firstScript.parentNode.insertBefore(
                    tagScript,
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
       WHATSAPP
    ===================================================== */

    function setupWhatsApp(config) {

        const whatsapp =
            getByPath(
                config,
                "contact.whatsapp"
            );


        const message =
            getByPath(
                config,
                "contact.whatsappMessage"
            ) ||
            getByPath(
                config,
                "whatsappMessage"
            ) ||
            "";


        const whatsappUrl =
            createWhatsAppUrl(
                whatsapp,
                message
            );


        const elements =
            document.querySelectorAll(
                '[data-v8="contact.whatsapp"]'
            );


        elements.forEach(function (element) {

            if (!whatsappUrl) {

                element.hidden = true;

                element.style.display =
                    "none";

                return;

            }


            /*
             * Atualiza o href.
             */

            element.href =
                whatsappUrl;


            /*
             * Garante que o botão
             * não volte para o topo.
             */

            element.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();


                    /*
                     * Abre WhatsApp em nova aba.
                     */

                    window.open(
                        whatsappUrl,
                        "_blank",
                        "noopener,noreferrer"
                    );

                }
            );

        });

    }


    /* =====================================================
       PREENCHIMENTO DOS CAMPOS
    ===================================================== */

    function fillFields(config) {

        document
            .querySelectorAll("[data-v8]")
            .forEach(function (element) {

                const path =
                    element.dataset.v8;


                /*
                 * WhatsApp é tratado
                 * separadamente.
                 */

                if (
                    path ===
                    "contact.whatsapp"
                ) {

                    return;

                }


                const value =
                    getByPath(
                        config,
                        path
                    );


                /*
                 * Campo vazio:
                 * remove da interface.
                 */

                if (
                    value === undefined ||
                    value === null ||
                    String(value).trim() === ""
                ) {

                    element.hidden =
                        true;

                    element.style.display =
                        "none";

                    return;

                }


                /*
                 * Links.
                 */

                if (
                    element.tagName ===
                    "A"
                ) {

                    if (
                        path ===
                        "contact.email"
                    ) {

                        element.href =
                            "mailto:" +
                            value;

                    }

                    else if (
                        path ===
                        "contact.phone"
                    ) {

                        element.href =
                            "tel:" +
                            String(value)
                                .replace(
                                    /\D/g,
                                    ""
                                );

                    }

                    else {

                        element.href =
                            value;

                    }

                }

                /*
                 * Outros elementos.
                 */

                else {

                    element.textContent =
                        value;

                }

            });

    }


    /* =====================================================
       FORMULÁRIO
    ===================================================== */

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

        }


        /*
         * Captura o lead para o
         * V8 Admin Universal.
         */

        form.addEventListener(
            "submit",
            function () {

                try {

                    const formData =
                        new FormData(form);


                    const data =
                        Object.fromEntries(
                            formData.entries()
                        );


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
                                JSON.stringify({

                                    name:
                                        data.name ||
                                        data.nome ||
                                        "",

                                    email:
                                        data.email ||
                                        "",

                                    phone:
                                        data.phone ||
                                        data.telefone ||
                                        "",

                                    message:
                                        data.message ||
                                        data.mensagem ||
                                        ""

                                })

                        }
                    ).catch(
                        function () {}
                    );

                }

                catch (error) {

                    console.warn(
                        "V8 Loader: erro ao registrar lead.",
                        error
                    );

                }

            }
        );

    }


    /* =====================================================
       CARREGAR CONFIGURAÇÃO
    ===================================================== */

    async function loadConfig() {

        try {

            const response =
                await fetch(
                    API_URL +
                    "/api/public/config/" +
                    encodeURIComponent(
                        PROJECT_ID
                    ),
                    {
                        method: "GET",
                        cache: "no-store"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "HTTP " +
                    response.status
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
             * Campos dinâmicos
             */

            fillFields(
                config
            );


            /*
             * WhatsApp
             */

            setupWhatsApp(
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
             * Evento global.
             * Útil para scripts adicionais.
             */

            window.dispatchEvent(
                new CustomEvent(
                    "v8admin:ready",
                    {
                        detail: config
                    }
                )
            );


        }

        catch (error) {

            console.warn(
                "V8 Loader: não foi possível carregar a configuração.",
                error
            );

        }

    }


    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            loadConfig
        );

    }

    else {

        loadConfig();

    }


})();
```
