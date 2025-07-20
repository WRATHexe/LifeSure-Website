import { createBrowserRouter } from "react-router";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import AgentDashboardLayout from "../layouts/AgentDashboardLayout";
import CustomerDashboardLayout from "../layouts/CustomerDashboardLayout";
import RootLayout from "../layouts/RootLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import AllPolicies from "../pages/General/Allpolicies";
import ApplicationForm from "../pages/General/ApplicationForm";
import Blog from "../pages/General/blog";
import Home from "../pages/General/Home";
import PrivateRoute from "./PrivateRoute";

// Dashboard Pages
import AdminPolicies from "../pages/Dashboard/Admin/AdminPolicies";
import AdminAgents from "../pages/Dashboard/Admin/Agents";
import AdminApplications from "../pages/Dashboard/Admin/Applications";
import AdminTransactions from "../pages/Dashboard/Admin/Transactions";
import AdminUsers from "../pages/Dashboard/Admin/Users";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import CreateBlogPost from "../pages/Dashboard/Agent/BlogFormModal";
import AgentBlogs from "../pages/Dashboard/Agent/Blogs";
import AgentCustomers from "../pages/Dashboard/Agent/Customers";
import AgentDashboard from "../pages/Dashboard/AgentDashboard";
import CustomerClaims from "../pages/Dashboard/Customer/Claims";
import PaymentPage from "../pages/Dashboard/Customer/PaymentPage";
import CustomerPayments from "../pages/Dashboard/Customer/Payments";
import CustomerPolicies from "../pages/Dashboard/Customer/Policies";
import CustomerReviews from "../pages/Dashboard/Customer/Reviews";
import CustomerDashboard from "../pages/Dashboard/CustomerDashboard";
import Profile from "../pages/Dashboard/Profile";
import PolicyDetails from "../pages/General/PolicyDetails";
import QuotePage from "../pages/General/QuotePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "policies", element: <AllPolicies /> },
      { path: "policies/:id", element: <PolicyDetails /> },
      {
        path: "application/:policyId",
        element: (
          <PrivateRoute>
            <ApplicationForm />
          </PrivateRoute>
        ),
      },
      { path: "blog", element: <Blog /> },
      { path: "quote/:policyId", element: <QuotePage /> },
    ],
  },

  // Admin Dashboard
  {
    path: "/dashboard/admin",
    element: (
      <PrivateRoute>
        <AdminDashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "applications", element: <AdminApplications /> },
      { path: "users", element: <AdminUsers /> },
      { path: "policies", element: <AdminPolicies /> },
      { path: "transactions", element: <AdminTransactions /> },
      { path: "agents", element: <AdminAgents /> },
      { path: "profile", element: <Profile /> },
    ],
  },

  // Agent Dashboard
  {
    path: "/dashboard/agent",
    element: (
      <PrivateRoute>
        <AgentDashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <AgentDashboard /> },
      { path: "customers", element: <AgentCustomers /> },
      { path: "blogs", element: <AgentBlogs /> },
      { path: "blogs/create", element: <CreateBlogPost /> },
      { path: "profile", element: <Profile /> },
    ],
  },

  // Customer Dashboard
  {
    path: "/dashboard/customer",
    element: (
      <PrivateRoute>
        <CustomerDashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <CustomerDashboard /> },
      { path: "policies", element: <CustomerPolicies /> },
      { path: "payments", element: <CustomerPayments /> },
      { path: "payment-page", element: <PaymentPage /> },
      { path: "claims", element: <CustomerClaims /> },
      { path: "reviews", element: <CustomerReviews /> },
      { path: "profile", element: <Profile /> },
    ],
  },
]);
