# 🎟️ Plataforma de Gestión de Eventos - API REST (Backend II)

API REST desarrollada con **Node.js** y **Express** para la gestión integral de eventos, usuarios e inscripciones, estructurada bajo un patrón de diseño en capas para garantizar modularidad, mantenibilidad y escalabilidad.

---
##🏛️ Arquitectura del Proyecto (Diseño en Capas)

El proyecto sigue una separación estricta de responsabilidades organizada dentro del directorio `src/`:

- **`src/config/`**: Configuración centralizada de variables de entorno (`dotenv`) y conexión a MongoDB (`Mongoose`).
- **`src/routes/`**: Definición de rutas y endpoints de la API (`events.router.js`, `sessions.router.js`).
- **`src/controllers/`**: Recepción de peticiones HTTP (`req`), delegación a la capa de servicios y retorno de respuestas normalizadas (`res`).
- **`src/services/`**: Implementación de las reglas y lógica de negocio de la aplicación.
- **`src/repositories/`**: Capa intermedia que desacopla la lógica de negocio de la fuente de datos (Patrón Repository).
- **`src/dao/`**: Data Access Object para la interacción directa con la base de datos.
- **`src/models/`**: Definición de esquemas y modelos de Mongoose (`User.js`, `Event.js`).
- **`src/middlewares/`**: Middlewares globales y de ruta (autenticación, validación, manejo centralizado de errores).
- **`src/utils/`**: Funciones auxiliares y herramientas utilitarias.
- **`src/app.js`**: Configuración de Express, middlewares base y montaje de routers.
- **`src/server.js`**: Punto de entrada que inicializa la base de datos y levanta el servidor HTTP.

---

## 📦 Tecnologías Utilizadas

- **Node.js** (Módulos ES - ESM)
- **Express.js**
- **MongoDB** & **Mongoose**
- **Dotenv**
- **JSON Web Tokens (JWT)** / **Bcrypt** (Autenticación y seguridad)

---

## 📁 Estructura del Directorio

```text
carritoBackendDos/
├── src/
│   ├── config/             # Configuración de entorno y conexión a BD
│   ├── controllers/        # Controladores (Events, Sessions)
│   ├── dao/                # Data Access Objects
│   ├── middlewares/        # Middlewares de aplicación y ruta
│   ├── models/             # Modelos de datos (Event, User)
│   ├── repositories/       # Repositorios de datos
│   ├── routes/             # Enrutadores principales
│   ├── services/           # Lógica de negocio
│   ├── utils/              # Utilidades globales
│   ├── app.js              # Configuración de la app Express
│   └── server.js           # Inicio del servidor HTTP
├── .env.example            # Plantilla de variables de entorno
├── .gitignore              # Archivos y carpetas ignorados por Git
├── package.json            # Dependencias y scripts del proyecto
└── README.md               # Documentación del proyecto
'''
---
##🔧 Instalación y Puesta en Marcha
### 1. Clonar el repositorio
'''bash
git clone <URL_DE_TU_REPOSITORIO>
cd carritoBackendDos
'''

### 2. Instalar dependencias
'''bash
npm install
'''

### 3. Configurar variables de entorno
Crea un archivo .env en la raíz del proyecto basándote en .env.example:
'''bash
cp .env.example .env
'''
Variables requeridas en .env:
'''env
PORT=8080
NODE_ENV=development
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster0.mongodb.net/entregaFinalB?retryWrites=true&w=majority
DB_NAME=entregaFinalB
JWT_SECRET=tuClaveSecretaParaTokens
'''

### 4. Ejecutar el servidor
-**Modo desarrollo (con recarga automática):**
'''bash
npm run dev
'''
-**Modo producción:**
'''bash
npm start
'''

## 📌 Endpoints Base Disponibles
| Método | Endpoint | Descripción | Respuesta Exitosa |
|---|---|---|---|
| `GET` | `/api/health` | Estado y verificación de actividad del servidor | `{ "status": "ok", "message": "Servidor activo" }` |
| `GET` | `/api/events` | Listado inicial de eventos | `{ "status": "success", "payload": [] }` |
| `POST` | `/api/sessions/register` | Registro de nuevos usuarios | Estructura base configurada |
| `POST` | `/api/sessions/login` | Inicio de sesión y generación de token | Estructura base configurada |