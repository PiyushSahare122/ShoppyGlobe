import Product from "../models/Product.js"; 

// Get Filtered Products
export const getFilteredProducts = async (req, res) => {
  try {
    // Destructure the query parameters from the request
    const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;

    let filters = {}; // Initialize filters object

    // Check if any categories are provided, then add to filters
    if (category.length) {
      filters.category = { $in: category.split(",") }; // Split and create a filter for categories
    }

    // Check if any brands are provided, then add to filters
    if (brand.length) {
      filters.brand = { $in: brand.split(",") }; // Split and create a filter for brands
    }

    let sort = {}; // Initialize sort object

    // Determine the sorting criteria based on the sortBy parameter
    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1; 
        break;
      case "price-hightolow":
        sort.price = -1; 
        break;
      case "title-atoz":
        sort.title = 1; 
        break;
      case "title-ztoa":
        sort.title = -1; 
        break;
      default:
        sort.price = 1; 
        break;
    }

    // Find products based on filters and sort them
    const products = await Product.find(filters).sort(sort);

    // Respond with success and the retrieved products
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) { 
    console.log(error); 
    res.status(500).json({
      success: false,
      message: "Some error occurred", 
    });
  }
};

// Get Product Details
export const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params; // Get the product ID from request parameters
    const product = await Product.findById(id); 

    // Check if the product exists
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!", 
      });
    }

    // Respond with success and the product data
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) { 
    console.log(error); 
    res.status(500).json({
      success: false,
      message: "Some error occurred", 
    });
  }
};
