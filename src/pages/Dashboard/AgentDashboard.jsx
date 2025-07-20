import { useQuery } from "@tanstack/react-query";
import {
  FaCheckCircle,
  FaClock,
  FaFileAlt,
  FaUserFriends,
  FaUserPlus,
} from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AgentDashboard = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch agent dashboard stats
  const { data, isLoading } = useQuery({
    queryKey: ["agent-dashboard-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/agent/dashboard-stats");
      return res.data.stats;
    },
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome! Here’s an overview of your assigned customers and
          applications.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <FaUserFriends className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Assigned Customers
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? "..." : data?.assignedCustomers ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <FaFileAlt className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Applications</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? "..." : data?.totalApplications ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <FaClock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Pending Applications
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? "..." : data?.pendingApplications ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-200">
              <FaCheckCircle className="h-6 w-6 text-green-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Approved Applications
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? "..." : data?.approvedApplications ?? 0}
              </p>
            </div>
          </div>
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
                Application approved for a customer
              </p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FaUserPlus className="h-5 w-5 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                New customer assigned
              </p>
              <p className="text-sm text-gray-500">4 hours ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FaClock className="h-5 w-5 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Application pending review
              </p>
              <p className="text-sm text-gray-500">6 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
