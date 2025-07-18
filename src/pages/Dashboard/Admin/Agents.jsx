import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaCheck, FaTimes, FaUser, FaUserTie } from "react-icons/fa";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Agents = () => {
  const [tab, setTab] = useState("pending");
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch pending agent applications
  const { data: pending = [], isLoading: loadingPending } = useQuery({
    queryKey: ["pending-agent-applications"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/agents/pending");
      return res.data.applications || [];
    },
  });

  // Fetch all current agents
  const { data: agents = [], isLoading: loadingAgents } = useQuery({
    queryKey: ["all-agents"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/agents");
      return res.data.agents || [];
    },
  });

  // Approve agent application
  const approveMutation = useMutation({
    mutationFn: async (uid) => {
      await axiosSecure.patch(`/admin/agents/${uid}/approve`);
    },
    onSuccess: () => {
      toast.success("Agent approved!");
      queryClient.invalidateQueries(["pending-agent-applications"]);
      queryClient.invalidateQueries(["all-agents"]);
    },
    onError: () => toast.error("Failed to approve agent"),
  });

  // Reject agent application
  const rejectMutation = useMutation({
    mutationFn: async (uid) => {
      await axiosSecure.patch(`/admin/agents/${uid}/reject`);
    },
    onSuccess: () => {
      toast.info("Agent request rejected.");
      queryClient.invalidateQueries(["pending-agent-applications"]);
    },
    onError: () => toast.error("Failed to reject agent"),
  });

  // Demote agent to customer
  const demoteMutation = useMutation({
    mutationFn: async (uid) => {
      await axiosSecure.patch(`/admin/agents/${uid}/demote`);
    },
    onSuccess: () => {
      toast.success("Agent demoted to customer.");
      queryClient.invalidateQueries(["all-agents"]);
    },
    onError: () => toast.error("Failed to demote agent"),
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Agents</h2>
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold ${
            tab === "pending"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setTab("pending")}
        >
          Pending Applications
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold ${
            tab === "agents"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setTab("agents")}
        >
          All Current Agents
        </button>
      </div>

      {/* Tab Content */}
      {tab === "pending" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Pending Applications</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded shadow">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">#</th>
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">Email</th>
                  <th className="px-4 py-2 border-b">Applied At</th>
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingPending ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      Loading...
                    </td>
                  </tr>
                ) : pending.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      No pending applications.
                    </td>
                  </tr>
                ) : (
                  pending.map((user, idx) => (
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
                      <td className="px-4 py-2 border-b">
                        {user.appliedAt
                          ? new Date(user.appliedAt).toLocaleString()
                          : "-"}
                      </td>
                      <td className="px-4 py-2 border-b flex gap-2">
                        <button
                          className="px-2 py-1 bg-green-500 text-white rounded text-xs flex items-center gap-1"
                          onClick={() => approveMutation.mutate(user.uid)}
                          disabled={approveMutation.isLoading}
                        >
                          <FaCheck /> Approve
                        </button>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs flex items-center gap-1"
                          onClick={() => rejectMutation.mutate(user.uid)}
                          disabled={rejectMutation.isLoading}
                        >
                          <FaTimes /> Reject
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "agents" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">All Current Agents</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded shadow">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">#</th>
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">Email</th>
                  <th className="px-4 py-2 border-b">Role</th>
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingAgents ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      Loading...
                    </td>
                  </tr>
                ) : agents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      No agents found.
                    </td>
                  </tr>
                ) : (
                  agents.map((user, idx) => (
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
                        <FaUserTie className="text-green-600" /> Agent
                      </td>
                      <td className="px-4 py-2 border-b">
                        <button
                          className="px-2 py-1 bg-blue-500 text-white rounded text-xs flex items-center gap-1"
                          onClick={() => demoteMutation.mutate(user.uid)}
                          disabled={demoteMutation.isLoading}
                        >
                          <FaUser /> Demote to Customer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;
