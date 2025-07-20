import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaHeart,
  FaSpinner,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ApplicationForm = () => {
  const { policyId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient(); // Add this

  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {
      personalInfo: {
        fullName: user?.displayName || "",
        email: user?.email || "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        occupation: "",
        monthlyIncome: "",
        address: "",
        nidOrSSN: "",
      },
      nomineeInfo: {
        fullName: "",
        relationship: "",
        phone: "",
        address: "",
      },
      healthDisclosure: {
        conditions: [],
        smoking: false,
        drinking: false,
        additionalInfo: "",
      },
    },
  });

  const healthConditions = [
    "Diabetes",
    "Heart Disease",
    "Cancer",
    "Asthma",
    "Hypertension",
  ];

  const relationships = ["Spouse", "Parent", "Child", "Sibling", "Other"];

  // Fetch policy
  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await axiosSecure.get(`/policies/${policyId}`);
        setPolicy(response.data.policy);
      } catch {
        toast.error("Failed to load policy");
        navigate("/policies");
      } finally {
        setLoading(false);
      }
    };

    if (policyId) {
      fetchPolicy();
    }
  }, [policyId, axiosSecure, navigate]);

  // Submit form
  const onSubmit = async (data) => {
    setSubmitting(true);

    try {
      const applicationData = {
        ...data,
        policyId: policyId,
        userId: user?.uid,
        status: "Pending",
        submittedAt: new Date().toISOString(),
      };

      await axiosSecure.post("/customer/applications", applicationData);

      // Invalidate the user's policies query so Policies.jsx reloads automatically
      queryClient.invalidateQueries(["user-policies", user?.uid]);

      toast.success("Application submitted successfully!");
      navigate("/dashboard/customer/policies");
    } catch {
      toast.error("Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Application - LifeSure</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600" />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Application | LifeSure`}</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 text-gray-600 hover:text-gray-800"
                >
                  <FaArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Insurance Application
                  </h1>
                  <p className="text-gray-600">{policy?.title}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Step {currentStep} of 3</p>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Remove form wrapper to prevent auto-submission */}
          <div className="space-y-8">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <FaUser className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold">Personal Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      {...register("personalInfo.fullName", {
                        required: "Full name is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.personalInfo?.fullName && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.personalInfo.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      {...register("personalInfo.email", {
                        required: "Email is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.personalInfo?.email && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.personalInfo.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      {...register("personalInfo.phone", {
                        required: "Phone is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.personalInfo?.phone && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.personalInfo.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      {...register("personalInfo.dateOfBirth", {
                        required: "Date of birth is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.personalInfo?.dateOfBirth && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.personalInfo.dateOfBirth.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      {...register("personalInfo.gender", {
                        required: "Gender is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.personalInfo?.gender && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.personalInfo.gender.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occupation *
                    </label>
                    <input
                      type="text"
                      {...register("personalInfo.occupation", {
                        required: "Occupation is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.personalInfo?.occupation && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.personalInfo.occupation.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Income *
                    </label>
                    <input
                      type="number"
                      {...register("personalInfo.monthlyIncome", {
                        required: "Monthly income is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.personalInfo?.monthlyIncome && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.personalInfo.monthlyIncome.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NID/SSN *
                    </label>
                    <input
                      type="text"
                      {...register("personalInfo.nidOrSSN", {
                        required: "NID/SSN is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.personalInfo?.nidOrSSN && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.personalInfo.nidOrSSN.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      {...register("personalInfo.address", {
                        required: "Address is required",
                      })}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.personalInfo?.address && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.personalInfo.address.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Nominee Information */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <FaUsers className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-bold">Nominee Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nominee Name *
                    </label>
                    <input
                      type="text"
                      {...register("nomineeInfo.fullName", {
                        required: "Nominee name is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.nomineeInfo?.fullName && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.nomineeInfo.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relationship *
                    </label>
                    <select
                      {...register("nomineeInfo.relationship", {
                        required: "Relationship is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select relationship</option>
                      {relationships.map((rel) => (
                        <option key={rel} value={rel}>
                          {rel}
                        </option>
                      ))}
                    </select>
                    {errors.nomineeInfo?.relationship && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.nomineeInfo.relationship.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      {...register("nomineeInfo.phone", {
                        required: "Phone is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.nomineeInfo?.phone && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.nomineeInfo.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      {...register("nomineeInfo.address", {
                        required: "Address is required",
                      })}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.nomineeInfo?.address && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.nomineeInfo.address.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Health Disclosure */}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <FaHeart className="w-6 h-6 text-red-600" />
                  <h2 className="text-xl font-bold">Health Disclosure</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Health Conditions (Select all that apply)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {healthConditions.map((condition) => (
                        <label
                          key={condition}
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            {...register("healthDisclosure.conditions")}
                            value={condition}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">
                            {condition}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Do you smoke?
                    </label>
                    <div className="flex space-x-6">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          {...register("healthDisclosure.smoking", {
                            required: "Please select an option for smoking",
                          })}
                          value="yes"
                          className="w-4 h-4 text-blue-600 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          {...register("healthDisclosure.smoking")}
                          value="no"
                          className="w-4 h-4 text-blue-600 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">No</span>
                      </label>
                    </div>
                    {errors.healthDisclosure?.smoking && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.healthDisclosure.smoking.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Do you drink alcohol regularly?
                    </label>
                    <div className="flex space-x-6">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          {...register("healthDisclosure.drinking", {
                            required: "Please select an option for drinking",
                          })}
                          value="yes"
                          className="w-4 h-4 text-blue-600 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          {...register("healthDisclosure.drinking")}
                          value="no"
                          className="w-4 h-4 text-blue-600 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">No</span>
                      </label>
                    </div>
                    {errors.healthDisclosure?.drinking && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.healthDisclosure.drinking.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Health Information
                    </label>
                    <textarea
                      {...register("healthDisclosure.additionalInfo")}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Any additional health information"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center bg-white rounded-lg shadow p-6">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex space-x-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full ${
                      step <= currentStep ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={async () => {
                    // Simple inline validation
                    let fieldsToValidate = [];

                    if (currentStep === 1) {
                      fieldsToValidate = [
                        "personalInfo.fullName",
                        "personalInfo.email",
                        "personalInfo.phone",
                        "personalInfo.dateOfBirth",
                        "personalInfo.gender",
                        "personalInfo.occupation",
                        "personalInfo.monthlyIncome",
                        "personalInfo.address",
                        "personalInfo.nidOrSSN",
                      ];
                    } else if (currentStep === 2) {
                      fieldsToValidate = [
                        "nomineeInfo.fullName",
                        "nomineeInfo.relationship",
                        "nomineeInfo.phone",
                        "nomineeInfo.address",
                      ];
                    }

                    const isValid =
                      fieldsToValidate.length === 0 ||
                      (await trigger(fieldsToValidate));

                    if (isValid) {
                      setCurrentStep((prev) => prev + 1);
                    } else {
                      toast.error("Please fill in all required fields");
                    }
                  }}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <span>Next</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={submitting}
                  className="flex items-center space-x-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="w-4 h-4" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationForm;
