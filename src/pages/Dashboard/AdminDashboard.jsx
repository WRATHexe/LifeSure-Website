import { useQuery } from "@tanstack/react-query";
import {
  FaCheckCircle,
  FaClock,
  FaDollarSign,
  FaFileContract,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch dashboard stats
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/dashboard-stats");
      return res.data.stats;
    },
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's what's happening with your insurance business.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <FaUsers className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? "..." : data?.totalUsers ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <FaFileContract className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Policies
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? "..." : data?.totalPolicies ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <FaDollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading
                  ? "..."
                  : `$${data?.totalRevenue?.toLocaleString() ?? "0"}`}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <FaUserTie className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Agents</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? "..." : data?.totalAgents ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* More stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center">
          <FaUsers className="h-5 w-5 text-blue-500 mr-3" />
          <span className="text-gray-700">
            Customers:{" "}
            <span className="font-bold">
              {isLoading ? "..." : data?.totalCustomers ?? 0}
            </span>
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center">
          <FaCheckCircle className="h-5 w-5 text-green-500 mr-3" />
          <span className="text-gray-700">
            Approved Applications:{" "}
            <span className="font-bold">
              {isLoading ? "..." : data?.approvedApplications ?? 0}
            </span>
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center">
          <FaClock className="h-5 w-5 text-yellow-500 mr-3" />
          <span className="text-gray-700">
            Pending Applications:{" "}
            <span className="font-bold">
              {isLoading ? "..." : data?.pendingApplications ?? 0}
            </span>
          </span>
        </div>
      </div>

      {/* Recent Activity (static example, replace with real data if needed) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FaCheckCircle className="h-5 w-5 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                New policy application approved
              </p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FaClock className="h-5 w-5 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Payment received from John Doe
              </p>
              <p className="text-sm text-gray-500">4 hours ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FaUsers className="h-5 w-5 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                New user registration
              </p>
              <p className="text-sm text-gray-500">6 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
