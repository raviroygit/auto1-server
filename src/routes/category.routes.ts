import express from "express";
import { createCategory, getCategories, updateCategory } from "../controller/category.controller";

const routerCategory = express.Router();

routerCategory.post("/", createCategory);
routerCategory.get("/", getCategories);
routerCategory.put("/", updateCategory);

export default routerCategory;
