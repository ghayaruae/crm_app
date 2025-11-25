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

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const isAuthorized = permissions.some(
    (p) => p.salesman_description === routeName
  );

  if (isAuthorized) {
    return element;
  }
  if (routeName === "/") {
    return <Navigate to="/Dashboad/SalesmanDashboard" replace />;
  }

  return <Unauthorized />;
};

export default ProtectedRoute;
