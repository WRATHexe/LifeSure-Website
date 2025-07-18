import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaTrash, FaUser, FaUserShield, FaUserTie } from "react-icons/fa";
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
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">#</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Role</th>
              <th className="px-4 py-2 border-b">Registered</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-red-600">
                  Failed to load users.
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user, idx) => (
                <tr key={user.uid} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{idx + 1}</td>
                  <td className="px-4 py-2 border-b flex items-center gap-2">
                    <img
                      src={
                        user.photoURL ||
                        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      }
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full border"
                    />
                    {user.displayName}
                  </td>
                  <td className="px-4 py-2 border-b">{user.email}</td>
                  <td className="px-4 py-2 border-b flex items-center gap-1">
                    {roleLabels[user.role]?.icon}
                    {roleLabels[user.role]?.label}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2 border-b flex gap-2">
                    {/* Promote/Demote actions */}
                    {user.role === "customer" && (
                      <button
                        className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                        onClick={() =>
                          roleMutation.mutate({
                            uid: user.uid,
                            newRole: "agent",
                          })
                        }
                        disabled={roleMutation.isLoading}
                      >
                        Promote to Agent
                      </button>
                    )}
                    {user.role === "agent" && (
                      <button
                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                        onClick={() =>
                          roleMutation.mutate({
                            uid: user.uid,
                            newRole: "customer",
                          })
                        }
                        disabled={roleMutation.isLoading}
                      >
                        Demote to Customer
                      </button>
                    )}
                    {/* Delete user (optional, don't allow deleting admin) */}
                    {user.role !== "admin" && (
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs flex items-center gap-1"
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
                      >
                        <FaTrash /> Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
