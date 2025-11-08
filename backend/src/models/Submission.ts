import mongoose, { Schema, type Document } from "mongoose"
import type { ISubmission } from "../types"

const SubmissionSchema = new Schema<ISubmission & Document>(
  {
    formId: { type: String, required: true, ref: "Form" },
    data: { type: Schema.Types.Mixed, required: true },
    ipAddress: String,
  },
  { timestamps: true },
)

SubmissionSchema.index({ formId: 1, createdAt: -1 })

export const Submission = mongoose.model<ISubmission & Document>("Submission", SubmissionSchema)
