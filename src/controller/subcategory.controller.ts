import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../../middleware/catchAsyncErrors";
import ErrorHandler from "../../utils/ErrorHandler";
import { Category } from "../models/category.model";
import { SubCategory } from "../models/subcategory.model";

export const createSubCategory = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, prompt, categoryId } = req.body;

    if (!categoryId) return next(new ErrorHandler("Category ID is required", 400));

    const category = await Category.findById(categoryId);
    if (!category) return next(new ErrorHandler("Category not found", 404));

    const subCategory:any = await SubCategory.create({ name, prompt, categoryId });

    category.subCategories.push(subCategory._id);
    await category.save();

    res.status(201).json({ success: true, subCategory });
  }
);

export const updateSubCategory = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const {  prompt, id } = req.body;

    const subCategory:any = await SubCategory.findByIdAndUpdate(id,{ prompt });

    res.status(201).json({ success: true, subCategory });
  }
);

export const getSubCategoriesByCategory = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;

    if (!categoryId) return next(new ErrorHandler("Category ID is required", 400));

    const subCategories = await SubCategory.find({ categoryId }).populate("files");

    res.status(200).json({ success: true, subCategories });
  }
);
