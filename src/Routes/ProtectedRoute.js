// import { Navigate } from 'react-router-dom';
// import { Unauthorized } from '../Layout/Unauthorized';

// const ProtectedRoute = ({ element, routeName }) => {
//   const token = localStorage.getItem('token');
//   const permissions = JSON.parse(localStorage.getItem("user_permissions")) || [];

//   const isAuthorized = permissions.some(
//     (route) => route.salesman_description === routeName
//   );

//   if (!token) {
//     return <Navigate to="/" />;
//   }

//   if (!isAuthorized) {
//     return <Unauthorized />;
//   }

//   return element;
// };

// export default ProtectedRoute

import { Navigate } from 'react-router-dom';
import { Unauthorized } from '../Layout/Unauthorized';

const ProtectedRoute = ({ element, routeName }) => {
  const token = localStorage.getItem('token');
  const permissions = JSON.parse(localStorage.getItem("user_permissions")) || [];

  // Check login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Check permission using description (as in your setup)
  const isAuthorized = permissions.some(
    (p) => p.salesman_description === routeName
  );

  // If user has permission, render page
  if (isAuthorized) {
    return element;
  }

  // ✅ NEW LOGIC:
  // If user doesn’t have permission for "/", send to Salesman Dashboard
  if (routeName === "/") {
    return <Navigate to="/Dashboad/SalesmanDashboard" replace />;
  }

  // Otherwise, show Unauthorized page
  return <Unauthorized />;
};

export default ProtectedRoute;
