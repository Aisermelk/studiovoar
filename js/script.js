/* =========================================================
   STUDIO VOAR
   JavaScript principal
   V8 Digital
   ========================================================= */

(() => {
    "use strict";

    /* =========================================================
       CONFIGURAÇÃO
    ========================================================= */

    const CONFIG = window.SITE_CONFIG || {};

    const API_URL = String(CONFIG.v8ApiUrl || "").trim();
    const PROJECT_ID = String(
        CONFIG.projectId || "studio-voar"
    ).trim();


    /* =========================================================
       ELEMENTOS
    ========================================================= */

    const elements = {
        menuToggle: document.getElementById("menuToggle"),
        navigation: document.querySelector(".main-navigation"),
        currentYear: document.getElementById("currentYear"),

        contactButton: document.getElementById("contactButton"),

        whatsappButtons: document.querySelectorAll(
            "[data-whatsapp]"
        ),

        configElements: document.querySelectorAll(
            "[data-config]"
        ),

        contactForm: document.getElementById("contactForm"),
        formStatus: document.getElementById("formStatus"),

        revealElements: document.querySelectorAll(
            ".reveal"
        )
    };


    /* =========================================================
       UTILIDADES
    ========================================================= */

    function exists(element) {
        return element !== null && element !== undefined;
    }


    function normalizeText(value) {
        if (value === null || value === undefined) {
            return "";
        }

        return String(value).trim();
    }


    /* =========================================================
       CONFIGURAÇÃO PADRÃO
    ========================================================= */

    const DEFAULT_CONFIG = {
        projectId: PROJECT_ID,

        siteName: "Studio Voar",

        logo: "",
        favicon: "",

        heroTitle:
            "Transformando disciplina em conquistas.",

        heroSubtitle:
            "Ginástica Artística & Tecido Acrobático",

        heroDescription:
            "Um espaço para desenvolver habilidades, confiança e amor pelo movimento.",

        whatsapp: "",

        instagram:
            "https://www.instagram.com/studiovoar0127/",

        facebook: "",
        tiktok: "",
        linkedin: "",

        address: "",
        schedule: "",

        formspreeEndpoint: "",

        analytics: {
            googleAnalytics: "",
            googleTagManager: "",
            metaPixel: ""
        },

        customScripts: []
    };


    /* =========================================================
       MESCLAR CONFIGURAÇÕES
    ========================================================= */

    function mergeConfig(base, incoming) {
        const result = {
            ...base,
            ...incoming
        };

        result.analytics = {
            ...base.analytics,
            ...(incoming.analytics || {})
        };

        return result;
    }


    /* =========================================================
       TIMEOUT
    ========================================================= */

    async function fetchWithTimeout(url, options = {}, timeout = 5000) {
        const controller = new AbortController();

        const timer = setTimeout(() => {
            controller.abort();
        }, timeout);

        try {
            return await fetch(url, {
                ...options,
                signal: controller.signal
            });
        } finally {
            clearTimeout(timer);
        }
    }


    /* =========================================================
       CARREGAR CONFIGURAÇÃO DA API
    ========================================================= */

    async function loadRemoteConfig() {
        if (!API_URL) {
            return null;
        }

        const separator = API_URL.endsWith("/")
            ? ""
            : "/";

        const url =
            `${API_URL}${separator}api/config?project=${encodeURIComponent(PROJECT_ID)}`;

        try {
            const response = await fetchWithTimeout(
                url,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json"
                    }
                },
                5000
            );

            if (!response.ok) {
                throw new Error(
                    `API respondeu com status ${response.status}`
                );
            }

            const data = await response.json();

            if (!data || typeof data !== "object") {
                throw new Error(
                    "Configuração da API inválida."
                );
            }

            /*
             * Algumas APIs podem devolver os dados diretamente,
             * enquanto outras podem utilizar "config".
             */
            return data.config && typeof data.config === "object"
                ? data.config
                : data;

        } catch (error) {
            console.warn(
                "Studio Voar: API indisponível. Utilizando configuração local.",
                error
            );

            return null;
        }
    }


    /* =========================================================
       CARREGAR CONFIGURAÇÃO
    ========================================================= */

    async function loadSiteConfig() {
        const localConfig = mergeConfig(
            DEFAULT_CONFIG,
            CONFIG
        );

        const remoteConfig = await loadRemoteConfig();

        if (remoteConfig) {
            return mergeConfig(
                localConfig,
                remoteConfig
            );
        }

        return localConfig;
    }


    /* =========================================================
       WHATSAPP
    ========================================================= */

    function getWhatsAppLink(
        phone,
        message = "Olá! Gostaria de saber mais sobre o Studio Voar."
    ) {
        const cleanPhone = normalizeText(phone)
            .replace(/\D/g, "");

        /*
         * Não cria link quando não existe telefone.
         */
        if (!cleanPhone) {
            return "";
        }

        /*
         * Validação mínima.
         * Evita gerar links claramente inválidos.
         */
        if (cleanPhone.length < 10) {
            return "";
        }

        const encodedMessage =
            encodeURIComponent(message);

        return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    }


    /* =========================================================
       CONFIGURAÇÕES NOS ELEMENTOS
       Exemplo:

       <span data-config="siteName"></span>
    ========================================================= */

    function getNestedValue(object, path) {
        return path
            .split(".")
            .reduce((current, key) => {
                if (
                    current === null ||
                    current === undefined
                ) {
                    return undefined;
                }

                return current[key];
            }, object);
    }


    function renderConfig(config) {
        elements.configElements.forEach(element => {
            const key = element.dataset.config;

            if (!key) {
                return;
            }

            const value = getNestedValue(
                config,
                key
            );

            if (
                value === null ||
                value === undefined
            ) {
                return;
            }

            if (
                element.tagName === "INPUT" ||
                element.tagName === "TEXTAREA"
            ) {
                element.value = value;
            } else {
                element.textContent = value;
            }
        });
    }


    /* =========================================================
       LOGO
    ========================================================= */

    function renderLogo(config) {
        if (!config.logo) {
            return;
        }

        const logos = document.querySelectorAll(
            "[data-site-logo]"
        );

        logos.forEach(logo => {
            logo.src = config.logo;
        });
    }


    /* =========================================================
       LINKS DO WHATSAPP
    ========================================================= */

    function renderWhatsApp(config) {
        const link = getWhatsAppLink(
            config.whatsapp
        );

        elements.whatsappButtons.forEach(button => {
            if (!link) {
                button.hidden = true;
                return;
            }

            button.hidden = false;
            button.href = link;
            button.target = "_blank";
            button.rel = "noopener noreferrer";
        });

        if (
            exists(elements.contactButton)
        ) {
            if (!link) {
                elements.contactButton.hidden = true;
            } else {
                elements.contactButton.hidden = false;
                elements.contactButton.href = link;
                elements.contactButton.target = "_blank";
                elements.contactButton.rel =
                    "noopener noreferrer";
            }
        }
    }


    /* =========================================================
       INSTAGRAM
    ========================================================= */

    function renderInstagram(config) {
        const instagramLinks =
            document.querySelectorAll(
                "[data-instagram]"
            );

        instagramLinks.forEach(link => {
            const instagram =
                normalizeText(config.instagram);

            if (!instagram) {
                link.hidden = true;
                return;
            }

            link.hidden = false;
            link.href = instagram;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
        });
    }


    /* =========================================================
       CAMPOS OPCIONAIS
    ========================================================= */

    function renderOptionalFields(config) {
        const optionalElements =
            document.querySelectorAll(
                "[data-show-if-config]"
            );

        optionalElements.forEach(element => {
            const key =
                element.dataset.showIfConfig;

            if (!key) {
                return;
            }

            const value =
                getNestedValue(config, key);

            element.hidden =
                !normalizeText(value);
        });
    }


    /* =========================================================
       MENU MOBILE
    ========================================================= */

    function closeMobileMenu() {
        if (!exists(elements.navigation)) {
            return;
        }

        elements.navigation.classList.remove(
            "is-open"
        );

        if (exists(elements.menuToggle)) {
            elements.menuToggle.classList.remove(
                "is-active"
            );

            elements.menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            elements.menuToggle.setAttribute(
                "aria-label",
                "Abrir menu"
            );
        }
    }


    function toggleMobileMenu() {
        if (
            !exists(elements.navigation) ||
            !exists(elements.menuToggle)
        ) {
            return;
        }

        const isOpen =
            elements.navigation.classList.toggle(
                "is-open"
            );

        elements.menuToggle.classList.toggle(
            "is-active",
            isOpen
        );

        elements.menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        elements.menuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Fechar menu"
                : "Abrir menu"
        );
    }


    function initMenu() {
        if (
            !exists(elements.menuToggle) ||
            !exists(elements.navigation)
        ) {
            return;
        }

        elements.menuToggle.addEventListener(
            "click",
            toggleMobileMenu
        );

        const links =
            elements.navigation.querySelectorAll(
                "a"
            );

        links.forEach(link => {
            link.addEventListener(
                "click",
                closeMobileMenu
            );
        });

        document.addEventListener(
            "click",
            event => {
                if (
                    !elements.navigation.contains(
                        event.target
                    ) &&
                    !elements.menuToggle.contains(
                        event.target
                    )
                ) {
                    closeMobileMenu();
                }
            }
        );
    }


    /* =========================================================
       ANO DO FOOTER
    ========================================================= */

    function initCurrentYear() {
        if (!exists(elements.currentYear)) {
            return;
        }

        elements.currentYear.textContent =
            new Date().getFullYear();
    }


    /* =========================================================
       SCROLL SUAVE
    ========================================================= */

    function initSmoothScroll() {
        const links =
            document.querySelectorAll(
                'a[href^="#"]'
            );

        links.forEach(link => {
            link.addEventListener(
                "click",
                event => {
                    const targetId =
                        link.getAttribute("href");

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }

                    const target =
                        document.querySelector(
                            targetId
                        );

                    if (!target) {
                        return;
                    }

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            );
        });
    }


    /* =========================================================
       ANIMAÇÕES DE ENTRADA
    ========================================================= */

    function initReveal() {
        if (
            !elements.revealElements.length
        ) {
            return;
        }

        /*
         * Respeita usuários que preferem
         * menos movimento.
         */
        if (
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        ) {
            elements.revealElements.forEach(
                element => {
                    element.classList.add(
                        "is-visible"
                    );
                }
            );

            return;
        }

        if (
            !("IntersectionObserver" in window)
        ) {
            elements.revealElements.forEach(
                element => {
                    element.classList.add(
                        "is-visible"
                    );
                }
            );

            return;
        }

        const observer =
            new IntersectionObserver(
                entries => {
                    entries.forEach(entry => {
                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "is-visible"
                        );

                        observer.unobserve(
                            entry.target
                        );
                    });
                },
                {
                    threshold: 0.12
                }
            );

        elements.revealElements.forEach(
            element => {
                observer.observe(element);
            }
        );
    }


    /* =========================================================
       FORMSPREE
    ========================================================= */

    function initForm(config) {
        const form =
            elements.contactForm;

        if (!exists(form)) {
            return;
        }

        const endpoint =
            normalizeText(
                config.formspreeEndpoint
            );

        const status =
            elements.formStatus;

        const submitButton =
            form.querySelector(
                'button[type="submit"]'
            );

        if (!endpoint) {
            /*
             * Endpoint ainda não configurado.
             * O formulário permanece visualmente
             * disponível, mas não envia requisição inválida.
             */
            form.addEventListener(
                "submit",
                event => {
                    event.preventDefault();

                    if (exists(status)) {
                        status.textContent =
                            "O formulário ainda não está configurado. Entre em contato pelo WhatsApp.";
                    }
                }
            );

            return;
        }

        form.addEventListener(
            "submit",
            async event => {
                event.preventDefault();

                if (submitButton) {
                    submitButton.disabled = true;
                }

                if (status) {
                    status.textContent =
                        "Enviando mensagem...";
                }

                try {
                    const formData =
                        new FormData(form);

                    const response =
                        await fetch(
                            endpoint,
                            {
                                method: "POST",
                                body: formData,
                                headers: {
                                    Accept:
                                        "application/json"
                                }
                            }
                        );

                    if (!response.ok) {
                        throw new Error(
                            "Não foi possível enviar o formulário."
                        );
                    }

                    form.reset();

                    if (status) {
                        status.textContent =
                            "Mensagem enviada com sucesso!";
                    }

                } catch (error) {
                    console.error(
                        "Erro no formulário:",
                        error
                    );

                    if (status) {
                        status.textContent =
                            "Não foi possível enviar agora. Tente novamente ou fale conosco pelo WhatsApp.";
                    }

                } finally {
                    if (submitButton) {
                        submitButton.disabled = false;
                    }
                }
            }
        );
    }


    /* =========================================================
       INTEGRAÇÕES
    ========================================================= */

    function loadIntegrations(config) {
        const analytics =
            config.analytics || {};

        /*
         * Google Analytics
         */
        if (
            normalizeText(
                analytics.googleAnalytics
            )
        ) {
            loadGoogleAnalytics(
                analytics.googleAnalytics
            );
        }

        /*
         * Google Tag Manager
         */
        if (
            normalizeText(
                analytics.googleTagManager
            )
        ) {
            loadGoogleTagManager(
                analytics.googleTagManager
            );
        }

        /*
         * Meta Pixel
         */
        if (
            normalizeText(
                analytics.metaPixel
            )
        ) {
            loadMetaPixel(
                analytics.metaPixel
            );
        }
    }


    function loadGoogleAnalytics(measurementId) {
        if (
            document.querySelector(
                'script[data-analytics="ga"]'
            )
        ) {
            return;
        }

        const script =
            document.createElement("script");

        script.src =
            `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;

        script.async = true;
        script.dataset.analytics = "ga";

        document.head.appendChild(script);

        window.dataLayer =
            window.dataLayer || [];

        function gtag() {
            window.dataLayer.push(arguments);
        }

        window.gtag = gtag;

        gtag("js", new Date());
        gtag(
            "config",
            measurementId
        );
    }


    function loadGoogleTagManager(containerId) {
        if (
            document.querySelector(
                'script[data-analytics="gtm"]'
            )
        ) {
            return;
        }

        window.dataLayer =
            window.dataLayer || [];

        window.dataLayer.push({
            "gtm.start":
                new Date().getTime(),
            event: "gtm.js"
        });

        const script =
            document.createElement("script");

        script.async = true;

        script.src =
            `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(containerId)}`;

        script.dataset.analytics = "gtm";

        document.head.appendChild(script);
    }


    function loadMetaPixel(pixelId) {
        if (
            window.fbq ||
            document.querySelector(
                'script[data-analytics="meta"]'
            )
        ) {
            return;
        }

        /*
         * O carregamento do Pixel só acontece
         * quando um ID real estiver configurado.
         */
        const script =
            document.createElement("script");

        script.dataset.analytics = "meta";

        script.textContent = `
            !function(f,b,e,v,n,t,s)
            {
                if(f.fbq)return;
                n=f.fbq=function(){
                    n.callMethod ?
                    n.callMethod.apply(n,arguments) :
                    n.queue.push(arguments)
                };

                if(!f._fbq)f._fbq=n;

                n.push=n;
                n.loaded=!0;
                n.version='2.0';
                n.queue=[];

                t=b.createElement(e);
                t.async=!0;
                t.src=v;

                s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)
            }(
                window,
                document,
                'script',
                'https://connect.facebook.net/en_US/fbevents.js'
            );

            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
        `;

        document.head.appendChild(script);
    }


    /* =========================================================
       APLICAÇÃO DA CONFIGURAÇÃO
    ========================================================= */

    function renderSiteConfig(config) {
        renderConfig(config);
        renderLogo(config);
        renderWhatsApp(config);
        renderInstagram(config);
        renderOptionalFields(config);
    }


    /* =========================================================
       INICIALIZAÇÃO
    ========================================================= */

    async function init() {
        initCurrentYear();
        initMenu();
        initSmoothScroll();
        initReveal();

        /*
         * O site já possui HTML/CSS local.
         * A API é complementar e não bloqueia
         * a apresentação da página.
         */

        const config =
            await loadSiteConfig();

        renderSiteConfig(config);
        initForm(config);
        loadIntegrations(config);

        document.documentElement.classList.add(
            "site-ready"
        );
    }


    /* =========================================================
       INICIAR
    ========================================================= */

    if (
        document.readyState === "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            init
        );
    } else {
        init();
    }

})();