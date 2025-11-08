import mongoose, { Schema, type Document } from "mongoose"
import type { IForm, IField } from "../types"

const FieldSchema = new Schema<IField>({
  name: { type: String, required: true },
  label: { type: String, required: true },
  type: {
    type: String,
    enum: ["text", "textarea", "number", "email", "date", "checkbox", "radio", "select", "file"],
    required: true,
  },
  required: { type: Boolean, default: false },
  order: { type: Number, required: true },
  options: [String],
  validation: {
    min: Number,
    max: Number,
    regex: String,
  },
  dependsOn: String,
  dependsOnValue: String,
})

const FormSchema = new Schema<IForm & Document>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    fields: [FieldSchema],
  },
  { timestamps: true },
)

export const Form = mongoose.model<IForm & Document>("Form", FormSchema)
