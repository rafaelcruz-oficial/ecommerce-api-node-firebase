import express from "express";
import { OrdersController }  from "../controllers/orders.controller.js";
import { Segments, celebrate } from "celebrate";
import { changeStatusOrderSchema, newOrderSchema, searchParamsOrderQuerySchema } from "../models/order.model.js";
import expressAsyncHandler from "express-async-handler";

export const orderRoutes = express.Router();


orderRoutes.post(
    "/orders", 
    celebrate({[Segments.BODY]: newOrderSchema }), 
    expressAsyncHandler(OrdersController.save)
);
orderRoutes.get(
    "/orders", 
    celebrate({[Segments.QUERY]: searchParamsOrderQuerySchema }), 
    expressAsyncHandler(OrdersController.search)
);
orderRoutes.get(
    "/orders/:id/items", 
    expressAsyncHandler(OrdersController.getItems)
);
orderRoutes.get(
    "/orders/:id", 
    expressAsyncHandler(OrdersController.getById)
);
orderRoutes.post(
    "/orders/:id/status",
    celebrate({[Segments.BODY]: changeStatusOrderSchema }),  
    expressAsyncHandler(OrdersController.changeStatus)
);
