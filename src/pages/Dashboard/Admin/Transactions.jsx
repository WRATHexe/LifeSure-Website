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
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">All Transactions</h2>
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition">
            Filter by Date Range
          </button>
          <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition">
            Filter by User
          </button>
          <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-medium hover:bg-yellow-200 transition">
            Filter by Policy
          </button>
        </div>
      </div>

      <div className="font-bold text-green-700 mb-2">
        Total Income:{" "}
        {formatCurrency(
          transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0)
        )}
      </div>

      <div className="overflow-x-auto rounded-xl shadow border bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                User Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Policy Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Paid Amount
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
                <td colSpan={7} className="text-center py-10 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-500">
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
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">
                    {tx.transactionId || tx._id}
                  </td>
                  <td className="px-4 py-3">{tx.userEmail}</td>
                  <td className="px-4 py-3">{tx.policyName}</td>
                  <td className="px-4 py-3 font-semibold">
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="px-4 py-3">
                    {formatDate(tx.date || tx.paymentDate)}
                  </td>
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
