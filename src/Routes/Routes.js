import CustomerDashboardStates from "../Components/CustomerWizard/Tabs/CustomerDashboardStates";
import CustomerDetails from "../Components/CustomerWizard/Tabs/CustomerDetails";
import CustomerDocument from "../Components/CustomerWizard/Tabs/CustomerDocument";
import CustomerFollowups from "../Components/CustomerWizard/Tabs/CustomerFollowups";
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
import MainDashboard from "../Pages/Dashboard/TeamLeaderDashboard/MainDashboard";
import FollowupList from "../Pages/Masters/Followup/FollowupList";
import ManageFollowup from "../Pages/Masters/Followup/ManageFollowup";
import ManageTarget from "../Pages/Masters/ManageTarget";
import ManageUsers from "../Pages/Masters/UsersManagement/ManageUsers";
import UserPermissions from "../Pages/Masters/UsersManagement/UserPermissions";
import AllBusinessesReport from "../Pages/Reports/AllBusinessesReport";
import AllNoRecentOrdersReport from "../Pages/Reports/AllNoRecentOrdersReport";
import AllOrders from "../Pages/Reports/AllOrders";
import AllSalesmanReport from "../Pages/Reports/AllSalesmanReport";
import FollowupReport from "../Pages/Reports/FollowupReport";
import FullOrdersReport from "../Pages/Reports/FullOrdersReport";
import NoRecendsOrderReports from "../Pages/Reports/NoRecendsOrderReports";
import OrderByStatusReport from "../Pages/Reports/OrderByStatusReport";
import TargetReport from "../Pages/Reports/TargetReport";
import CreateRequest from "../Pages/RequestInquiry/CreateRequest";
import RequestPartList from "../Pages/RequestInquiry/RequestPartList";
import SalesmanRequestPartList from "../Pages/RequestInquiry/SalesmanRequestPartList";
import OEPartDetails from "../Pages/Search/OEPartDetails";
import SearchOEParts from "../Pages/Search/SearchOEParts";

const routes = [
  ////////////////////// Dashboard Routing ///////////////////////////
  { path: "/", element: <MainDashboard />, routeName: "/" },
  { path: "/Dashboad/SalesmanDashboard", element: <Dashboard />, routeName: "/Dashboad/SalesmanDashboard" },

  ////////////////////// Business Routing ///////////////////////////
  { path: "/Salesman/AllBusinesses", element: <AllBusinesses />, routeName: "/Salesman/AllBusinesses" },
  { path: "/Salesman/AllBusinesses/:status", element: <AllBusinesses />, routeName: "/Salesman/AllBusinesses" },
  { path: "/BusinessDetails/:business_id?", element: <BusinessDetails />, routeName: "/BusinessDetails" },

  ////////////////////// Orders Routing ///////////////////////////
  { path: "/BusinessOrders", element: <BusinessOrders />, routeName: "/BusinessOrders" },
  { path: "/OrderInfo/:business_order_id?/:secret_order_id?/:business_order_business_id?", element: <OrderInfo />, routeName: "/OrderInfo" },
  { path: "/ViewOrderInvoice/:secret_order_id?/:business_order_business_id?", element: <ViewOrderInvoice />, routeName: "/ViewOrderInvoice" },

  ////////////////////// Customer Dashboard Routing ///////////////////////////
  { path: "/CustomerDashboard/:business_id?", element: <CustomerDashboardStates />, routeName: "/CustomerDashboard" },
  { path: "/CustomerInfo/:business_id?", element: <CustomerDetails />, routeName: "/CustomerInfo" },
  { path: "/CustomerDocument/:business_id?", element: <CustomerDocument />, routeName: "/CustomerDocument" },
  { path: "/CustomerBrands/:business_id?", element: <CustomerSelectedBrands />, routeName: "/CustomerBrands" },
  { path: "/CustomerOrders/:business_id?", element: <CustomerOrders />, routeName: "/CustomerOrders" },
  { path: "/CustomerRequestCreditLimit/:business_id?", element: <CustomerRequestedCreditLimit />, routeName: "/CustomerRequestCreditLimit" },
  { path: "/CustomerRequestDueDays/:business_id?", element: <CustomerRequestedDueDays />, routeName: "/CustomerRequestDueDays" },
  { path: "/CustomerFollowups/:business_id?", element: <CustomerFollowups />, routeName: "/CustomerFollowups" },

  ////////////////////// Reports Routing ///////////////////////////
  { path: "/Reports/SalesmanOrders", element: <AllOrders />, routeName: "/Reports/SalesmanOrders" },
  { path: "/Reports/SalesmanOrders/:status?", element: <AllOrders />, routeName: "/Reports/SalesmanOrders" },
  { path: "/Reports/TargetReport", element: <TargetReport />, routeName: "/Reports/TargetReport" },
  { path: "/Reports/FollowupReport", element: <FollowupReport />, routeName: "/Reports/FollowupReport" },
  { path: "/Reports/FullOrdersReport", element: <FullOrdersReport />, routeName: "/Reports/FullOrdersReport" },
  { path: "/Reports/AllBusinessesReport", element: <AllBusinessesReport />, routeName: "/Reports/AllBusinessesReport" },
  { path: "/Reports/AllBusinessesReport/:status", element: <AllBusinessesReport />, routeName: "/Reports/AllBusinessesReport" },
  { path: "/Reports/AllSalesmanReport", element: <AllSalesmanReport />, routeName: "/Reports/AllSalesmanReport" },
  { path: "/Reports/OrderByStatusReport", element: <OrderByStatusReport />, routeName: "/Reports/OrderByStatusReport" },
  { path: "/Reports/OrderByStatusReport/:status?", element: <OrderByStatusReport />, routeName: "/Reports/OrderByStatusReport" },
  { path: "/Reports/NoRecendsOrderReport", element: <NoRecendsOrderReports />, routeName: "/Reports/NoRecendsOrderReport" },
  { path: "/Reports/AllNoRecentOrdersReport", element: <AllNoRecentOrdersReport />, routeName: "/Reports/AllNoRecentOrdersReport" },

  ////////////////////// Masters Routing ///////////////////////////
  { path: "/Masters/ManageTarget", element: <ManageTarget />, routeName: "/Masters/ManageTarget" },
  { path: "/Masters/ManageFollowup/:business_salesman_followup_id?/:business_id?", element: <ManageFollowup />, routeName: "/Masters/ManageFollowup" },
  { path: "/Masters/FollowupList", element: <FollowupList />, routeName: "/Masters/FollowupList" },
  { path: "/Masters/ManageUsers", element: <ManageUsers />, routeName: "/Masters/ManageUsers" },
  { path: "/UserPermissions/:business_salesman_id", element: <UserPermissions />, routeName: "/UserPermissions" },

  ////////////////////// Request Routing ///////////////////////////
  { path: "/Request/RequestPartInquiry/:inventory_part_request_id?", element: <CreateRequest />, routeName: "/Request/RequestPartInquiry" },
  { path: "/Request/RequestPartInquiryList", element: <RequestPartList />, routeName: "/Request/RequestPartInquiryList" },
  { path: "/Request/SalesmanRequestPartList", element: <SalesmanRequestPartList />, routeName: "/Request/SalesmanRequestPartList" },

  ////////////////////// Search Routing ///////////////////////////
  { path: "/Search/SearchOEParts", element: <SearchOEParts />, routeName: "/Search/SearchOEParts" },
  { path: "/Search/OEPartDetails", element: <OEPartDetails />, routeName: "/Search/OEPartDetails" },

];

export default routes;
