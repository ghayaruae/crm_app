import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Page404 from './Layout/Page404';
import { ConfigProvider } from '../src/Context/ConfigContext';
import routes from './Routes/Routes';
import AppLayout from './Layout/AppLayout';
import Login from './Pages/Login';
import { jwtDecode } from 'jwt-decode';
import ProtectedRoute from './Routes/ProtectedRoute';
import "flatpickr/dist/flatpickr.css";

const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }

  try {
    const decodedToken = jwtDecode(token);

    if (!decodedToken || !decodedToken.exp) {
      localStorage.clear();
      return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      localStorage.clear();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error while validating token:', error);
    localStorage.clear();
    return false;
  }
};

function App() {
  const mRoutes = isTokenValid()
    ? [

      {
        element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
        children: routes,
        errorElement: <Page404 />
      },
    ]
    : [
      { path: '/', element: <Login /> },
      { path: '*', element: <Login /> },
    ];

  const router = createBrowserRouter(mRoutes);

  return (
    <ConfigProvider>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
