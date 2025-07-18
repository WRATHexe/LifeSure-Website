import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const statusColors = {
  Pending: "bg-blue-100 text-blue-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

const Customers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["agent-customers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/agent/customers");
      return res.data.customers || [];
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await axiosSecure.patch(`/agent/customers/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["agent-customers"]);
    },
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Assigned Customers</h2>
      <div className="overflow-x-auto rounded-xl shadow border bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Policies
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="px-4 py-3">{c.policies?.join(", ")}</td>
                  <td className="px-4 py-3">
                    <select
                      value={c.status}
                      onChange={(e) =>
                        statusMutation.mutate({
                          id: c._id,
                          status: e.target.value,
                        })
                      }
                      className={`border rounded px-2 py-1 ${
                        statusColors[c.status] || ""
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
                      onClick={() => setSelected(c)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Modal for details */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold mb-2">{selected.name}</h3>
            <p className="mb-1">
              <span className="font-semibold">Email:</span> {selected.email}
            </p>
            <p className="mb-1">
              <span className="font-semibold">Policies:</span>{" "}
              {selected.policies?.join(", ")}
            </p>
            <p className="mb-1">
              <span className="font-semibold">Status:</span> {selected.status}
            </p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
