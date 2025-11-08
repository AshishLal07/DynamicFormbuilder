import express, { type Request, type Response } from "express"
import JWT from "jsonwebtoken"
import { Admin } from "../models/Admin"
import { authMiddleware } from "../middleware/auth"

const router = express.Router()

// Admin login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const {  password, email } = req.body

    if ( !password || !email) {
      return res.status(400).json({ error: "Username and password required" })
    }

    let admin = await Admin.findOne({ email })

    if (!admin) {
      // Create default admin on first login attempt
      return res.status(400).json({ error: "Try signing up!, User not exist" })

    }
   const isMatch = await admin.matchPassword(password)  
 
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = JWT.sign({ _id: admin._id }, process.env.JWT_SECRET || "secret-key", {
      expiresIn: "24h",
    })
    // data:{token, admin:{name:admin.username, _id:admin._id, email:admin.email}}
    res.json({ message: "User created successfully", status: 200, data: { token, admin: { name: admin.username, _id: admin._id, email: admin.email } } })
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Login failed" })
  }
})

router.get("/me", authMiddleware ,async (req:Request,res:Response) => {
   
  if(!req._id){
      return res.status(401).json({message:"Unauthorize user try again later"})
    }
    const user = await Admin.findById(req._id);
    if(!user){
      return res.status(401).json({message: "Unauthorize user try again later"})
    }
    
    return res.status(200).json({message:"Verified sucessfully", data:{id:user._id ,name:user.username ,email:user.email}});

})

router.post("/signUp", async (req: Request, res: Response) => {
  try {
    const { username, email, password, } =
      req.body;

    if (
      !username ||
      !email ||
      !password
    ) {
      return res
        .status(422)
        .json({ status: 400, error: "All fields are required" });
    }


    const userExist = await Admin.findOne({ username });
    if (userExist) {
      return res.status(400).json({
        message: "User Already exist, please login",
        status: 400,
      });
    }
    //create the role by
    let newUser = await Admin.create({ username, email: email.toLowerCase(), password });


    // const token = await TokenGenerator(newUser._id);    
    const token = JWT.sign({ _id: newUser._id }, process.env.JWT_SECRET || "secret-key", {
      expiresIn: "7d",
    });

    return res
      .status(200)
      .json({ message: "User created successfully", status: 200, data: { token, user: { name: username, _id: newUser._id, email } } });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Sign up failed" })

  }
});


export default router
