import mongoose, { Schema, Document } from "mongoose";

export interface IItemDocument extends Document {
  name: string;
  description: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<IItemDocument>(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

export const ItemModel = mongoose.model<IItemDocument>("Item", itemSchema);
