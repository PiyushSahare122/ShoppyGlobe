import { Button } from "@/components/ui/button";
import { BabyIcon, ChevronLeftIcon, ChevronRightIcon, CloudLightning, ShirtIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/redux/products-slice";
import ShoppingProductTile from "@/components/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/redux/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/product-details";
import bannerOne from "../assets/banner-1.jpg";
import bannerTwo from "../assets/banner-2.jpg";
import bannerThree from "../assets/banner-3.jpg";
import bannerFour from "../assets/banner-4.jpg";
// Categories with icons for display
const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const bannerImages = [bannerOne, bannerTwo, bannerThree, bannerFour];

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Categories with images for display in the category slider
  const categoriesWithImages = [
    { id: "men", label: "Men", image: "/src/assets/men.jpeg" },
    { id: "women", label: "Women", image: "/src/assets/woman.jpeg" },
    { id: "kids", label: "Kids", image: "/src/assets/kids.jpeg" }
  ];

  // Navigate to the listing page with the selected category
  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  // Fetch product details when a product is selected
  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  // Add selected product to the cart
  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  // Open product details dialog when product details are available
  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  // Fetch all filtered products on component mount
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  // Auto-slide logic for category images
  useEffect(() => {
    const categoryTimer = setInterval(() => {
      setCurrentCategoryIndex((prevIndex) => (prevIndex + 1) % categoriesWithIcon.length);
    }, 1000);

    return () => clearInterval(categoryTimer); // Clear interval on component unmount
  }, []);

  // Auto-slide logic for banner images
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % bannerImages.length);
    }, 1000);

    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner Section */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {bannerImages.map((banner, index) => (
          <img
            src={banner}
            key={index}
            className={`${index === currentSlide ? "opacity-100" : "opacity-0"} // Apply opacity based on current slide
                    absolute top-0 left-0 w-full h-full object-cover 
                    transition-opacity duration-1000`}
          />
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide - 1 + bannerImages.length) % bannerImages.length)
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide + 1) % bannerImages.length)
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>


      {/* Categories Slider Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            {categoriesWithImages.map((categoryItem, index) => (
              <div
                key={categoryItem.id}
                onClick={() => handleNavigateToListingPage(categoryItem, "category")}
                className={`relative cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow w-full max-w-xs mx-2 ${index === currentCategoryIndex ? "block" : "hidden"
                  }`}
              >
                <img
                  src={categoryItem.image}
                  alt={categoryItem.label}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {categoryItem.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Featured Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 overflow-hidden">
          <h2 className="text-3xl font-bold text-center mb-8">
            Sale is Now Live
          </h2>
          <div className="relative overflow-hidden">
            <div className="scrolling-wrapper flex animate-scroll-row">
              {productList.concat(productList).map((productItem, index) => (
                <div key={index} className="product-tile w-[300px] m-10 flex-shrink-0">
                  <ShoppingProductTile
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Dialog */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />

    </div>
  );
}

export default ShoppingHome; 
