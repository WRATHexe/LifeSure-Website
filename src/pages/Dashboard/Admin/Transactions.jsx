import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const statusColors = {
  Paid: "bg-green-100 text-green-700",
  Due: "bg-yellow-100 text-yellow-700",
  Failed: "bg-red-100 text-red-700",
  Pending: "bg-blue-100 text-blue-700",
};

const Transactions = () => {
  const axiosSecure = useAxiosSecure();
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["admin-transactions"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/transactions");
      return res.data.transactions || [];
    },
  });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">All Transactions</h2>

      {/* Optional: Search/filter bar */}
      {/* <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search by user or policy"
          className="border px-3 py-2 rounded-lg shadow-sm w-64"
        />
      </div> */}

      <div className="overflow-x-auto rounded-xl shadow border bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Policy
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((tx, idx) => (
                <tr
                  key={tx._id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-3 font-mono text-gray-500">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">
                      {tx.userName}
                    </div>
                    <div className="text-xs text-gray-400">{tx.userEmail}</div>
                  </td>
                  <td className="px-4 py-3">{tx.policyName}</td>
                  <td className="px-4 py-3 font-semibold">
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="px-4 py-3">{formatDate(tx.date)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        statusColors[tx.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {tx.status}
                    </span>
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

export default Transactions;
