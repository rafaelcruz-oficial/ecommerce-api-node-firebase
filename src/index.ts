import express from "express";
import {routes} from "./routes/index.js";
import { initializeApp  as initialAdminApp} from "firebase-admin/app";
import { initializeApp as initializeAppFirebaseApp } from  "firebase/app";
import { errorHandler } from "./middleware/error-handle.middleware.js";
import { pageNotFoundHandler } from "./middleware/page-not-found.middleware.js";
import { auth } from "./middleware/auth.middleware.js";
import { sweggerDocs } from "./routes/swagger-docs.route.js";

initialAdminApp();
initializeAppFirebaseApp({
    apiKey: process.env.API_KEY
});
const app = express();
sweggerDocs(app);
auth(app);
routes(app);
pageNotFoundHandler(app);
errorHandler(app);

app.listen(3000, () => {
    console.log("Servidor ativo na porta 3000");
});