import Cart from "../models/Cart.js"; 
import Product from "../models/Product.js"; 

// Add to Cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body; 

    // Validate input data
    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    // Check if the product exists in the database
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] }); 
    }

    // Check if the product is already in the cart
    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId 
    );

    // If the product is not in the cart, add it
    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity }); 
    } else {
      // If it exists, update the quantity
      cart.items[findCurrentProductIndex].quantity += quantity; 
    }

    // Save the cart with updated items
    await cart.save();
    res.status(200).json({
      success: true,
      data: cart, 
    });
  } catch (error) {
    console.log(error); 
    res.status(500).json({
      success: false,
      message: "Error", 
    });
  }
};

// Fetch Cart Items
export const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params; 

    // Validate user ID
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is mandatory!",
      });
    }

    
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice", 
    });

    // Check if cart exists
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    // Filter out invalid items (products that no longer exist)
    const validItems = cart.items.filter((productItem) => productItem.productId);
    if (validItems.length < cart.items.length) {
      cart.items = validItems; 
      await cart.save(); 
    }

    // Map valid items to a structured response
    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    // Respond with the populated cart details
    res.status(200).json({
      success: true,
      data: {
        ...cart._doc, 
        items: populateCartItems, 
      },
    });
  } catch (error) {
    console.log(error); 
    res.status(500).json({
      success: false,
      message: "Error", 
    });
  }
};

// Update Cart Item Quantity
export const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body; 

    // Validate input data
    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    // Check if the product is in the cart
    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId 
    );

    // If the product is not found, return an error
    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present!",
      });
    }

    // Update the quantity of the product
    cart.items[findCurrentProductIndex].quantity = quantity; 
    await cart.save(); 

    // Populate the cart items with product details
    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    // Map items to a structured response
    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    // Respond with the updated cart details
    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error); 
    res.status(500).json({
      success: false,
      message: "Error", 
    });
  }
};

// Delete Cart Item
export const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params; // Get user ID and product ID from request parameters
   
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    // Find the user's cart and populate product details
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    // Check if cart exists
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    // Filter out the item to be deleted
    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId 
    );

    await cart.save(); 

    // Populate the remaining items with product details
    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    // Map remaining items to a structured response
    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    // Respond with the updated cart details
    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error); 
    res.status(500).json({
      success: false,
      message: "Error", 
    });
  }
};
