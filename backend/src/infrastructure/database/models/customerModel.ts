import mongoose, { Schema, Document } from "mongoose";

export interface ICustomerDocument extends Document {
  name: string;
  address: string;
  mobileNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomerDocument>(
  {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    mobileNumber: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const CustomerModel = mongoose.model<ICustomerDocument>("Customer", customerSchema);
