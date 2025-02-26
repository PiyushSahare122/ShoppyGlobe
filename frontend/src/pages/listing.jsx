import ProductFilter from "@/components/filter"; 
import ProductDetailsDialog from "@/components/product-details"; 
import ShoppingProductTile from "@/components/product-tile"; 
import { Button } from "@/components/ui/button"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; 
import { useToast } from "@/components/ui/use-toast"; 
import { addToCart, fetchCartItems } from "@/redux/cart-slice"; 
import { fetchAllFilteredProducts, fetchProductDetails } from "@/redux/products-slice"; 
import { ArrowUpDownIcon } from "lucide-react"; 
import { useEffect, useState } from "react"; 
import { useDispatch, useSelector } from "react-redux"; 
import { useSearchParams } from "react-router-dom"; 

// Helper function to create query parameters from filter options
function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(","); 
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`); 
    }
  }

  console.log(queryParams, "queryParams"); 

  return queryParams.join("&"); 
}

function ShoppingListing() {
  const dispatch = useDispatch(); 
  const { productList, productDetails } = useSelector( 
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart); 
  const { user } = useSelector((state) => state.auth); 
  const [filters, setFilters] = useState({}); 
  const [sort, setSort] = useState(null); 
  const [searchParams, setSearchParams] = useSearchParams(); 
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false); 
  const { toast } = useToast(); 

  const categorySearchParam = searchParams.get("category"); 

  // Sort options available for selection
  const sortOptions = [
    { id: "price-lowtohigh", label: "Price: Low to High" },
    { id: "price-hightolow", label: "Price: High to Low" },
    { id: "title-atoz", label: "Title: A to Z" },
    { id: "title-ztoa", label: "Title: Z to A" },
  ];

  // Function to handle the selection of sort option
  function handleSort(value) {
    setSort(value);
  }

  // Function to handle filtering of products
  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters }; 
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId); 

    if (indexOfCurrentSection === -1) {
      // If the section does not exist, add it
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      // If the section exists, check for the current option
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption);
      if (indexOfCurrentOption === -1) {
        
        cpyFilters[getSectionId].push(getCurrentOption);
      } else {
        
        cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }

    setFilters(cpyFilters); // Update filters state
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters)); 
  }

  // Function to fetch details of a selected product
  function handleGetProductDetails(getCurrentProductId) {
    console.log(getCurrentProductId); 
    dispatch(fetchProductDetails(getCurrentProductId)); 
  }

  // Function to add a product to the cart
  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    console.log(cartItems); 
    let getCartItems = cartItems.items || []; 

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex( 
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity; 
        if (getQuantity + 1 > getTotalStock) {
          // Check if adding another item exceeds stock
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`, 
            variant: "destructive",
          });
          return;
        }
      }
    }

    // Dispatch action to add product to cart
    dispatch(
      addToCart({
        userId: user?.id, // User ID
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

  // Effect to set default sort and load filters on category change
  useEffect(() => {
    setSort("price-lowtohigh"); // Set default sort
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {}); 
  }, [categorySearchParam]); 

  // Effect to update search parameters based on filters
  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters); 
      setSearchParams(new URLSearchParams(createQueryString)); 
    }
  }, [filters]); 

  // Effect to fetch filtered products based on filters and sort options
  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }) 
      );
  }, [dispatch, sort, filters]); 

  // Effect to open product details dialog if product details are available
  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true); 
  }, [productDetails]); 

  console.log(productList, "productListproductListproductList"); 

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} /> 
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2> 
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length} Products 
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => ( 
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label} 
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList && productList.length > 0
            ? productList.map((productItem) => ( 
                <ShoppingProductTile
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                  key={productItem.id} 
                />
              ))
            : null}
        </div>
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog} 
        setOpen={setOpenDetailsDialog} 
        productDetails={productDetails} 
      />
    </div>
  );
}

export default ShoppingListing; 
