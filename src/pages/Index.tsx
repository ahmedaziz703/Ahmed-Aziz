import { Outlet, useNavigate } from "react-router-dom";
import Home from "./Home";

const Index = () => {
  const navigate = useNavigate();
  
  // If we're on the exact index path, render the Home component
  // Otherwise, render the Outlet (for nested routes)
  const isExactIndexPath = window.location.pathname === "/";
  
  return (
    <>
      {isExactIndexPath ? <Home /> : <Outlet />}
    </>
  );
};

export default Index;
