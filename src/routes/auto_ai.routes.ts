import express from "express";
import {
  generateAiResponse,
  generateFormatResponse,
} from "../controller/auto_ai.controller";

const routerAutoAi = express.Router();

routerAutoAi.post("/ai", generateAiResponse);
routerAutoAi.post("/format", generateFormatResponse);

routerAutoAi.post("/company-info", generateFormatResponse);

export default routerAutoAi;
