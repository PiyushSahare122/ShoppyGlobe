import mongoose from "mongoose"; 


const UserSchema = new mongoose.Schema({
  // Username of the user
  userName: {
    type: String,      
    required: true,    
    unique: true,      
  },
  
  // Email of the user
  email: {
    type: String,      
    required: true,    
    unique: true,      
  },
  
  // Password of the user
  password: {
    type: String,      
    required: true,    
  },
  
  // Role of the user
  role: {
    type: String,      
    default: "user",   
  },
});

// Create the User model from the schema
const User = mongoose.model("User", UserSchema);


export default User;
