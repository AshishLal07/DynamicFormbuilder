import {  Navigate, Route, Routes } from "react-router";
import AdminDashboard from "../pages/adminDashboard/AdminDashboard";
import FormRenderer from "../components/FormRenderer";

//restriction from Public routes to no login user
const ProtectedRoutes = () => {
 


 return (
   <Routes>
    <Route path="/" element={<Navigate to="/admin/" replace />}></Route>
     <Route path="/admin/*" element={<AdminDashboard/>}/>
     <Route path="/forms/:id" element={<FormRenderer />} />
   </Routes>
 );
};

export default ProtectedRoutes;
