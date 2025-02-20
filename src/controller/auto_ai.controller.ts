import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../../middleware/catchAsyncErrors";
import ErrorHandler from "../../utils/ErrorHandler";
import query from "../../AiModel/AiModel";
import OpenAI from "openai";
import { cleanData } from "../../utils";
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export const generateAiResponse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const history = [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content:
            "Can you please let us know more details about your services?",
        },
      ];

      const response = await query(history, data);

      res.status(200).json({ success: true, ai: response });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const generateFormatResponse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text } = req.body;
      if (!text || text?.trim() === "") {
        return next(new ErrorHandler("Text is required, Input some text", 400));
      }

      const context: any = [
        {
          role: "system",
          content: `Carefully study the attached Text. Your job is to STRICTLY Extract information and map information to this JSON format as it is, STRICTLY DO NOT modify or generate any new information. For example "Title"=product name as is (e.g. "DieHard Gold Battery: 34 Group Size, 800 CCA, 1000 CA, 110 Minute Reserve Capacity, Maximum Starting Power "), "Description"=Product description which will typically come after product name or title.  STRICTLY COPY the Exact same word to word information:  \n\n
          
          {
  "request_id": "001",
  "data": {
    "category_name": "string",
    "subcategory_name": "string",
    "user_input": {
      "title": "string",
      "company_name": "string",
      "description": "string",
      "features": "string",
      "attributes": [
        { "weight": "string" },
        { "length": "string" },
        { "height": "string" },
         ...
      ],
      "reviews": ["string"]
    }
  }
}\n\nIf a field is missing, return 'Not found'

here is the information's, you have use this for extract the JSON information's:
${text}
.`,
        },
        // {
        //   role: "user",
        //   content: `Extract the following information from this product description and format it as JSON:\n\n${text}`,
        // },
      ];

      const response: any = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: context,
        stream: false,
      });

      const formattedResponse = response.choices[0]?.message.content;

      if (!formattedResponse) {
        return next(new ErrorHandler("No response from OpenAI API", 400));
      }

      res
        .status(200)
        .json({ success: true, ai: JSON.parse(cleanData(formattedResponse)) });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const extractCompanyInformation = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text } = req.body;
      if (!text || text?.trim() === "") {
        return next(new ErrorHandler("Text is required, Input some text", 400));
      }

      const context: any = [
        {
          role: "system",
          content: `Extract the exact "Company Information" section from the provided text. Ensure that the extracted content matches word-for-word with the original text and does not include any additional modifications or omissions.
          Text:
          ${text}
          `,
        },
      ];

      const response: any = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: context,
        stream: false,
      });

      const formattedResponse = response.choices[0]?.message.content;

      if (!formattedResponse) {
        return next(new ErrorHandler("No response from Ai", 400));
      }

      res
        .status(200)
        .json({ success: true, ai: cleanData(formattedResponse) });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);
