import { Route, Routes } from "react-router-dom"; 
import AuthLayout from "./layouts/auth-layout"; 
import AuthLogin from "./pages/login"; 
import AuthRegister from "./pages/register"; 
import ShoppingLayout from "./layouts/shopping-view-layout"; 
import NotFound from "./pages/not-found"; 
import ShoppingHome from "./pages/home"; 
import ShoppingListing from "./pages/listing"; 
import ShoppingCheckout from "./pages/checkout"; 
import ShoppingAccount from "./pages/account"; 
import CheckAuth from "./components/check-auth"; 
import { useDispatch, useSelector } from "react-redux"; 
import { useEffect } from "react"; 
import { checkAuth } from "./redux/auth-slice"; 
import { Skeleton } from "@/components/ui/skeleton"; 

function App() {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth); // Accessing auth state
  const dispatch = useDispatch(); // Redux dispatch function

  useEffect(() => {
    dispatch(checkAuth()); // Check authentication on mount
  }, [dispatch]);

  if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />; 

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            />
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>
        
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
        </Route>
        
        <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}
      </Routes>
    </div>
  );
}

export default App; 
