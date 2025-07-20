import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaCreditCard,
  FaDollarSign,
  FaExclamationTriangle,
  FaFileInvoiceDollar,
  FaFilter,
  FaInfoCircle,
  FaSearch,
  FaShieldAlt,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import Modal from "../../../components/Modal/Modal";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Payments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filter, setFilter] = useState("all"); // all, due, paid
  const [search, setSearch] = useState("");

  // Fetch user's approved policies with payment information
  const {
    data: payments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-payments", user?.uid],
    queryFn: async () => {
      const response = await axiosSecure.get(`/customer/payment-status`);
      return response.data.payments || [];
    },
    enabled: !!user?.uid,
  });

  // Filter payments based on status and search
  const filteredPayments = payments.filter((payment) => {
    const matchesFilter = filter === "all" || payment.status === filter;
    const matchesSearch =
      payment.policyName.toLowerCase().includes(search.toLowerCase()) ||
      payment.policyId.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      due: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: FaExclamationTriangle,
        border: "border-red-200",
      },
      paid: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: FaCheckCircle,
        border: "border-green-200",
      },
    };

    const config = statusConfig[status] || statusConfig.due;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}
      >
        <Icon className="w-4 h-4 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handlePayNow = (payment) => {
    navigate(`/dashboard/customer/payment-page?applicationId=${payment._id}`);
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Payments | LifeSure</title>
        </Helmet>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4 mx-auto" />
            <p className="text-gray-600">Loading payment information...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Payments | LifeSure</title>
        </Helmet>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FaTimes className="text-4xl text-red-600 mb-4 mx-auto" />
            <p className="text-gray-600">Failed to load payment information</p>
            <p className="text-sm text-gray-500 mt-2">
              {error?.message || "Please try again later"}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payments | LifeSure</title>
        <meta
          name="description"
          content="Manage your insurance premium payments and payment history"
        />
      </Helmet>

      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Center
            </h1>
            <p className="text-gray-600">
              Manage your insurance premium payments and view payment history
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Active Policies",
                value: payments.length,
                icon: FaShieldAlt,
                color: "blue",
              },
              {
                title: "Due Payments",
                value: payments.filter((p) => p.status === "due").length,
                icon: FaExclamationTriangle,
                color: "red",
              },
              {
                title: "Up to Date",
                value: payments.filter((p) => p.status === "paid").length,
                icon: FaCheckCircle,
                color: "green",
              },
              {
                title: "Total Amount Due",
                value: formatCurrency(
                  payments
                    .filter((p) => p.status === "due")
                    .reduce((sum, p) => sum + p.amount, 0)
                ),
                icon: FaDollarSign,
                color: "yellow",
              },
            ].map((stat) => (
              <div key={stat.title} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div
                    className={`p-3 rounded-full bg-${stat.color}-100 text-${stat.color}-600`}
                  >
                    {React.createElement(stat.icon, { className: "w-6 h-6" })}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FaFilter className="text-gray-400" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Payments</option>
                    <option value="due">Due Payments</option>
                    <option value="paid">Up to Date</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <FaSearch className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search policies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Payments List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {filteredPayments.length === 0 ? (
              <div className="text-center py-12">
                <FaFileInvoiceDollar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No payment records found
                </h3>
                <p className="text-gray-600">
                  {filter === "all"
                    ? "You don't have any active policies requiring payments yet."
                    : `No ${filter} payments found.`}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Policy
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Premium & Frequency
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments.map((payment) => {
                      const daysUntilDue = getDaysUntilDue(payment.dueDate);
                      return (
                        <tr key={payment._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <FaShieldAlt className="h-5 w-5 text-blue-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {payment.policyName}
                                </div>
                                {/* Remove or comment out the line below to hide the ID */}
                                {/* <div className="text-sm text-gray-500">
                                  ID: {payment.policyId}
                                </div> */}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div className="flex items-center">
                                <FaDollarSign className="h-4 w-4 mr-1 text-gray-400" />
                                {formatCurrency(payment.amount)}
                              </div>
                              <div className="text-xs text-gray-500 capitalize">
                                {payment.frequency}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div className="flex items-center">
                                <FaCalendarAlt className="h-4 w-4 mr-2 text-gray-400" />
                                {formatDate(payment.dueDate)}
                              </div>
                              {payment.status === "due" && (
                                <div
                                  className={`text-xs mt-1 ${
                                    daysUntilDue < 0
                                      ? "text-red-600"
                                      : daysUntilDue <= 7
                                      ? "text-yellow-600"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {daysUntilDue < 0
                                    ? `${Math.abs(daysUntilDue)} days overdue`
                                    : daysUntilDue === 0
                                    ? "Due today"
                                    : `${daysUntilDue} days remaining`}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(payment.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewDetails(payment)}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                              >
                                <FaInfoCircle className="h-3 w-3 mr-1" />
                                Details
                              </button>
                              {payment.status === "due" && (
                                <button
                                  onClick={() => handlePayNow(payment)}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                  <FaCreditCard className="h-3 w-3 mr-1" />
                                  Pay Now
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Payment Details"
        subtitle={selectedPayment?.policyName}
        icon={FaInfoCircle}
        size="2xl"
        headerColor="blue"
      >
        {selectedPayment && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Policy Name
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {selectedPayment.policyName}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Policy ID
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {selectedPayment.policyId}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Premium Amount
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {formatCurrency(selectedPayment.amount)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Frequency
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg capitalize">
                  {selectedPayment.frequency}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {formatDate(selectedPayment.dueDate)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Payment
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {selectedPayment.lastPayment
                    ? formatDate(selectedPayment.lastPayment)
                    : "No payments yet"}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment History
              </label>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                {selectedPayment.paymentHistory?.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {selectedPayment.paymentHistory.map((history, index) => (
                      <div
                        key={index}
                        className="p-4 flex justify-between items-center"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(history.date)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Transaction: {history.transactionId || "N/A"}
                          </p>
                          <p className="text-xs text-green-600 capitalize">
                            {history.status}
                          </p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(history.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="p-4 text-sm text-gray-600">
                    No payment history available
                  </p>
                )}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
              {selectedPayment.status === "due" && (
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handlePayNow(selectedPayment);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                >
                  Pay Now
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Payments;
