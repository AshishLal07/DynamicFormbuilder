import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan";
import { connectDB } from "./config/database"
import authRoutes from "./routes/auth"
import formRoutes from "./routes/forms"
import submissionRoutes from "./routes/submissions"


dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ limit: "50mb", extended: true }))
app.use(morgan("dev"));


// Connect to database
connectDB()

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/forms", formRoutes)
app.use("/api/submissions", submissionRoutes)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
