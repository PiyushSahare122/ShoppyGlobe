import mongoose from "mongoose"; 

// Define the Cart schema
const CartSchema = new mongoose.Schema(
  {
    // The ID of the user who owns this cart
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: "User", // The name of the model being referenced
      required: true, 
    },
    // An array of items in the cart
    items: [
      {
        // The ID of the product added to the cart
        productId: {
          type: mongoose.Schema.Types.ObjectId, // Reference to the Product model
          ref: "Product", // The name of the model being referenced
          required: true,
        },
        // The quantity of the product in the cart
        quantity: {
          type: Number, 
          required: true, 
          min: 1, 
        },
      },
    ],
  },
  {
    // Enable timestamps for createdAt and updatedAt fields
    timestamps: true,
  }
);


export default mongoose.model("Cart", CartSchema);
