/* ============================================================
   SCRIPT PRINCIPAL DO SITE
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {


    /* ============================================================
       LINKS DE PROPOSTA
       ============================================================ */

    const LINK_PROPOSTA =
        "https://docs.google.com/forms/d/e/SUA_URL_DE_PROPOSTA/viewform";


    document.querySelectorAll('.link-proposta').forEach(function (link) {

        link.href = LINK_PROPOSTA;

        link.target = "_blank";

        link.rel = "noopener noreferrer";

    });


    /* ============================================================
       LINKS DE CONVITE
       ============================================================ */

    const LINK_CONVITE =
        "https://docs.google.com/forms/d/e/SUA_URL_DE_CONVITE/viewform";


    document.querySelectorAll('.link-convite').forEach(function (link) {

        link.href = LINK_CONVITE;

        link.target = "_blank";

        link.rel = "noopener noreferrer";

    });


    /* ============================================================
       MENU MOBILE
       ============================================================ */

    const mobileToggle =
        document.querySelector('.mobile-toggle');

    const mainNav =
        document.querySelector('.main-nav');

    const navLinks =
        document.querySelectorAll('.nav-link');


    if (mobileToggle && mainNav) {

        mobileToggle.addEventListener('click', function () {

            const isOpen =
                mainNav.classList.toggle('active');


            mobileToggle.setAttribute(
                'aria-expanded',
                isOpen
            );


            const icon =
                mobileToggle.querySelector('i');


            if (icon) {

                icon.classList.toggle(
                    'fa-bars',
                    !isOpen
                );

                icon.classList.toggle(
                    'fa-times',
                    isOpen
                );

            }

        });


        navLinks.forEach(function (link) {

            link.addEventListener('click', function () {

                mainNav.classList.remove('active');

                mobileToggle.setAttribute(
                    'aria-expanded',
                    'false'
                );


                const icon =
                    mobileToggle.querySelector('i');


                if (icon) {

                    icon.classList.remove('fa-times');

                    icon.classList.add('fa-bars');

                }

            });

        });

    }


    /* ============================================================
       ROLAGEM SUAVE
       ============================================================ */

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener('click', function (event) {

            const targetId =
                this.getAttribute('href');


            if (
                targetId === '#' ||
                !targetId
            ) {

                return;

            }


            const target =
                document.querySelector(targetId);


            if (target) {

                event.preventDefault();


                target.scrollIntoView({

                    behavior: 'smooth',

                    block: 'start'

                });

            }

        });

    });


    /* ============================================================
       ANO AUTOMÁTICO DO RODAPÉ
       ============================================================ */

    const year =
        document.getElementById('current-year');


    if (year) {

        year.textContent =
            new Date().getFullYear();

    }

});