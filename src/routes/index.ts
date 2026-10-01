import express, { Router } from "express";
import { userRouters } from "./users.route.js";
import { authRoutes } from "./auth.route.js";
import { companiesRouters } from "./companies.route.js";
import { categoryRouters } from "./categories.route.js";
import { productRouters } from "./products.route.js";
import { paymentMethodsRouters } from "./payment-methods.route.js";
import { orderRoutes } from "./orders.route.js";
import { allowAnonymousUser } from "../middleware/allow.middleware.js";


export const routes = (app: express.Express) => {
    app.use(express.json({limit: "5mb"}));
    app.use(authRoutes);
    app.use(allowAnonymousUser);

    const authenticatedRoutes =  Router();

    authenticatedRoutes.use(userRouters);
    authenticatedRoutes.use(companiesRouters);
    authenticatedRoutes.use(categoryRouters);
    authenticatedRoutes.use(productRouters);
    authenticatedRoutes.use(paymentMethodsRouters);
    authenticatedRoutes.use(orderRoutes);
    app.use(
        // #swagger.security = [{ "bearerAuth": [] }];
        authenticatedRoutes
    );
};