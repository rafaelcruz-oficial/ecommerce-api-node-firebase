import express from "express";
import { ProductsController }  from "../controllers/products.controller.js";
import  asyncHandle  from "express-async-handler";
import { Segments, celebrate } from "celebrate";
import { newProductSchema , searchQuerySchema, updateProductSchema } from "../models/product.model.js";

export const productRouters = express.Router();


productRouters.get("/products", asyncHandle(ProductsController.getAll));

productRouters.get("/products/search", celebrate({ [Segments.QUERY]: searchQuerySchema }),asyncHandle(ProductsController.search));
productRouters.get("/products/:id", asyncHandle(ProductsController.getById));

productRouters.post("/products", celebrate({[Segments.BODY]: newProductSchema }), asyncHandle(ProductsController.save));
productRouters.put("/products/:id", celebrate({[Segments.BODY]: updateProductSchema }), asyncHandle(ProductsController.update));
productRouters.delete("/products/:id", asyncHandle(ProductsController.delete));

