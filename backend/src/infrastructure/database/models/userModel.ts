import mongoose, { Schema, Document } from "mongoose";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin";
}

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      default: "admin"
    }
  },
  {
    timestamps: true
  }
);

export const UserModel = mongoose.model<IUserDocument>(
  "User",
  userSchema
);