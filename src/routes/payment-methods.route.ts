import express from "express";
import { PaymentMethodsController }  from "../controllers/payment-method.controller.js";
import  asyncHandle  from "express-async-handler";
import { Segments, celebrate } from "celebrate";
import { newPaymentSchema, updatePaymentSchema } from "../models/payment-method.model.js";

export const paymentMethodsRouters = express.Router();


paymentMethodsRouters.get("/payment-methods", asyncHandle(PaymentMethodsController.getAll));
paymentMethodsRouters.get("/payment-methods/:id", asyncHandle(PaymentMethodsController.getById));
paymentMethodsRouters.post("/payment-methods", celebrate({[Segments.BODY]: newPaymentSchema }), asyncHandle(PaymentMethodsController.save));
paymentMethodsRouters.put("/payment-methods/:id", celebrate({[Segments.BODY]: updatePaymentSchema }), asyncHandle(PaymentMethodsController.update));
paymentMethodsRouters.delete("/payment-methods/:id", asyncHandle(PaymentMethodsController.delete));
