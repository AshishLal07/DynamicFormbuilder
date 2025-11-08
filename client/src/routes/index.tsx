import  { type ReactNode } from "react";
import { Navigate, Route, Routes, BrowserRouter as Router } from "react-router";
import { useAuth } from "../contexts/auth-context";
import { getAuthToken } from "../utils/authUtils";
import Login from "../pages/auth/Login";
import ProtectedRoutes from "./ProtectedRoutes";
import SignUp from "../pages/auth/SignUp";

const RequiredAuth = ({ children }: { children: ReactNode }) => {
 const auth = useAuth();
 const isLoggedIn = !!auth.user || getAuthToken();
    
 // things to look out for later check if userLogin, and does it need to allow to redirect back if its goes to signup after login

 return isLoggedIn ? children : (
   <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
};


const CustomRoutes = () => {
 return (
  <>
  <Router>
    <Routes>
        <Route path="/signUp" element={<SignUp />}/>
        <Route path="/login" element={<Login />} />
        <Route
        path="/*"
        element={
        <RequiredAuth>
        <ProtectedRoutes />
        </RequiredAuth>
        }
        />
    </Routes>
   </Router>
  </>
 );
};

export default CustomRoutes;
