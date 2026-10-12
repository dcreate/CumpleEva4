
document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // ELEMENTOS DEL HTML
    // ==========================================
    const portada = document.getElementById("portada");
    const botonAbrir = document.getElementById("abrirInvitacion");
    const invitacion = document.getElementById("invitacion");
    const luces = document.getElementById("luces-flotantes");
    const musica = document.getElementById("musicaFondo");
    const botonMusica = document.getElementById("botonMusica");

    // ==========================================
    // CONFIGURACIÓN
    // ==========================================
    const coloresLuces = [
        "#fff5a8", // Amarillo cálido
        "#ffffff", // Blanco
        "#ffd8f1", // Rosa
        "#c7fff5", // Aqua
        "#e7c9ff", // Lila
        "#ffe3b8"  // Dorado suave
    ];

    let lucesActivas = false;
    let intervaloLuces = null;
    let observadorTamanio = null;

    // ==========================================
    // APERTURA DE LA INVITACIÓN
    // ==========================================
    if (botonAbrir) {
        botonAbrir.addEventListener("click", async () => {
            if (portada && portada.classList.contains("abriendo")) {
                return;
            }

            // Iniciar animación de apertura
            if (portada) {
                portada.classList.add("abriendo");
            }

            // Intentar reproducir la música
            if (musica) {
                musica.volume = 0.5;

                try {
                    await musica.play();
                    actualizarBotonMusica();
                } catch (error) {
                    console.warn(
                        "No se pudo reproducir la música automáticamente.",
                        error
                    );
                }
            }

            // Mostrar el botón de música
            if (botonMusica) {
                botonMusica.hidden = false;
                botonMusica.style.display = "inline-flex";
            }

            // Retirar la portada después de abrir las cortinas
            window.setTimeout(() => {
                if (portada) {
                    portada.classList.add("oculta");
                    portada.style.display = "none";
                }

                // Actualizar el tamaño de las luces
                actualizarAlturaLuces();

                // Iniciar las luces si todavía no están activas
                iniciarLuces();
            }, 1900);
        });
    }

    // ==========================================
    // BOTÓN DE MÚSICA
    // ==========================================
    function actualizarBotonMusica() {
        if (!botonMusica || !musica) return;

        if (musica.paused) {
            botonMusica.textContent = "🔇";
            botonMusica.setAttribute("aria-label", "♫");
        } else {
            botonMusica.textContent = "🎵";
            botonMusica.setAttribute("aria-label", "♫");
        }
    }

    if (botonMusica && musica) {
        botonMusica.addEventListener("click", async () => {
            if (musica.paused) {
                try {
                    await musica.play();
                } catch (error) {
                    console.warn("No se pudo reproducir la música.", error);
                }
            } else {
                musica.pause();
            }

            actualizarBotonMusica();
        });

        musica.addEventListener("play", actualizarBotonMusica);
        musica.addEventListener("pause", actualizarBotonMusica);

        actualizarBotonMusica();
    }

    // ==========================================
    // AJUSTAR ALTURA DEL CONTENEDOR DE LUCES
    // ==========================================
    function actualizarAlturaLuces() {
        if (!invitacion || !luces) return;

        const altura = Math.max(
            invitacion.scrollHeight,
            invitacion.offsetHeight,
            window.innerHeight
        );

        luces.style.height = `${altura}px`;
        luces.style.minHeight = `${altura}px`;
    }

    // ==========================================
    // CREAR UNA LUCIÉRNAGA
    // ==========================================
    function crearLuz() {
        if (!invitacion || !luces) return;

        actualizarAlturaLuces();

        const altura = luces.clientHeight;

        if (!altura || altura < 1) return;

        const luz = document.createElement("span");
        luz.className = "luz-magica";
        luz.setAttribute("aria-hidden", "true");

        const tamano = Math.random() * 5 + 3;
        const duracion = Math.random() * 7 + 8;
        const color =
            coloresLuces[
                Math.floor(Math.random() * coloresLuces.length)
            ];

        // Posición horizontal aleatoria
        luz.style.left = `${Math.random() * 100}%`;

        // Comenzar desde la parte inferior de la invitación
        luz.style.top = `${altura - 5}px`;

        // Tamaño, color y duración
        luz.style.setProperty("--tamano", `${tamano}px`);
        luz.style.setProperty("--color-luz", color);
        luz.style.setProperty("--duracion", `${duracion}s`);
        luz.style.setProperty("--titileo", `${Math.random() + 1}s`);

        // Distancias negativas para subir por toda la página
        luz.style.setProperty("--viaje-35", `${-(altura * 0.35)}px`);
        luz.style.setProperty("--viaje-70", `${-(altura * 0.70)}px`);
        luz.style.setProperty("--viaje-total", `${-(altura + 30)}px`);

        // Movimiento lateral suave
        luz.style.setProperty(
            "--deriva-1",
            `${Math.random() * 100 - 50}px`
        );

        luz.style.setProperty(
            "--deriva-2",
            `${Math.random() * 140 - 70}px`
        );

        luz.style.setProperty(
            "--deriva-3",
            `${Math.random() * 180 - 90}px`
        );

        luces.appendChild(luz);

        // Eliminar la luz cuando termine su recorrido
        luz.addEventListener("animationend", (evento) => {
            if (evento.animationName === "subirLuz") {
                luz.remove();
            }
        });
    }

    // ==========================================
    // INICIAR EL EFECTO DE LUCIÉRNAGAS
    // ==========================================
    function iniciarLuces() {
        if (!luces || lucesActivas) return;

        lucesActivas = true;
        actualizarAlturaLuces();

        // Crear luces iniciales para que el efecto comience enseguida
        for (let i = 0; i < 25; i++) {
            crearLuz();

            const luz = luces.lastElementChild;

            if (luz) {
                // Distribuir las luces en diferentes momentos
                const retraso = -(Math.random() * 8);
                luz.style.animationDelay = `${retraso}s, 0s`;
            }
        }

        // Generar nuevas luciérnagas continuamente
        intervaloLuces = window.setInterval(() => {
            actualizarAlturaLuces();

            // Mantener un máximo de 35 luces simultáneas
            if (luces.childElementCount < 35) {
                crearLuz();
            }
        }, 500);
    }

    // ==========================================
    // ACTUALIZAR LAS LUCES SI CAMBIA EL TAMAÑO
    // ==========================================
    window.addEventListener("resize", actualizarAlturaLuces);

    window.addEventListener("load", () => {
        actualizarAlturaLuces();
    });

    // Detectar cambios de tamaño del contenido
    if ("ResizeObserver" in window && invitacion) {
        observadorTamanio = new ResizeObserver(() => {
            actualizarAlturaLuces();
        });

        observadorTamanio.observe(invitacion);
    }

    // ==========================================
    // INICIALIZACIÓN
    // ==========================================
    actualizarAlturaLuces();

    // Si la invitación ya está visible, iniciar las luces
    if (
        invitacion &&
        getComputedStyle(invitacion).display !== "none" &&
        (!portada || getComputedStyle(portada).display === "none")
    ) {
        iniciarLuces();
    }
});
