import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../../middleware/catchAsyncErrors";
import ErrorHandler from "../../utils/ErrorHandler";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { SubCategory } from "../models/subcategory.model";
import { File } from "../models/file.model";

const saveFileData = async (uploadedFile: any, subCategoryId: string) => {
  const fileExtension = uploadedFile.name.split(".").pop()?.toLowerCase();
  let extractedText = "";

  const fileBuffer = uploadedFile.data; // Access the file buffer

  if (fileExtension === "pdf") {
    const pdfData = await pdfParse(fileBuffer);
    extractedText = pdfData.text;
  } else if (fileExtension === "docx") {
    const mammothResult = await mammoth.extractRawText({ buffer: fileBuffer });
    extractedText = mammothResult.value;
  } else if (fileExtension === "txt") {
    extractedText = fileBuffer.toString("utf8");
  } else {
    throw new ErrorHandler(
      `Unsupported file format: ${uploadedFile.name}`,
      400
    );
  }

  // Create file document
  const file: any = await File.create({
    name: uploadedFile.name,
    text: extractedText,
    subCategoryId,
  });
  return file;
};

export const createFiles = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.files || !req.files.files) {
      return next(new ErrorHandler("No files uploaded", 400));
    }

    const { subCategoryId } = req.body;

    if (!subCategoryId) {
      return next(new ErrorHandler("SubCategory ID is required", 400));
    }

    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory) {
      return next(new ErrorHandler("SubCategory not found", 404));
    }

    const uploadedFiles = req.files.files as any[]; // Type-casting for the uploaded files array
    console.log("uploadedFiles", Array.isArray(uploadedFiles));

    try {
      if (Array.isArray(uploadedFiles)) {
        const fileProcessingPromises = uploadedFiles.map(
          async (uploadedFile) => {
            const file = await saveFileData(uploadedFile, subCategoryId);
            // Return the created file
            return file;
          }
        );
        const processedFiles = await Promise.all(fileProcessingPromises);

        console.log(
          "...processedFiles.map((file) => file._id)",
          ...processedFiles.map((file) => file._id)
        );
        // Update subCategory with the new file references
        subCategory.files.push(...processedFiles.map((file) => file._id));
        await subCategory.save();
        res.status(201).json({ success: true, files: processedFiles });
      } else {
        const file = await saveFileData(uploadedFiles, subCategoryId);
        // Return the created file
        subCategory.files.push(file._id);
        await subCategory.save();
        res.status(201).json({ success: true, files: file });
        console.log(" nothing here");
      }
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const getFilesBySubCategory = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { subCategoryId } = req.params;

    if (!subCategoryId) {
      return next(new ErrorHandler("SubCategory ID is required", 400));
    }

    // Check if the subCategory exists
    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory) {
      return next(new ErrorHandler("SubCategory not found", 404));
    }

    // Fetch files associated with the subCategory
    const files = await File.find({ subCategoryId });

    res.status(200).json({
      success: true,
      files,
    });
  }
);

export const deleteFile = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fileId } = req.params;

    if (!fileId) {
      return next(new ErrorHandler("File ID is required", 400));
    }

    try {
      // Find and delete the file
      const file = await File.findByIdAndDelete(fileId);

      if (!file) {
        return next(new ErrorHandler("File not found", 404));
      }

      // Remove the file reference from all sub-categories
      await SubCategory.updateMany(
        { files: fileId },
        { $pull: { files: fileId } }
      );

      res
        .status(200)
        .json({ success: true, message: "File deleted successfully" });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);
