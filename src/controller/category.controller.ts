import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../../middleware/catchAsyncErrors";
import ErrorHandler from "../../utils/ErrorHandler";
import { Category } from "../models/category.model";

export const createCategory = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, prompt } = req.body;

      const category = await Category.create({ name, prompt });
      res.status(201).json({ success: true, category });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const updateCategory = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, prompt } = req.body;

      const category = await Category.findByIdAndUpdate(id,{ prompt });
      res.status(201).json({ success: true, category });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const getCategories = CatchAsyncError(
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await Category.find().populate({
        path: "subCategories",
        // populate: { path: "files" },
      });

      res.status(200).json({ success: true, categories });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);
