import express, { type Request, type Response } from "express"
import { Form } from "../models/Form"
import { authMiddleware } from "../middleware/auth"
import { z } from "zod"

const router = express.Router()

const FieldSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: z.enum(["text", "textarea", "number", "email", "date", "checkbox", "radio", "select", "file"]),
  required: z.boolean(),
  order: z.number(),
  options: z.array(z.string()).optional(),
  validation: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      regex: z.string().optional(),
    })
    .optional(),
  dependsOn: z.string().optional(),
  dependsOnValue: z.string().optional(),
})

const FormSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  fields: z.array(FieldSchema),
})

// Create form
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const validated = FormSchema.parse(req.body)
    const form = new Form(validated)
    await form.save()
    res.status(201).json(form)
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Invalid data" })
  }
})

// Get all forms
router.get("/", async (req: Request, res: Response) => {
  try {
    const forms = await Form.find()
    res.json(forms)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch forms" })
  }
})

// Get form by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const form = await Form.findById(req.params.id)
    if (!form) return res.status(404).json({ error: "Form not found" })
    res.json(form)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch form" })
  }
})

// Update form
router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const validated = FormSchema.parse(req.body)
    const form = await Form.findByIdAndUpdate(req.params.id, validated, { new: true })
    if (!form) return res.status(404).json({ error: "Form not found" })
    res.json(form)
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Invalid data" })
  }
})

// Delete form
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id)
    if (!form) return res.status(404).json({ error: "Form not found" })
    res.json({ message: "Form deleted" })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete form" })
  }
})

export default router
