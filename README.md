# 🛒 App de Venta de Ropa Deportiva, Zapatillas y Cuadros - Módulo Events 🔟

Este repositorio contiene la pre-entrega del módulo de **Gestión de Eventos y Logística Comercial** para la materia Backend 2. La aplicación está diseñada bajo el estándar de una API RESTful e implementa control de accesos por rol (RBAC), filtros avanzados con expresiones regulares, paginación nativa y lógica de negocio automatizada para envíos.

---

## 🏛️ Arquitectura del Proyecto (Diseño en Capas)

## 📂 Estructura del Directorio `src/`

Toda la aplicación está construida utilizando **ES Modules (ESM)** y organizada bajo una arquitectura en capas:

```text
src/
├── config/         # Variables de entorno y conexiones
├── controllers/    # Controladores HTTP (req, res)
├── dao/            # Capa de acceso a datos (Persistencia)
├── middlewares/    # Filtros de seguridad, roles y errores
├── models/         # Esquemas y modelos de Mongoose
├── routes/         # Definición de endpoints de la API
├── services/       # Lógica de negocio centralizada
├── utils/          # Helpers y servicios externos (Mailer)
└── app.js          # Punto de entrada de la aplicación
```

### 📝 Detalle de Componentes y Capas

*   **`config/`**: Configuración centralizada de variables de entorno (`dotenv`) y conexión a MongoDB Atlas mediante Mongoose (`db.config.js`).
*   **`controllers/`**: Recepción de peticiones HTTP, extracción de parámetros (`req.query`, `req.body`, `req.user`) y retorno de respuestas normalizadas (`tickets.controller.js`, `users.controller.js`).
*   **`dao/`**: Capa de persistencia aislada para el acceso directo a la base de datos utilizando el patrón DAO (`tickets.dao.js`, `users.dao.js`).
*   **`middlewares/`**: Funciones intermedias globales y de ruta que manejan la autenticación (cookies y Passport), control de roles, logger del sistema y gestión centralizada de errores.
*   **`models/`**: Definición de esquemas de Mongoose optimizados con configuraciones de limpieza de datos como `trim` y `versionKey: false` (`ticket.model.js`, `user.model.js`, `event.model.js`).
*   **`routes/`**: Enrutadores de la API que asocian las rutas y verbos HTTP con sus controladores correspondientes (`tickets.router.js`, `users.router.js`).
*   **`services/`**: Orquestación de la lógica de negocio pura del sistema, aislando las reglas operativas de la capa de transporte HTTP (`tickets.service.js`).
*   **`utils/`**: Herramientas genéricas de asistencia, funciones hash y servicios externos de mensajería (`mailer.util.js` con Nodemailer).
*   **`app.js`**: Archivo principal del servidor. Inicializa Express, inyecta middlewares base (cookies, Passport), monta los enrutadores centrales y arranca la aplicación.

## 📦 Tecnologías Utilizadas

*   **Runtime:** Node.js v22 (Modos nativos `--watch`)
*   **Framework:** Express.js
*   **Base de Datos & ORM:** MongoDB & Mongoose
*   **Autenticación & Seguridad:** JWT (JSON Web Tokens) / Bcrypt / Passport JWT (`strategy: current`)
*   **Herramientas Base:** Cookie-parser / Express-session / Connect-mongo (Persistencia de sesiones)
*   **Renderizado Opcional:** Express-Handlebars

---

## 📋 Criterios de Aceptación del Modelo Event

El esquema de datos para los eventos en Mongoose (`event.model.js`) implementa las siguientes restricciones nativas:

*   **Campos obligatorios:** `title`, `description`, `category`, `location`, `deliveryMethod`, `deliveryDate`.
*   **Restricciones numéricas:** `capacity` debe ser estrictamente mayor a cero (`min: 1`). `price` debe ser mayor o igual a cero (`min: 0`).
*   **Estados permitidos (status):** Exclusivamente `draft`, `published`, `cancelled` o `finished`.
*   **Relación de Organizador (organizer):** Es una referencia directa por `ObjectId` al modelo de usuario (`User`), garantizando la integridad de los datos.

---

## 📌 Endpoints de Eventos (`/api/events`)

