import axios from "axios"; 
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; 

// Initial state for the shopping cart
const initialState = {
  cartItems: [], 
  isLoading: false, 
};

// Async thunk for adding an item to the cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }) => {
    const response = await axios.post(
      "http://localhost:5000/api/shop/cart/add", 
      {
        userId,
        productId,
        quantity,
      }
    );

    return response.data; 
  }
);

// Async thunk for fetching cart items
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId) => {
    const response = await axios.get(
      `http://localhost:5000/api/shop/cart/get/${userId}` 
    );

    return response.data; 
  }
);

// Async thunk for deleting an item from the cart
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }) => {
    const response = await axios.delete(
      `http://localhost:5000/api/shop/cart/${userId}/${productId}` 
    );

    return response.data; 
  }
);

// Async thunk for updating item quantity in the cart
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }) => {
    const response = await axios.put(
      "http://localhost:5000/api/shop/cart/update-cart", 
      {
        userId,
        productId,
        quantity,
      }
    );

    return response.data; 
  }
);

// Creating the shopping cart slice
const shoppingCartSlice = createSlice({
  name: "shoppingCart", 
  initialState, 
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      // Handling adding item to cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true; 
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false; 
        state.cartItems = action.payload.data; 
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false; 
        state.cartItems = []; 
      })
      // Handling fetching cart items
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true; 
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false; 
        state.cartItems = action.payload.data; 
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false; 
        state.cartItems = []; 
      })
      // Handling updating cart item quantity
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true; 
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false; 
        state.cartItems = action.payload.data; 
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false; 
        state.cartItems = []; 
      })
      // Handling deleting cart item
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true; 
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false; 
        state.cartItems = action.payload.data; 
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false; 
        state.cartItems = []; 
      });
  },
});


export default shoppingCartSlice.reducer;
