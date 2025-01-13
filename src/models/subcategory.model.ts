import mongoose, { Schema, Document } from "mongoose";

export interface ISubCategory extends Document {
  name: string;
  prompt: string;
  files: mongoose.Types.ObjectId[];
  categoryId: mongoose.Types.ObjectId;
}

const SubCategorySchema = new Schema({
  name: { type: String, required: true },
  prompt: { type: String, required: true },
  files: [{ type: Schema.Types.ObjectId, ref: "File" }],
  categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
});

export const SubCategory = mongoose.model<ISubCategory>("SubCategory", SubCategorySchema);
