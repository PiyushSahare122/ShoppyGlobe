import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"; 
import axios from "axios"; 

// Initial state for the shopping products slice
const initialState = {
  isLoading: false, 
  productList: [], 
  productDetails: null, 
};

// Async thunk for fetching all filtered products
export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams }) => {
    console.log(fetchAllFilteredProducts, "fetchAllFilteredProducts");

    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams, 
    });

    const result = await axios.get(
      `http://localhost:5000/api/shop/products/get?${query}` 
    );

    console.log(result); 

    return result?.data; 
  }
);

// Async thunk for fetching product details
export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await axios.get(
      `http://localhost:5000/api/shop/products/get/${id}` 
    );

    return result?.data; 
  }
);

// Creating the shopping product slice
const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState, 
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null; 
    },
  },
  extraReducers: (builder) => {
    builder
      // Handling the pending state for fetching all filtered products
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true; 
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false; 
        state.productList = action.payload.data; 
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false; 
        state.productList = []; 
      })
      // Handling the pending state for fetching product details
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true; 
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false; 
        state.productDetails = action.payload.data; 
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false; 
        state.productDetails = null; 
      });
  },
});


export const { setProductDetails } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
