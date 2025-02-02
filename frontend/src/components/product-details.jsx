import { Button } from "./ui/button"; 
import { Dialog, DialogContent } from "./ui/dialog"; 
import { Separator } from "./ui/separator"; 
import { useDispatch, useSelector } from "react-redux"; 
import { addToCart, fetchCartItems } from "@/redux/cart-slice"; 
import { useToast } from "./ui/use-toast"; 
import { setProductDetails } from "@/redux/products-slice"; 

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const dispatch = useDispatch(); 
  const { user } = useSelector((state) => state.auth); 
  const { cartItems } = useSelector((state) => state.shopCart); 

  const { toast } = useToast(); 

  // Function to handle adding a product to the cart
  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || []; 

    // Check if there are any items in the cart
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId 
      );

      // If the item is already in the cart
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity; 

        // Check if adding one more would exceed total stock
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`, 
            variant: "destructive",
          });

          return; 
        }
      }
    }

    // Dispatch action to add the item to the cart
    dispatch(
      addToCart({
        userId: user?.id, 
        productId: getCurrentProductId, 
        quantity: 1, 
      })
    ).then((data) => {
      if (data?.payload?.success) {
        // If adding to cart was successful
        dispatch(fetchCartItems(user?.id)); 
        toast({
          title: "Product is added to cart", 
        });
      }
    });
  }

  // Function to handle closing the dialog
  function handleDialogClose() {
    setOpen(false); 
    dispatch(setProductDetails()); 
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        {/* Image section */}
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image} 
            alt={productDetails?.title} 
            width={600}
            height={600}
            className="aspect-square w-full object-cover" 
          />
        </div>
        {/* Details section */}
        <div className="">
          <div>
            <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1> 
            <p className="text-muted-foreground text-2xl mb-5 mt-4">
              {productDetails?.description} 
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : "" 
              }`}
            >
              ${productDetails?.price} 
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-muted-foreground">
                ${productDetails?.salePrice} 
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
          </div>
          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock 
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id, 
                    productDetails?.totalStock 
                  )
                }
              >
                Add to Cart 
              </Button>
            )}
          </div>
          <Separator /> 
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog; 
