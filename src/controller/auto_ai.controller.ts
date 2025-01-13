import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../../middleware/catchAsyncErrors";
import ErrorHandler from "../../utils/ErrorHandler";
import query from "../../AiModel/AiModel";

export const generateAiResponse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const  data  = req.body;

      const history = [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content:
            "Can you please let us know more details about your services?",
        },
      ];

      const response = await query(history, data);

      res.status(200).json({ success: true, ai:response });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);
