import express from "express";
import { generateAiResponse } from "../controller/auto_ai.controller";

const routerAutoAi = express.Router();

routerAutoAi.post("/ai",generateAiResponse)

export default routerAutoAi;