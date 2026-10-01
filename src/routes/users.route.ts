import express from "express";
import { UsersController}  from "../controllers/users.controller.js";
import  asyncHandle  from "express-async-handler";
import { Segments, celebrate } from "celebrate";
import { newUserSchema, updateUserSchema } from "../models/user.model.js";

export const userRouters = express.Router();


userRouters.get("/users", asyncHandle(UsersController.getAll));
userRouters.get("/users/:id", asyncHandle(UsersController.getById));
userRouters.post("/users", celebrate({[Segments.BODY]: newUserSchema }), asyncHandle(UsersController.save));
userRouters.put("/users/:id", celebrate({[Segments.BODY]: updateUserSchema }), asyncHandle(UsersController.update));
userRouters.delete("/users/:id", asyncHandle(UsersController.delete));

