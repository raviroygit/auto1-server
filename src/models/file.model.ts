import mongoose, { Schema, Document } from "mongoose";

export interface IFile extends Document {
  name: string;
  text: string;
  subCategoryId: mongoose.Types.ObjectId;
}

const FileSchema = new Schema({
  name: { type: String, required: true },
  text: { type: String, required: true },
  subCategoryId: { type: Schema.Types.ObjectId, ref: "SubCategory", required: true },
});

export const File = mongoose.model<IFile>("File", FileSchema);
