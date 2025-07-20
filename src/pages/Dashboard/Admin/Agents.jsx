import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  FaCheck,
  FaHourglassHalf,
  FaTimes,
  FaUser,
  FaUserShield,
  FaUserTie,
} from "react-icons/fa";
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
      await axiosSecure.patch(`/admin/agent-applications/${uid}`, {
        action: "approve",
      });
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
      await axiosSecure.patch(`/admin/agent-applications/${uid}`, {
        action: "reject",
      });
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
      await axiosSecure.patch(`/admin/users/${uid}/role`, { Role: "customer" });
    },
    onSuccess: () => {
      toast.success("Agent demoted to customer.");
      queryClient.invalidateQueries(["all-agents"]);
    },
    onError: () => toast.error("Failed to demote agent"),
  });

  // Helper for pretty specialties
  const renderSpecialties = (specialties) =>
    specialties ? (
      specialties.split(",").map((s, i) => (
        <span
          key={i}
          className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold mr-1 mb-1"
        >
          {s.trim()}
        </span>
      ))
    ) : (
      <span className="text-gray-400 text-xs">—</span>
    );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 flex items-center gap-2">
          <FaUserShield className="text-blue-600" /> Manage Agents
        </h2>
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            className={`px-6 py-2 rounded-t-lg font-semibold shadow transition-all ${
              tab === "pending"
                ? "bg-blue-600 text-white scale-105"
                : "bg-white text-gray-700 hover:bg-blue-100"
            }`}
            onClick={() => setTab("pending")}
          >
            <FaHourglassHalf className="inline mr-2" />
            Pending Applications
          </button>
          <button
            className={`px-6 py-2 rounded-t-lg font-semibold shadow transition-all ${
              tab === "agents"
                ? "bg-blue-600 text-white scale-105"
                : "bg-white text-gray-700 hover:bg-blue-100"
            }`}
            onClick={() => setTab("agents")}
          >
            <FaUserTie className="inline mr-2" />
            All Current Agents
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {tab === "pending" && (
            <div>
              <h3 className="text-lg font-semibold px-6 pt-6 pb-2 text-blue-700 flex items-center gap-2">
                <FaHourglassHalf /> Pending Applications
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-blue-100 to-indigo-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Experience
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Specialties
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Applied At
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {loadingPending ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center py-8 text-gray-500"
                        >
                          Loading...
                        </td>
                      </tr>
                    ) : pending.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center py-8 text-gray-400"
                        >
                          No pending applications.
                        </td>
                      </tr>
                    ) : (
                      pending
                        .filter(
                          (user) => user.agentApplicationStatus === "pending"
                        ) // <-- Only show pending
                        .map((user, idx) => (
                          <tr
                            key={user.uid}
                            className="hover:bg-blue-50 transition"
                          >
                            <td className="px-4 py-3">{idx + 1}</td>
                            <td className="px-4 py-3 flex items-center gap-2">
                              <img
                                src={
                                  user.photoURL ||
                                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                }
                                alt={user.displayName}
                                className="w-9 h-9 rounded-full border-2 border-blue-200 shadow"
                              />
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {user.displayName}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {user.agentApplication?.qualifications}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">{user.email}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                                {user.agentApplication?.experience || "-"} yrs
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {renderSpecialties(
                                user.agentApplication?.specialties
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {user.agentApplication?.appliedAt
                                ? new Date(
                                    user.agentApplication.appliedAt
                                  ).toLocaleString()
                                : "-"}
                            </td>
                            <td className="px-4 py-3 flex gap-2">
                              <button
                                className="px-3 py-1 bg-green-500 text-white rounded shadow text-xs flex items-center gap-1 hover:bg-green-600 transition"
                                onClick={() => approveMutation.mutate(user.uid)}
                                disabled={approveMutation.isLoading}
                              >
                                <FaCheck /> Approve
                              </button>
                              <button
                                className="px-3 py-1 bg-red-500 text-white rounded shadow text-xs flex items-center gap-1 hover:bg-red-600 transition"
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
              <h3 className="text-lg font-semibold px-6 pt-6 pb-2 text-blue-700 flex items-center gap-2">
                <FaUserTie /> All Current Agents
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-blue-100 to-indigo-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Experience
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Specialties
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {loadingAgents ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center py-8 text-gray-500"
                        >
                          Loading...
                        </td>
                      </tr>
                    ) : agents.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center py-8 text-gray-400"
                        >
                          No agents found.
                        </td>
                      </tr>
                    ) : (
                      agents.map((user, idx) => (
                        <tr
                          key={user.uid}
                          className="hover:bg-blue-50 transition"
                        >
                          <td className="px-4 py-3">{idx + 1}</td>
                          <td className="px-4 py-3 flex items-center gap-2">
                            <img
                              src={
                                user.photoURL ||
                                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                              }
                              alt={user.displayName}
                              className="w-9 h-9 rounded-full border-2 border-blue-200 shadow"
                            />
                            <div>
                              <div className="font-semibold text-gray-900">
                                {user.displayName}
                              </div>
                              <div className="text-xs text-gray-400">
                                {user.agentApplication?.qualifications}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">{user.email}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                              {user.agentApplication?.experience || "-"} yrs
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {renderSpecialties(
                              user.agentApplication?.specialties
                            )}
                          </td>
                          <td className="px-4 py-3 flex items-center gap-1">
                            <FaUserTie className="text-green-600" /> Agent
                          </td>
                          <td className="px-4 py-3">
                            <button
                              className="px-3 py-1 bg-blue-500 text-white rounded shadow text-xs flex items-center gap-1 hover:bg-blue-700 transition"
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
      </div>
    </div>
  );
};

export default Agents;
