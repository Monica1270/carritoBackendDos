
//=============================================================================
// Controlador de Productos utilizando la arquitectura de capas (Inyección de DAO)
//=============================================================================
export class ProductsController {
  // El constructor recibe el DAO automáticamente desde las rutas
  constructor(productsDao) {
    this.productsDao = productsDao;
  }

  // 1. Crear un producto (POST, /api/products)
  createProduct = async (req, res, next) => {
    try {
      const product = await this.productsDao.createProduct(req.body);
      res.status(201).json({
        status: "success",
        payload: product,
      });
    } catch (error) {
      next(error);
    }
  };

  // 2. Obtener productos con paginación (GET, /api/products)
  getProducts = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const query = req.query.query ? String(req.query.query).trim() : "";
      const sort = req.query.sort ? String(req.query.sort).toLowerCase() : "";

      // Le pedimos los datos formateados directamente al DAO
      const result = await this.productsDao.getProducts({ limit, page, query, sort });

      // Armamos los links de navegación (Hateoas)
      const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;
      const buildLink = (p) =>
        `${baseUrl}?limit=${limit}&page=${p}${query ? `&query=${encodeURIComponent(query)}` : ""}${sort ? `&sort=${sort}` : ""}`;

      res.status(200).json({
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
  };

  // 3. Obtener un producto por ID (GET, /api/products/:id)
  getProductById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await this.productsDao.getProductById(id);

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
  };

  // 4. Actualizar un producto por ID (PUT, /api/products/:id)
  updateProduct = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updated = await this.productsDao.updateProduct(id, req.body);

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
  };

  // 5. Eliminar un producto (DELETE, /api/products/:id)
  deleteProduct = async (req, res, next) => {
    try {
      const { id } = req.params;
      const deleted = await this.productsDao.deleteProduct(id);

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
  };
}
