const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const btnLogin = document.getElementById("btnLogin");

const divMensajes = document.getElementById("divMensajes");
const divDatos = document.getElementById("divDatos");
const btnDatos = document.getElementById("btnDatos");

btnLogin.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();

    if (!email || !password) {
        divMensajes.textContent = "email y password son requeridos";
        setTimeout(() => {
            divMensajes.textContent = "";
        }, 3000);
        return;
    }

    try {
        const response = await fetch("/api/sessions/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.message || data.error || "Error de credenciales";
            divMensajes.textContent = "Error de credenciales: " + errorMessage;
            setTimeout(() => {
                divMensajes.textContent = "";
            }, 3000);
            return;
        }

       /*  const token = data.token || data.access_token; */
        const user = data.user || data.usuarioLogueado || {};
        const firstName = user.first_name || user.firstName || user.nombre || user.email || "usuario";

        /* if (token) {
            localStorage.setItem("token", token); *
        }*/

        divMensajes.textContent = `Login exitoso para ${firstName}`;
    } catch (error) {
        console.error("Error en petición login:", error);
        divMensajes.textContent = "Error en petición login";
    }
});

btnDatos.addEventListener("click", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
        divDatos.textContent = "No hay un token almacenado. Inicia sesión primero.";
        return;
    }

    try {
        const response = await fetch("/login", {
           /* headers: {
                Authorization: `Bearer ${token}`
            }*/
           method: "GET",
        });

        if (!response.ok) {
            divDatos.textContent = "Acceso no autorizado o token expirado.";
            return;
        }

        const data = await response.json();
        divDatos.textContent = JSON.stringify(data);
     /* catch (error) {
        console.error("Error al obtener datos:", error);
        divDatos.textContent = "Error de conexión al obtener los datos.";*/
    } catch (error) {
        console.error("Error en petición login:", error);
        divMensajes.textContent = "Error en petición login";
    }

});
