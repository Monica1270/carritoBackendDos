import express from "express";
import { ProductsDao } from "../dao/productsDaos.js";
import { validateProductBody } from "../middlewares/validation.Middleware.js";
import { logger } from "../middlewares/log.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

// Instanciamos el DAO aquí mismo para conectarnos a la Base de Datos
const productsDao = new ProductsDao();

// Aplicamos tus middlewares globales para las rutas de productos
router.use(logger);
router.use(auth);

//=============================================================================
// RUTAS + LÓGICA (Unificadas en un solo archivo)
//=============================================================================

// 1. Crear producto (POST /) - Aplica validación primero, luego guarda en BD
router.post("/", validateProductBody, async (req, res, next) => {
  try {
    const product = await productsDao.createProduct(req.body);
    res.status(201).json({
      status: "success",
      payload: product,
    });
  } catch (error) {
    next(error);
  }
});

// 2. Obtener productos con paginación (GET /)
router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const query = req.query.query ? String(req.query.query).trim() : "";
    const sort = req.query.sort ? String(req.query.sort).toLowerCase() : "";

    // Le pedimos los datos procesados al DAO
    const result = await productsDao.getProducts({ limit, page, query, sort });

    // Construimos los links de navegación para las páginas
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;
    const buildLink = (p) =>
      `${baseUrl}?limit=${limit}&page=${p}${query ? `&query=${encodeURIComponent(query)}` : ""}${sort ? `&sort=${sort}` : ""}`;

    res.status(200).json({
      usuarioConsulta: req.session.user.nombre,
      status: "success",
      payload: result.payload,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.prevPage ? buildLink(result.prevPage) : null,
      nextLink: result.nextPage ? buildLink(result.nextPage) : null,
    });
  } catch (error) {
    next(error);
  }
});

// 3. Ruta especial de informe (Mantenela ARRIBA de /:id para evitar confusiones de Express)
router.get('/', (req, res) => {
  let producto = `Producto General o Informe`;
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ producto });
});

// 4. Obtener un único producto por ID (GET /:id)
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productsDao.getProductById(id);

    if (!product || product.isDeleted) {
      return res.status(404).json({
        status: "error",
        message: `No se encontró ningún producto activo con el ID ${id}`,
      });
    }

    res.status(200).json({
      status: "success",
      payload: product,
      
    });
  } catch (error) {
    next(error);
  }
});

// 5. Actualizar producto por ID (PUT /:id) - Valida los datos recibidos primero
router.put("/:id", validateProductBody, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await productsDao.updateProduct(id, req.body);

    if (!updated || updated.isDeleted) {
      return res.status(404).json({
        status: "error",
        message: `No se encontró ningún producto activo con el ID ${id} para actualizar`,
      });
    }

    res.status(200).json({
      status: "success",
      payload: updated,
    });
  } catch (error) {
    next(error);
  }
});

// 6. Eliminar producto por ID (DELETE /:id)
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await productsDao.deleteProduct(id);

    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: `No se encontró ningún producto con el ID: ${id} para eliminar`,
      });
    }

    res.status(200).json({
      status: "success",
      message: `El producto "${deleted.title || id}" fue eliminado correctamente`,
      payload: deleted,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
