import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import { ErrorMiddleware } from "./middleware/error";
import fileUpload from "express-fileupload";
import routerCategory from "./src/routes/category.routes";
import routerSubCat from "./src/routes/subcategory.routes";
import routerFile from "./src/routes/file.routes";
import routerAutoAi from "./src/routes/auto_ai.routes";

dotenv.config({ path: __dirname + "/.env" });

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// cors=> cross origin resource sharing
app.use(
  cors({
    origin: [process.env.ORIGIN||"",process.env.ORIGIN2||"",process.env.ORIGIN3||""],
  })
);

app.use(fileUpload());

// routes
app.use("/category", routerCategory);
app.use("/sub-category", routerSubCat);
app.use("/file", routerFile);
app.use("/auto", routerAutoAi);

// testing api
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: " Auto Ai server is working",
  });
});

// unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Error middleware
app.use(ErrorMiddleware);
