import express from "express"; 
import mongoose from "mongoose"; 
import cookieParser from "cookie-parser"; 
import cors from "cors"; 
import authRouter from "./routes/auth-routes.js"; 
import shopProductsRouter from "./routes/products-routes.js"; 
import shopCartRouter from "./routes/cart-routes.js"; 
import shopOrderRouter from "./routes/order-routes.js"; 
import path from "path";

// Connect to MongoDB using Mongoose
mongoose
  .connect("mongodb+srv://piyushsahare122:OgRNYX5bbdqZc0g0@cluster0.bqdtn.mongodb.net/") // Connection string 
  .then(() => console.log("MongoDB connected")) 
  .catch((error) => console.log(error)); 

// Create an instance of an Express application
const app = express();
const PORT = process.env.PORT || 5000; 
const _dirname = path.resolve();

// Middleware configuration
app.use(
  cors({
    origin: "https://shoppyglobe-m3yk.onrender.com", // Specify the allowed origin for CORS
    methods: ["GET", "POST", "DELETE", "PUT"], // Allow these HTTP methods
    allowedHeaders: [
      "Content-Type", 
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true, // Allow credentials (like cookies) to be sent
  })
);

app.use(cookieParser()); // Use cookie-parser middleware to parse cookies
app.use(express.json()); // Parse incoming JSON requests

// Define routes
app.use("/api/auth", authRouter); 
app.use("/api/shop/products", shopProductsRouter); 
app.use("/api/shop/cart", shopCartRouter); 
app.use("/api/shop/order", shopOrderRouter); 

app.use(express.static(path.join(_dirname,"/frontend/dist")));
app.get('*',(req,res)=>{
    res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"));
})

// Start the server and listen on the specified PORT
app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
