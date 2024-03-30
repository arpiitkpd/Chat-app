import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import connectToDb from "./db/conntectToDb.js";


dotenv.config()
const port = process.env.PORT || 5000;

const app = new express();

app.use(express.json({
    limit:"16kb" 
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.static("public"))
app.use(cookieParser())

// routes
import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import userRoutes from "./routes/user.routes.js"

// routes declaration
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/message", messageRoutes)
app.use("/api/v1/users", userRoutes)



app.listen(port, ()=>{
    // res.json("arpit");
    connectToDb();
    console.log(`port in on ${port}`);
})

