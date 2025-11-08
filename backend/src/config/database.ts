import mongoose from "mongoose"

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb+srv://ashishc899_swap_slot:Swapslot19@cluster0.j5kuzim.mongodb.net/"
    await mongoose.connect(mongoUri)
    console.log("MongoDB connected")
  } catch (error) {
    console.error("Database connection error:", error)
    process.exit(1)
  }
}
