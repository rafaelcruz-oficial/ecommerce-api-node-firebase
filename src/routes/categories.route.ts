import express from "express";
import { CategoriesController}  from "../controllers/categories.controller.js";
import  asyncHandle  from "express-async-handler";
import { Segments, celebrate } from "celebrate";
import { categorySchema, updateCategorySchema } from "../models/category.model.js";

export const categoryRouters = express.Router();


categoryRouters.get("/categories", asyncHandle(CategoriesController.getAll));
categoryRouters.get("/categories/:id", asyncHandle(CategoriesController.getById));
categoryRouters.post("/categories", celebrate({[Segments.BODY]: categorySchema }), asyncHandle(CategoriesController.save));
categoryRouters.put("/categories/:id", celebrate({[Segments.BODY]: updateCategorySchema }), asyncHandle(CategoriesController.update));
categoryRouters.delete("/categories/:id", asyncHandle(CategoriesController.delete));
