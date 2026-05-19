import mongoose, { Schema, Document } from "mongoose";

export interface ILedgerDocument extends Document {
  customerId: mongoose.Types.ObjectId;
  type: "debit" | "credit";
  amount: number;
  referenceId?: string;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ledgerSchema = new Schema<ILedgerDocument>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    type: {
      type: String,
      enum: ["debit", "credit"],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    referenceId: {
      type: String
    },
    description: {
      type: String,
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

export const LedgerModel = mongoose.model<ILedgerDocument>("Ledger", ledgerSchema);
