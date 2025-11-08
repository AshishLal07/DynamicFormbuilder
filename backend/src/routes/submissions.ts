import express, { type Request, type Response } from "express"
import { Submission } from "../models/Submission"
import { Form } from "../models/Form"
import { authMiddleware } from "../middleware/auth"

const router = express.Router()

// Submit form response
router.post("/", async (req: Request, res: Response) => {
  try {
    const { formId, data } = req.body

    // Validate form exists
    const form = await Form.findById(formId)
    if (!form) return res.status(404).json({ error: "Form not found" })

    // Server-side validation
    const errors: Record<string, string> = {}
    for (const field of form.fields) {
      const value = data[field.name]

      if (field.required && !value) {
        errors[field.name] = `${field.label} is required`
        continue
      }

      if (value && field.type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          errors[field.name] = "Invalid email address"
        }
      }

      if (value && field.type === "number") {
        if (isNaN(Number(value))) {
          errors[field.name] = "Must be a number"
        } else if (field.validation?.min !== undefined && Number(value) < field.validation.min) {
          errors[field.name] = `Must be at least ${field.validation.min}`
        } else if (field.validation?.max !== undefined && Number(value) > field.validation.max) {
          errors[field.name] = `Must be at most ${field.validation.max}`
        }
      }

      if (value && field.type === "text" && field.validation?.regex) {
        const regex = new RegExp(field.validation.regex)
        if (!regex.test(value)) {
          errors[field.name] = "Invalid format"
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors })
    }

    const submission = new Submission({
      formId,
      data,
      ipAddress: req.ip,
    })

    await submission.save()
    res.status(201).json({ message: "Submission saved", submissionId: submission._id })
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to submit" })
  }
})

// Get submissions for a form (admin)
router.get("/form/:formId", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search } = req.query
    const pageNum = Math.max(1, Number(page))
    const limitNum = Math.min(100, Math.max(1, Number(limit)))
    const skip = (pageNum - 1) * limitNum

    const query: any = { formId: req.params.formId }

    const total = await Submission.countDocuments(query)
    const submissions = await Submission.find(query).skip(skip).limit(limitNum).sort({ createdAt: -1 })

    res.json({
      submissions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch submissions" })
  }
})

// Delete submission (admin)
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const submission = await Submission.findByIdAndDelete(req.params.id)
    if (!submission) return res.status(404).json({ error: "Submission not found" })
    res.json({ message: "Submission deleted" })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete submission" })
  }
})

export default router
