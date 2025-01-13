import express from "express";
import { createSubCategory, getSubCategoriesByCategory, updateSubCategory } from "../controller/subcategory.controller";

const routerSubCat = express.Router();

routerSubCat.post("/", createSubCategory);
routerSubCat.get("/:categoryId", getSubCategoriesByCategory);
routerSubCat.put("/", updateSubCategory);

export default routerSubCat;
