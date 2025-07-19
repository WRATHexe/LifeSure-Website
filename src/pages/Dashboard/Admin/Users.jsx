import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FaEnvelope,
  FaSpinner,
  FaTrash,
  FaUser,
  FaUserShield,
  FaUserTie,
} from "react-icons/fa";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const roleLabels = {
  admin: { label: "Admin", icon: <FaUserShield className="text-red-600" /> },
  agent: { label: "Agent", icon: <FaUserTie className="text-green-600" /> },
  customer: { label: "Customer", icon: <FaUser className="text-blue-600" /> },
};

const Users = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch all users
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/users");
      return res.data.users || [];
    },
  });

  // Defensive: fallback to empty array if data is undefined
  const users = Array.isArray(data) ? data : [];

  // Promote/Demote user mutation
  const roleMutation = useMutation({
    mutationFn: async ({ uid, newRole }) => {
      await axiosSecure.patch(`/admin/users/${uid}/role`, { newRole });
    },
    onSuccess: () => {
      toast.success("Role updated!");
      queryClient.invalidateQueries(["admin-users"]);
    },
    onError: () => toast.error("Failed to update role"),
  });

  // Delete user mutation (optional)
  const deleteMutation = useMutation({
    mutationFn: async (uid) => {
      await axiosSecure.delete(`/admin/users/${uid}`);
    },
    onSuccess: () => {
      toast.success("User deleted!");
      queryClient.invalidateQueries(["admin-users"]);
    },
    onError: () => toast.error("Failed to delete user"),
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Users</h1>
        <p className="text-gray-600">
          View, promote, demote, or remove users from your platform.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <FaSpinner className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-gray-500">Loading users...</div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-red-600">
                    Failed to load users.
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr
                    key={user.uid}
                    className="hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-semibold">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={
                            user.photoURL ||
                            "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                          }
                          alt={user.displayName}
                          className="h-12 w-12 rounded-full border shadow-sm bg-gray-100 object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 max-w-[200px] truncate">
                            {user.displayName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaEnvelope className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold
                          ${
                            user.role === "admin"
                              ? "bg-red-100 text-red-700"
                              : ""
                          }
                          ${
                            user.role === "agent"
                              ? "bg-green-100 text-green-700"
                              : ""
                          }
                          ${
                            user.role === "customer"
                              ? "bg-blue-100 text-blue-700"
                              : ""
                          }
                        `}
                      >
                        {roleLabels[user.role]?.icon}
                        <span className="ml-1">
                          {roleLabels[user.role]?.label}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {user.role === "customer" && (
                          <button
                            className="px-3 py-1 bg-green-500 text-white rounded text-xs flex items-center gap-1 hover:bg-green-600 transition"
                            title="Promote to Agent"
                            onClick={() =>
                              roleMutation.mutate({
                                uid: user.uid,
                                newRole: "agent",
                              })
                            }
                            disabled={roleMutation.isLoading}
                          >
                            <FaUserTie /> Promote
                          </button>
                        )}
                        {user.role === "agent" && (
                          <button
                            className="px-3 py-1 bg-blue-500 text-white rounded text-xs flex items-center gap-1 hover:bg-blue-600 transition"
                            title="Demote to Customer"
                            onClick={() =>
                              roleMutation.mutate({
                                uid: user.uid,
                                newRole: "customer",
                              })
                            }
                            disabled={roleMutation.isLoading}
                          >
                            <FaUser /> Demote
                          </button>
                        )}
                        {user.role !== "admin" && (
                          <button
                            className="px-3 py-1 bg-red-500 text-white rounded text-xs flex items-center gap-1 hover:bg-red-600 transition"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Are you sure you want to delete ${
                                    user.displayName || user.email
                                  }?`
                                )
                              ) {
                                deleteMutation.mutate(user.uid);
                              }
                            }}
                            disabled={deleteMutation.isLoading}
                            title="Delete User"
                          >
                            <FaTrash /> Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
