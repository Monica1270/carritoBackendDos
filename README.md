# 🛒 Carrito de Compras - Monica Lombardi (Backend)

¡Bienvenido al repositorio del Backend para el Carrito de Compras de Monica Lombardi! Esta aplicación es una plataforma robusta diseñada para gestionar un catálogo dinámico de ropa deportiva, calzado y artículos de decoración, ofreciendo una experiencia interactiva en tiempo real.

---

## 🌟 Características Principales

* **Catálogo Variado:** Gestión de productos divididos en categorías como Ropa Deportiva para Mujer (calzas, tops, remeras), Calzado (urbano y deportivo) y Decoración (cuadros y láminas).
* **Carrito en Tiempo Real:** Gestión e interacción inmediata mediante WebSockets para añadir, actualizar o quitar productos sin recargar la página.
* **Autenticación Segura:** Sistema de sesiones y encriptación de contraseñas para proteger las cuentas de los usuarios.
* **Diseño Dinámico:** Renderizado de pantallas en el servidor utilizando plantillas reutilizables.
* **Subida de Archivos:** Soporte para cargar imágenes de productos de forma local y eficiente.

---

## 📦 Tecnologías y Paquetes Utilizados

* **Express:** Armazón principal del servidor web para controlar las rutas y peticiones del sistema.
* **Socket.io:** Habilita la comunicación bidireccional en tiempo real para la actualización del carrito.
* **Mongoose:** Conector y modelador de datos para interactuar con la base de datos de MongoDB.
* **Express Handlebars:** Motor de plantillas que mezcla código HTML con datos dinámicos del servidor.
* **Express Session:** Middleware para mantener la sesión de los usuarios activa entre páginas.
* **Bcrypt:** Herramienta de seguridad para encriptar las contraseñas antes de guardarlas.
* **Multer:** Intermediario especializado en procesar la subida de imágenes de los productos.

---

## 📁 Estructura del Proyecto

```text
carritoBackendDos/
├── config/             # Configuraciones generales del entorno (.env)
├── controllers/        # Lógica de negocio y control de peticiones (Products)
├── dao/                # Data Access Objects (Interacción directa con la BD)
├── middlewares/        # Validaciones de seguridad, logs y manejo de errores
├── models/             # Esquemas de datos (Productos y Usuarios)
├── public/             # Archivos estáticos disponibles públicamente (CSS, JS, imágenes)
├── repositories/       # Capa intermedia de acceso a datos (Patrón Repository)
├── routes/             # Definición de rutas y endpoints de la API (Products, Sessions)
├── services/           # Servicios con lógica de negocio específica
├── src/                # Archivos fuente adicionales
├── utils/              # Funciones utilitarias y herramientas globales
├── view/               # Vistas del frontend de la aplicación
│   ├── layout/         # Plantillas base (main.handlebars)
│   ├── partial/        # Componentes repetibles (header.handlebars)
│   ├── cart.handlebars # Vista del carrito de compras
│   └── home.handlebars # Vista principal del catálogo
├── .env                # Variables de entorno secretas
├── app.js              # Punto de entrada principal de la aplicación
└── package.json        # Configuración de dependencias del proyecto
```

---

## 🔧 Instalación y Arranque

Seguí estos pasos para clonar y ejecutar el proyecto de forma local:

### 1. Clonar el repositorio
```bash
git clone https://github.com
cd carritoBackendDos
```

### 2. Instalar las dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example` y completa tus datos de conexión (como la URL de tu base de datos MongoDB).

### 4. Iniciar el servidor
* **Modo Desarrollo (con reinicio automático):**
  ```bash
  npm run dev
  ```
* **Modo Producción:**
  ```bash
  npm start
  ```

---

## 📩 Contacto y Consultas

Si tenés dudas o querés realizar una consulta sobre el desarrollo del proyecto, podés escribirme a:

* 📧 **Email:** tuemail@ejemplo.com
