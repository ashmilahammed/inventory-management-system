import mongoose, { Schema, Document } from "mongoose";

export interface ISaleDocument extends Document {
  itemId: mongoose.Types.ObjectId;
  quantity: number;
  customerId?: mongoose.Types.ObjectId;
  isCash: boolean;
  totalAmount: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const saleSchema = new Schema<ISaleDocument>(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer"
    },
    isCash: {
      type: Boolean,
      required: true,
      default: false
    },
    totalAmount: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const SaleModel = mongoose.model<ISaleDocument>("Sale", saleSchema);
