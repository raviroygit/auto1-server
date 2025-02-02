import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  prompt: string;
  subCategories: mongoose.Types.ObjectId[];
}

const CategorySchema = new Schema({
  name: { type: String, required: true },
  prompt: { type: String },
  subCategories: [{ type: Schema.Types.ObjectId, ref: "SubCategory" }],
});

export const Category = mongoose.model<ICategory>("Category", CategorySchema);
