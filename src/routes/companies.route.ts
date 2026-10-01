import express from "express";
import { CompaniesController}  from "../controllers/companies.controller.js";
import  asyncHandle  from "express-async-handler";
import { Segments, celebrate } from "celebrate";
import { companySchema, updateCompanySchema } from "../models/company.model.js";

export const companiesRouters = express.Router();


companiesRouters.get("/companies", asyncHandle(CompaniesController.getAll));
companiesRouters.get("/companies/:id", asyncHandle(CompaniesController.getById));
companiesRouters.post("/companies", celebrate({[Segments.BODY]: companySchema }), asyncHandle(CompaniesController.save));
companiesRouters.put("/companies/:id", celebrate({[Segments.BODY]: updateCompanySchema }), asyncHandle(CompaniesController.update));


