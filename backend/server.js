require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const bookRoutes= require("./routes/bookRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI,{dbName:"BookVerse"})
.then(()=>{
    console.log("MongoDB connected successfully");
})
.catch((error)=>{
    console.log("Mongodb connection error:",error);
});
app.use("/api/books",bookRoutes);

app.get("/",(req,res)=>{
    res.send("BookVerse backend is running");
});
const PORT=5000;
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});