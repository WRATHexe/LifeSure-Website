import { createBrowserRouter } from "react-router";
import DashboardLayout from "../layouts/DashboardLayout";
import RootLayout from "../layouts/RootLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import AllPolicies from "../pages/General/Allpolicies";
import Blog from "../pages/General/blog";
import Home from "../pages/General/Home";
import PrivateRoute from "./PrivateRoute";

// Dashboard Pages
import AddPolicy from "../pages/Dashboard/Admin/addPolicy";
import AdminPolicies from "../pages/Dashboard/Admin/AdminPolicies";
import AdminAgents from "../pages/Dashboard/Admin/Agents";
import AdminApplications from "../pages/Dashboard/Admin/Applications";
import AdminTransactions from "../pages/Dashboard/Admin/Transactions";
import AdminUsers from "../pages/Dashboard/Admin/Users";
import AgentBlogs from "../pages/Dashboard/Agent/Blogs";
import CreateBlogPost from "../pages/Dashboard/Agent/CreateBlogPost";
import AgentCustomers from "../pages/Dashboard/Agent/Customers";
import CustomerClaims from "../pages/Dashboard/Customer/Claims";
import PaymentPage from "../pages/Dashboard/Customer/PaymentPage";
import CustomerPayments from "../pages/Dashboard/Customer/Payments";
import CustomerPolicies from "../pages/Dashboard/Customer/Policies";
import CustomerReviews from "../pages/Dashboard/Customer/Reviews";
import DashboardOverview from "../pages/Dashboard/DashboardOverview";
import DashboardHelp from "../pages/Dashboard/Help";
import DashboardProfile from "../pages/Dashboard/Profile";
import DashboardSettings from "../pages/Dashboard/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "Policies",
        element: <AllPolicies />,
      },
      {
        path: "blog",
        element: <Blog />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardOverview />,
      },
      // Admin Routes
      {
        path: "admin/applications",
        element: <AdminApplications />,
      },
      {
        path: "admin/users",
        element: <AdminUsers />,
      },
      {
        path: "admin/policies",
        element: <AdminPolicies />,
      },
      {
        path: "admin/policies/add",
        element: <AddPolicy />,
      },
      {
        path: "admin/transactions",
        element: <AdminTransactions />,
      },
      {
        path: "admin/agents",
        element: <AdminAgents />,
      },
      // Agent Routes
      {
        path: "agent/customers",
        element: <AgentCustomers />,
      },
      {
        path: "agent/blogs",
        element: <AgentBlogs />,
      },
      {
        path: "agent/blogs/create",
        element: <CreateBlogPost />,
      },
      // Customer Routes
      {
        path: "customer/policies",
        element: <CustomerPolicies />,
      },
      {
        path: "customer/payments",
        element: <CustomerPayments />,
      },
      {
        path: "customer/payment-page",
        element: <PaymentPage />,
      },
      {
        path: "customer/claims",
        element: <CustomerClaims />,
      },
      {
        path: "customer/reviews",
        element: <CustomerReviews />,
      },
      // General Dashboard Routes
      {
        path: "settings",
        element: <DashboardSettings />,
      },
      {
        path: "help",
        element: <DashboardHelp />,
      },
      {
        path: "profile",
        element: <DashboardProfile />,
      },
    ],
  },
]);
