import { useQuery } from "@tanstack/react-query";
import {
  FaCheckCircle,
  FaClock,
  FaDollarSign,
  FaFileContract,
  FaFileMedical,
  FaShieldAlt,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const CustomerDashboard = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch customer dashboard stats
  const { data, isLoading, error } = useQuery({
    queryKey: ["customer-dashboard-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/customer/dashboard-stats");
      return res.data.stats;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <FaSpinner className="animate-spin text-4xl text-blue-600 mr-3" />
        <span className="text-gray-600 text-lg">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <FaTimes className="text-4xl text-red-600 mr-3" />
        <span className="text-gray-600 text-lg">Failed to load dashboard</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customer Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome! Here’s a summary of your insurance policies and activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <FaShieldAlt className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Active Policies
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {data?.activePolicies ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <FaDollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Paid</p>
              <p className="text-2xl font-bold text-gray-900">
                ${data?.totalPaid?.toLocaleString() ?? "0"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <FaFileMedical className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Pending Claims
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {data?.pendingClaims ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <FaFileContract className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Applications</p>
              <p className="text-2xl font-bold text-gray-900">
                {data?.totalApplications ?? 0}
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
                Payment completed for a policy
              </p>
              <p className="text-sm text-gray-500">2 days ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FaFileContract className="h-5 w-5 text-purple-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                New policy application submitted
              </p>
              <p className="text-sm text-gray-500">5 days ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FaClock className="h-5 w-5 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Claim pending review
              </p>
              <p className="text-sm text-gray-500">1 week ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Application Feedback (conditionally rendered) */}
      {data?.applications?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            My Policy Applications
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Policy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Feedback
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.applications.map((application) => (
                  <tr key={application._id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {application.policyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {new Date(
                        application.submittedAt || application.createdAt
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {application.status === "approved" && (
                        <span className="text-xs font-semibold text-green-600 bg-green-100 rounded-full px-3 py-1">
                          Approved
                        </span>
                      )}
                      {application.status === "pending" && (
                        <span className="text-xs font-semibold text-yellow-600 bg-yellow-100 rounded-full px-3 py-1">
                          Pending
                        </span>
                      )}
                      {application.status === "rejected" && (
                        <span className="text-xs font-semibold text-red-600 bg-red-100 rounded-full px-3 py-1">
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {application.status === "rejected" &&
                      (application.rejectionFeedback ||
                        application.rejectionReason) ? (
                        <div className="flex items-start space-x-2 bg-red-50 border border-red-200 rounded-lg p-3">
                          <FaTimes className="mt-1 text-red-500 flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-red-700 mb-1">
                              Admin Feedback
                            </div>
                            <div className="text-red-700 text-sm">
                              {application.rejectionFeedback ||
                                application.rejectionReason}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
