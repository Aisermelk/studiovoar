```javascript
/* =========================================================
   STUDIO VOAR
   SCRIPT.JS
========================================================= */

"use strict";


/* =========================================================
   1. INICIALIZAÇÃO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    inicializarMenu();
    atualizarAno();
    inicializarNavegacaoSuave();
    inicializarContato();

});


/* =========================================================
   2. MENU MOBILE
========================================================= */

function inicializarMenu() {

    const menuToggle = document.getElementById("menuToggle");
    const navigation = document.querySelector(".main-navigation");

    if (!menuToggle || !navigation) {
        return;
    }


    menuToggle.addEventListener("click", () => {

        const aberto =
            navigation.classList.toggle("active");

        menuToggle.setAttribute(
            "aria-expanded",
            aberto.toString()
        );

        menuToggle.setAttribute(
            "aria-label",
            aberto
                ? "Fechar menu"
                : "Abrir menu"
        );

    });


    /* Fecha o menu ao clicar em um link */

    const links =
        navigation.querySelectorAll("a");

    links.forEach((link) => {

        link.addEventListener("click", () => {

            navigation.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Abrir menu"
            );

        });

    });


    /* Fecha o menu ao clicar fora */

    document.addEventListener("click", (event) => {

        const clicouNoMenu =
            navigation.contains(event.target);

        const clicouNoBotao =
            menuToggle.contains(event.target);

        if (
            !clicouNoMenu &&
            !clicouNoBotao &&
            navigation.classList.contains("active")
        ) {

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

    });


    /* Fecha o menu ao pressionar ESC */

    document.addEventListener("keydown", (event) => {

        if (
            event.key === "Escape" &&
            navigation.classList.contains("active")
        ) {

            navigation.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Abrir menu"
            );

            menuToggle.focus();

        }

    });

}


/* =========================================================
   3. ANO AUTOMÁTICO DO RODAPÉ
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
   4. NAVEGAÇÃO SUAVE
========================================================= */

function inicializarNavegacaoSuave() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );

    links.forEach((link) => {

        link.addEventListener("click", (event) => {

            const destino =
                link.getAttribute("href");

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
                document.querySelector(".site-header");

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
   5. BOTÃO DE CONTATO
========================================================= */

function inicializarContato() {

    const contactButton =
        document.getElementById("contactButton");

    if (!contactButton) {
        return;
    }


    contactButton.addEventListener("click", (event) => {

        event.preventDefault();

        const telefone =
            "55549926746196";

        const mensagem =
            encodeURIComponent(
                "Olá! Vim pelo site do Studio Voar e gostaria de saber mais sobre os serviços."
            );

        const whatsappURL =
            `https://wa.me/${telefone}?text=${mensagem}`;

        window.open(
            whatsappURL,
            "_blank",
            "noopener,noreferrer"
        );

    });

}


/* =========================================================
   6. FECHAR MENU AO REDIMENSIONAR
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
   FIM
========================================================= */
```