Todos los endpoints responden e interactúan emitiendo cabeceras normadas `Content-Type: application/json`.

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/events` | 🌐 Público | Lista eventos con filtros avanzados, ordenamiento y paginación. |
| **GET** | `/api/events/:id` | 🌐 Público | Obtiene el detalle de un evento específico por ID. |
| **POST** | `/api/events` | 🔑 `organizer`, `admin` | Crea un nuevo evento con validación logística automatizada. |
| **PUT** | `/api/events/:id` | 🔐 Dueño o `admin` | Modifica de forma general los campos de un evento. |
| **PATCH** | `/api/events/:id/status` | 🔐 Dueño o `admin` | Modifica únicamente las transiciones de estado del evento. |

---

## 🛠️ Reglas de Negocio Principales (Capa de Controladores / Modelos)

### 🆕 Creación de Eventos
*   **Asignación de Organizador:** El campo `organizer` se extrae e inyecta de forma automática en el backend leyendo el token de la cookie (`req.user.id`). Se rechaza cualquier intento de enviarlo manualmente en el `body`.
*   **Fechas Futuras:** No se permite la creación de eventos con fechas de realización anteriores al día de hoy.
*   **Logística en Castellano (Costo de Envío):** Si el cliente selecciona como método de entrega `"Envío a domicilio"`, el backend calcula e inyecta de manera automática un cargo fijo de **\$20.000** en el campo `costoEnvio`. Si selecciona `"Retiro del local"`, el costo se computa automáticamente en **\$0**.

### ✏️ Modificaciones, Permisos y Estados
*   **Control de Propiedad:** Un usuario con rol `organizer` está bloqueado para modificar eventos creados por otros usuarios. El rol `admin` posee permisos globales.
*   **Inmutabilidad de Cancelados:** Un evento en estado `cancelled` entra en modo de solo lectura. Se rechaza cualquier intento posterior de modificación física o cambio de estado.
*   **Borrado Lógico:** Cancelar un evento consiste únicamente en cambiar su estado a `cancelled`; bajo ninguna circunstancia se eliminan físicamente registros de la base de datos.
*   **Restricción de Publicación:** No se permite pasar a estado `published` aquellos eventos que ya se encuentren en estado `finished` o `cancelled`.

---

## 🔍 Listado con Filtros y Paginación

El endpoint de lectura masiva soporta query params avanzados para segmentar la información:
*   **Filtros directos:** `status`, `category` (por ObjectId).
*   **Coincidencia Parcial:** `location` (búsqueda case-insensitive mediante Expresiones Regulares).
*   **Rango de fechas:** Filtrado cronológico selectivo mediante `dateFrom` y `dateTo`.
*   **Ordenamiento:** Clasificación flexible de registros (Ejemplos: `?sort=date` o `?sort=-price`).
*   **Paginación:** Propiedades controladas mediante `page` (página actual) y `limit` (registros por lote).

### 📄 Estructura de Respuesta Normalizada (Caso Exitoso 200)
```json
{
  "status": "success",
  "data": [ ... ],
  "page": 1,
  "limit": 10,
  "total": 45,
  "totalPages": 5
}
```

---

## 🧪 Casos de Prueba (QA Checklist Evaluado)

Las siguientes pruebas técnicas fueron validadas mediante Postman garantizando el comportamiento de los códigos HTTP correspondientes:

1.  **Restricción de Rol en Creación:** Intentar crear un evento autenticado con rol `user` → Retorna **403 Forbidden**.
2.  **Validación de Fecha Pasada:** Intentar crear un evento con fecha de ayer → Retorna **400 Bad Request**.
3.  **Validación de Capacidad:** Intentar crear un evento con `capacity: 0` → Retorna **400 Bad Request**.
4.  **Costo de Logística Automatizado:** Crear un evento con `"deliveryMethod": "Envío a domicilio"` → El sistema responde con **201 Created** inyectando de forma segura el campo `"costoEnvio": 20000`.
5.  **Permiso de Propietario:** Modificar un evento propio siendo el `organizer` original → Retorna **200 OK**.
6.  **Bloqueo Organizador Ajeno:** Intentar modificar un evento ajeno siendo un `organizer` distinto → Retorna **403 Forbidden**.
7.  **Permiso de Administrador:** Modificar el evento de cualquier organizador utilizando el rol `admin` → Retorna **200 OK**.
8.  **Bloqueo por Estado Cancelado:** Intentar alterar un campo de un evento cuyo estado ya es `cancelled` → Retorna **400 Bad Request**.
9.  **Eficacia de Filtros:** Ejecutar la consulta `?status=published&page=1&limit=5` → Retorna el array de datos paginado y filtrado correctamente.
10. **Entidad Inexistente:** Consultar un evento con un ID válido de MongoDB pero que no pertenece a ningún registro → Retorna **404 Not Found**.
