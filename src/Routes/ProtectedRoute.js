import { Navigate } from 'react-router-dom';
import { Unauthorized } from '../Layout/Unauthorized';

const ProtectedRoute = ({ element, routeName }) => {
  const token = localStorage.getItem('token');
  const permissions = JSON.parse(localStorage.getItem("user_permissions")) || [];

  const isAuthorized = permissions.some(
    (route) => route.salesman_description === routeName
  );
  // return token ? children : <Navigate to="/Login" />;
  if (!token) {
    return <Navigate to="/" />;
  }

  if (!isAuthorized) {
    return <Unauthorized />;
  }

  return element;
};

export default ProtectedRoute