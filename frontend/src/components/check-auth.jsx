import { Navigate, useLocation } from "react-router-dom"; 

function CheckAuth({ isAuthenticated, children }) {
  const location = useLocation(); 

  console.log(location.pathname, isAuthenticated); 

  // If the user is on the root path ("/")
  if (location.pathname === "/") {
    if (!isAuthenticated) {
      // If not authenticated, redirect to login page
      return <Navigate to="/auth/login" />;
    } else {
      // If authenticated, redirect to home page
      return <Navigate to="/shop/home" />;
    }
  }

  // Check if the user is not authenticated and is not on login or registration pages
  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
  ) {
    // Redirect to login page if user is not authenticated
    return <Navigate to="/auth/login" />;
  }

  // Check if the user is authenticated and is on login or registration pages
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
 
    return <Navigate to="/shop/home" />;
  }

 
  return <>{children}</>;
}

export default CheckAuth; 
