```javascript
/* =========================================================
   STUDIO VOAR
   SCRIPT.JS V2
   Menu • Navegação • WhatsApp • Ano automático
========================================================= */

"use strict";


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    inicializarMenu();
    atualizarAno();
    inicializarNavegacao();
    inicializarContato();

});


/* =========================================================
   MENU MOBILE
========================================================= */

function inicializarMenu() {

    const menuToggle =
        document.getElementById("menuToggle");

    const navigation =
        document.querySelector(".main-navigation");

    if (!menuToggle || !navigation) {
        return;
    }


    /* Abrir / fechar */

    menuToggle.addEventListener("click", (event) => {

        event.stopPropagation();

        const menuAberto =
            navigation.classList.toggle("active");

        menuToggle.setAttribute(
            "aria-expanded",
            String(menuAberto)
        );

        menuToggle.setAttribute(
            "aria-label",
            menuAberto
                ? "Fechar menu"
                : "Abrir menu"
        );

    });


    /* Fechar ao clicar em um link */

    const links =
        navigation.querySelectorAll("a");

    links.forEach((link) => {

        link.addEventListener("click", () => {

            fecharMenu();

        });

    });


    /* Fechar ao clicar fora */

    document.addEventListener("click", (event) => {

        if (
            !navigation.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {

            fecharMenu();

        }

    });


    /* Fechar com ESC */

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            fecharMenu();

        }

    });


    /* Função interna */

    function fecharMenu() {

        navigation.classList.remove("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Abrir menu"
        );

    }

}


/* =========================================================
   ANO AUTOMÁTICO
========================================================= */

function atualizarAno() {

    const currentYear =
        document.getElementById("currentYear");

    if (!currentYear) {
        return;
    }

    currentYear.textContent =
        new Date().getFullYear();

}


/* =========================================================
   NAVEGAÇÃO SUAVE
========================================================= */

function inicializarNavegacao() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );

    links.forEach((link) => {

        link.addEventListener("click", (event) => {

            const destino =
                link.getAttribute("href");

            /*
             * Ignora links vazios.
             */
            if (
                !destino ||
                destino === "#"
            ) {
                return;
            }


            const elemento =
                document.querySelector(destino);

            if (!elemento) {
                return;
            }


            event.preventDefault();


            const header =
                document.querySelector(
                    ".site-header"
                );


            const alturaHeader =
                header
                    ? header.offsetHeight
                    : 0;


            const posicao =
                elemento.getBoundingClientRect().top +
                window.scrollY -
                alturaHeader;


            window.scrollTo({

                top: posicao,

                behavior: "smooth"

            });

        });

    });

}


/* =========================================================
   CONTATO / WHATSAPP
========================================================= */

function inicializarContato() {

    const contactButton =
        document.getElementById(
            "contactButton"
        );

    if (!contactButton) {
        return;
    }


    contactButton.addEventListener(
        "click",
        (event) => {

            event.preventDefault();


            /*
             * Número do WhatsApp.
             * Formato internacional:
             * Brasil = 55
             */
            const telefone =
                "55549926746196";


            const mensagem =
                "Olá! Vim pelo site do Studio Voar e gostaria de saber mais sobre os serviços.";


            const mensagemCodificada =
                encodeURIComponent(mensagem);


            const whatsappURL =
                `https://wa.me/${telefone}?text=${mensagemCodificada}`;


            window.open(
                whatsappURL,
                "_blank",
                "noopener,noreferrer"
            );

        }
    );

}


/* =========================================================
   FECHAR MENU AO REDIMENSIONAR
========================================================= */

window.addEventListener("resize", () => {

    if (window.innerWidth > 700) {

        const navigation =
            document.querySelector(
                ".main-navigation"
            );

        const menuToggle =
            document.getElementById(
                "menuToggle"
            );


        if (navigation) {

            navigation.classList.remove(
                "active"
            );

        }


        if (menuToggle) {

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Abrir menu"
            );

        }

    }

});


/* =========================================================
   PROTEÇÃO CONTRA ERROS DE IMAGEM
========================================================= */

document.addEventListener(
    "error",
    (event) => {

        const elemento =
            event.target;

        if (
            elemento &&
            elemento.tagName === "IMG"
        ) {

            elemento.classList.add(
                "image-error"
            );

        }

    },
    true
);


/* =========================================================
   FIM — STUDIO VOAR V2
========================================================= */
```
