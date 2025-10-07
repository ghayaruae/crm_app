import CustomerDashboardStates from "../Components/CustomerWizard/Tabs/CustomerDashboardStates";
import CustomerDetails from "../Components/CustomerWizard/Tabs/CustomerDetails";
import CustomerDocument from "../Components/CustomerWizard/Tabs/CustomerDocument";
import CustomerOrders from "../Components/CustomerWizard/Tabs/CustomerOrders";
import CustomerRequestedCreditLimit from "../Components/CustomerWizard/Tabs/CustomerRequestedCreditLimit";
import CustomerRequestedDueDays from "../Components/CustomerWizard/Tabs/CustomerRequestedDueDays";
import CustomerSelectedBrands from "../Components/CustomerWizard/Tabs/CustomerSelectedBrands";
import ViewOrderInvoice from "../Components/ViewOrderInvoice";
import AllBusinesses from "../Pages/Business/AllBusinesses";
import BusinessDetails from "../Pages/Business/BusinessDetails";
import BusinessOrders from "../Pages/Business/Orders/BusinessOrders";
import OrderInfo from "../Pages/Business/Orders/OrderInfo";
import Dashboard from "../Pages/Dashboard/Dashboard";
import AllOrders from "../Pages/SalesReports/AllOrders";


const routes = [
  ////////////////////// Dashboard Routing ///////////////////////////
  { path: "/", element: <Dashboard /> },


  ////////////////////// Business Routing ///////////////////////////
  { path: "/AllBusinesses", element: <AllBusinesses /> },
  { path: "/BusinessDetails/:business_id?", element: <BusinessDetails /> },


  ////////////////////// Orders Routing ///////////////////////////
  { path: "/BusinessOrders", element: <BusinessOrders /> },
  { path: "/OrderInfo/:business_order_id?", element: <OrderInfo /> },
  { path: "/ViewOrderInvoice/:business_order_id?", element: <ViewOrderInvoice /> },


  ////////////////////// Customer Dashboard Routing ///////////////////////////
  { path: "/CustomerDashboard/:business_id?", element: <CustomerDashboardStates /> },
  { path: "/CustomerInfo/:business_id?", element: <CustomerDetails /> },
  { path: "/CustomerDocument/:business_id?", element: <CustomerDocument /> },
  { path: "/CustomerBrands/:business_id?", element: <CustomerSelectedBrands /> },
  { path: "/CustomerOrders/:business_id?", element: <CustomerOrders /> },
  { path: "/CustomerRequestCreditLimit/:business_id?", element: <CustomerRequestedCreditLimit /> },
  { path: "/CustomerRequestDueDays/:business_id?", element: <CustomerRequestedDueDays /> },


  ////////////////////// Customer Dashboard Routing ///////////////////////////
  { path: "/AllOrders", element: <AllOrders /> },

];

export default routes;