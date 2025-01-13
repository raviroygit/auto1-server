import express from "express";
import { createFiles, deleteFile, getFilesBySubCategory } from "../controller/file.controller";

const routerFile = express.Router();

routerFile.post("/", createFiles);
routerFile.get("/:subCategoryId", getFilesBySubCategory);
routerFile.delete("/:fileId", deleteFile);

export default routerFile;
