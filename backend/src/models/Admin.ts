import mongoose, { Schema, type Document, type ObjectId } from "mongoose"
import bcryptjs from "bcryptjs"

 interface IAdmin extends Document {
  _id:ObjectId,
  username: string
  email:string
  password: string
  matchPassword(enteredPassword: string): Promise<boolean>
}

const AdminSchema = new Schema<IAdmin>({
  username: { type: String, required: true, unique: true , trim: true},
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
})

AdminSchema.pre<IAdmin>("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcryptjs.hash(this.password, 10)
  next()
})

AdminSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcryptjs.compare(enteredPassword, this.password)
}

export const Admin = mongoose.model<IAdmin>("Admin", AdminSchema)
