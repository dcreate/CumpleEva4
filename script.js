document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // ELEMENTOS
    // =====================================

    const portada = document.getElementById("portada");
    const botonAbrir = document.getElementById("abrirInvitacion");

    const invitacion = document.getElementById("invitacion");

    const botonMusica = document.getElementById("botonMusica");
    const musica = document.getElementById("musicaFondo");

    const lucesContenedor = document.getElementById("luces-flotantes");

    let invitacionAbierta = false;
    let lucesCreadas = false;


    // =====================================
    // INICIALIZACIÓN
    // =====================================

    invitacion.classList.remove("visible");
    invitacion.style.display = "none";

    botonMusica.hidden = true;

    document.body.style.overflowY = "hidden";


    // =====================================
    // ABRIR INVITACIÓN
    // =====================================

    botonAbrir.addEventListener("click", async () => {

        if (invitacionAbierta) {
            return;
        }

        invitacionAbierta = true;

        botonAbrir.disabled = true;
        botonAbrir.textContent = "¡A disfrutar! 🌺";

        // Inicia la apertura de las cortinas.
        portada.classList.add("abriendo");

        // Prepara la invitación mientras las cortinas se abren.
        window.setTimeout(() => {

            invitacion.style.display = "block";

            requestAnimationFrame(() => {
                invitacion.classList.add("visible");
            });

            crearLuces();

            botonMusica.hidden = false;

        }, 650);


        // Oculta la portada al terminar la animación.
        window.setTimeout(() => {

            portada.classList.add("oculta");
            portada.setAttribute("aria-hidden", "true");

            document.body.style.overflowY = "auto";

        }, 1900);


        // Actualiza la cuenta regresiva.
        actualizarCuentaRegresiva();


        // Intenta reproducir la música.
        try {

            await musica.play();
            actualizarBotonMusica(true);

        } catch (error) {

            actualizarBotonMusica(false);

            console.info(
                "La música no se pudo iniciar automáticamente. " +
                "Puedes activarla con el botón musical."
            );

        }

    });


    // =====================================
    // CUENTA REGRESIVA
    // =====================================

    /*
      Fecha del evento:
      17 de diciembre de 2026
      10:30 de la mañana

      Se utiliza la hora local del dispositivo.
      En México, Puebla y Veracruz comparten
      actualmente la zona horaria Centro.
    */

    const fechaEvento = new Date(
        "2026-12-17T10:30:00-06:00"
    ).getTime();


    const elementoDias = document.getElementById("dias");
    const elementoHoras = document.getElementById("horas");
    const elementoMinutos = document.getElementById("minutos");
    const elementoSegundos = document.getElementById("segundos");

    const mensajeCuenta = document.getElementById("mensajeCuenta");


    function actualizarCuentaRegresiva() {

        const ahora = Date.now();
        const diferencia = fechaEvento - ahora;

        if (diferencia <= 0) {

            elementoDias.textContent = "000";
            elementoHoras.textContent = "00";
            elementoMinutos.textContent = "00";
            elementoSegundos.textContent = "00";

            if (diferencia > -24 * 60 * 60 * 1000) {

                mensajeCuenta.textContent =
                    "¡Hoy es el gran día! ¡Feliz cumpleaños, Eva Lucía! 🎂";

            } else {

                mensajeCuenta.textContent =
                    "¡Gracias por celebrar los 4 añitos de Eva Lucía! 💗";

            }

            return;

        }

        const segundosTotales = Math.floor(diferencia / 1000);

        const dias = Math.floor(
            segundosTotales / (60 * 60 * 24)
        );

        const horas = Math.floor(
            (segundosTotales % (60 * 60 * 24)) / (60 * 60)
        );

        const minutos = Math.floor(
            (segundosTotales % (60 * 60)) / 60
        );

        const segundos = segundosTotales % 60;


        elementoDias.textContent = String(dias).padStart(3, "0");
        elementoHoras.textContent = String(horas).padStart(2, "0");
        elementoMinutos.textContent = String(minutos).padStart(2, "0");
        elementoSegundos.textContent = String(segundos).padStart(2, "0");

        mensajeCuenta.textContent =
            "¡Cada vez falta menos para la aventura! 🌺";

    }


    // Actualiza cada segundo.
    actualizarCuentaRegresiva();

    window.setInterval(actualizarCuentaRegresiva, 1000);


    // =====================================
    // CONTROL DE MÚSICA
    // =====================================

    function actualizarBotonMusica(reproduciendo) {

        botonMusica.classList.toggle(
            "reproduciendo",
            reproduciendo
        );

        botonMusica.setAttribute(
            "aria-pressed",
            String(reproduciendo)
        );

        botonMusica.setAttribute(
            "aria-label",
            reproduciendo ? "Pausar música" : "Activar música"
        );

    }


    botonMusica.addEventListener("click", async () => {

        if (musica.paused) {

            try {

                await musica.play();
                actualizarBotonMusica(true);

            } catch (error) {

                actualizarBotonMusica(false);

                console.warn(
                    "No se pudo reproducir la música. " +
                    "Verifica el archivo musica.mp3."
                );

            }

        } else {

            musica.pause();
            actualizarBotonMusica(false);

        }

    });


    musica.addEventListener("play", () => {
        actualizarBotonMusica(true);
    });

    musica.addEventListener("pause", () => {
        actualizarBotonMusica(false);
    });


    // =====================================
    // LUCES FLOTANTES
    // =====================================

    function crearLuces() {

        if (lucesCreadas) {
            return;
        }

        lucesCreadas = true;

        const cantidadLuces = 35;

        const colores = [
            "#ffffff",
            "#fff1a8",
            "#ffd5ef",
            "#d7f9ff",
            "#f7c5ff"
        ];

        for (let i = 0; i < cantidadLuces; i++) {

            const luz = document.createElement("span");

            luz.className = "luz-flotante";

            const posicion = Math.random() * 100;
            const tamano = 4 + Math.random() * 7;
            const duracion = 7 + Math.random() * 10;
            const retraso = Math.random() * 12;

            const color =
                colores[Math.floor(Math.random() * colores.length)];

            luz.style.left = `${posicion}%`;

            luz.style.width = `${tamano}px`;
            luz.style.height = `${tamano}px`;

            luz.style.background = color;

            luz.style.boxShadow =
                `0 0 12px 3px ${color}99`;

            luz.style.animationDuration = `${duracion}s`;
            luz.style.animationDelay = `${retraso}s`;

            lucesContenedor.appendChild(luz);

        }

    }


    // =====================================
    // SINCRONIZAR EL ESTADO INICIAL
    // =====================================

    actualizarBotonMusica(false);

});