import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Helmet } from "react-helmet";
import {
  FaArrowLeft,
  FaBars,
  FaClipboardList,
  FaCreditCard,
  FaFileContract,
  FaHome,
  FaQuestionCircle,
  FaSignOutAlt,
  FaTachometerAlt,
  FaTimes,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UseAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";

const AdminDashboardLayout = () => {
  const { user, logOut } = UseAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // Fetch user role from backend
  const { data: _userProfile } = useQuery({
    queryKey: ["user-profile", user?.uid],
    queryFn: async () => {
      const response = await axiosSecure.get(`/users/${user?.uid}`);
      return response.data;
    },
    enabled: !!user?.uid,
    retry: 1,
  });

  // Navigation items for admin
  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard/admin",
      icon: FaTachometerAlt,
      current: location.pathname === "/dashboard/admin",
    },
    {
      name: "Profile",
      href: "/dashboard/admin/profile",
      icon: FaUserTie,
      current: location.pathname === "/dashboard/admin/profile",
    },
    {
      name: "Manage Applications",
      href: "/dashboard/admin/applications",
      icon: FaClipboardList,
      current: location.pathname.includes("/dashboard/admin/applications"),
    },
    {
      name: "Manage Users",
      href: "/dashboard/admin/users",
      icon: FaUsers,
      current: location.pathname.includes("/dashboard/admin/users"),
    },
    {
      name: "Manage Policies",
      href: "/dashboard/admin/policies",
      icon: FaFileContract,
      current: location.pathname.includes("/dashboard/admin/policies"),
    },
    {
      name: "Manage Transactions",
      href: "/dashboard/admin/transactions",
      icon: FaCreditCard,
      current: location.pathname.includes("/dashboard/admin/transactions"),
    },
    {
      name: "Manage Agents",
      href: "/dashboard/admin/agents",
      icon: FaUserTie,
      current: location.pathname.includes("/dashboard/admin/agents"),
    },
    {
      name: "FAQs & Forum",
      href: "/dashboard/admin/faqs-forum",
      icon: FaQuestionCircle,
      current: location.pathname.includes("/faqs-forum"),
    },
  ];

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully! 👋");
      navigate("/");
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  // Dynamic page title based on route
  const getPageTitle = () => {
    if (location.pathname === "/dashboard/admin") return "Admin Dashboard";
    const last = location.pathname.split("/").pop();
    return (
      (last?.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()) ||
        "Dashboard") + " | Admin"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Helmet>
        <title>{getPageTitle()} | LifeSure</title>
      </Helmet>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:block`}
      >
        {/* Logo & Brand */}
        <div className="flex items-center justify-between h-20 px-6 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-lg">
          <Link to="/" className="flex items-center group">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-3 shadow-lg group-hover:scale-105 transition-transform duration-300">
              <span className="text-blue-600 font-bold text-xl">L</span>
            </div>
            <div>
              <span className="text-white text-xl font-bold block">
                LifeSure
              </span>
              <span className="text-blue-200 text-xs">Admin Dashboard</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-blue-200 transition-colors duration-200"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-6 bg-gradient-to-b from-blue-50 to-white border-b border-gray-200">
          <div className="flex items-center">
            <div className="relative">
              <img
                src={
                  user?.photoURL ||
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
                alt={user?.displayName || "Admin"}
                className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                onError={(e) => {
                  e.target.src =
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white bg-red-500"></div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-lg font-semibold text-gray-900">
                {user?.displayName || "Admin"}
              </p>
              <p className="text-sm text-gray-600">{user?.email}</p>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 bg-red-100 text-red-800">
                Admin
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  item.current
                    ? "bg-blue-600 text-white shadow-lg transform scale-105"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:scale-105"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon
                  className={`mr-4 w-5 h-5 ${
                    item.current
                      ? "text-white"
                      : "text-gray-400 group-hover:text-blue-600"
                  }`}
                />
                {item.name}
                {item.current && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
            );
          })}

          {/* Quick Links Section */}
          <div className="pt-8">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <div className="space-y-2">
              <Link
                to="/"
                className="group flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-blue-700 transition-colors duration-200"
                onClick={() => setSidebarOpen(false)}
              >
                <FaHome className="mr-3 w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                Back to Website
              </Link>
              <Link
                to="/policies"
                className="group flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-blue-700 transition-colors duration-200"
                onClick={() => setSidebarOpen(false)}
              >
                <FaFileContract className="mr-3 w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                Browse Policies
              </Link>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="pt-8 mt-8 border-t border-gray-200 space-y-2">
            <button
              onClick={handleLogout}
              className="group flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
            >
              <FaSignOutAlt className="mr-3 w-5 h-5" />
              Sign Out
            </button>
          </div>
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button & Back button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              >
                <FaBars className="w-5 h-5" />
              </button>

              {/* Back to website button - visible on desktop */}
              <Link
                to="/"
                className="hidden lg:flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              >
                <FaArrowLeft className="w-4 h-4 mr-2" />
                Back to Website
              </Link>
            </div>

            {/* Page title */}
            <div className="flex-1 px-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {location.pathname === "/dashboard/admin"
                  ? "Admin Dashboard"
                  : location.pathname
                      .split("/")
                      .pop()
                      ?.replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
              </h1>
            </div>

            {/* Header actions */}
            <div className="flex items-center space-x-4">
              {/* User profile */}
              <Link
                to="/dashboard/admin/profile"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <img
                  src={
                    user?.photoURL ||
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  }
                  alt={user?.displayName || "Admin"}
                  className="w-8 h-8 rounded-full border border-gray-200"
                  onError={(e) => {
                    e.target.src =
                      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
                  }}
                />
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.displayName || "Admin"}
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 bg-gray-50">
          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </main>

        {/* Simple footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
            <p>&copy; 2024 LifeSure Insurance. All rights reserved.</p>
            <div className="flex space-x-6 mt-2 sm:mt-0">
              <Link
                to="/privacy"
                className="hover:text-blue-600 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="hover:text-blue-600 transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                to="/support"
                className="hover:text-blue-600 transition-colors duration-200"
              >
                Support
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
