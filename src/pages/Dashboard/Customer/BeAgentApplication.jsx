import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Controller, useForm } from "react-hook-form";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaListAlt,
  FaSpinner,
  FaStar,
  FaUserTie,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import Select from "react-select";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const specialtiesList = [
  { value: "Life Insurance", label: "Life Insurance" },
  { value: "Health Insurance", label: "Health Insurance" },
  { value: "Auto Insurance", label: "Auto Insurance" },
  { value: "Property Insurance", label: "Property Insurance" },
  { value: "Retirement Planning", label: "Retirement Planning" },
  { value: "Investment", label: "Investment" },
  { value: "Other", label: "Other" },
];

const BeAgentApplication = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
    control,
  } = useForm({
    defaultValues: {
      fullName: user?.displayName || "",
      email: user?.email || "",
      phone: "",
      experience: "",
      specialties: [],
      qualifications: "",
      reason: "",
    },
  });

  // Submit form
  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await axiosSecure.post("/apply-agent", {
        ...data,
        specialties: Array.isArray(data.specialties)
          ? data.specialties.map((s) => s.value).join(", ")
          : data.specialties,
      });
      toast.success("Agent application submitted!");
      reset();
      navigate("/dashboard/customer"); // <-- Redirects to customer dashboard
    } catch {
      toast.error("Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <>
      <Helmet>
        <title>Become an Agent | LifeSure</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
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
                  <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                    <FaUserTie className="mr-2 text-blue-600" />
                    Become a LifeSure Agent
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Fill out the form to apply as an agent.
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Step {currentStep} of 2</p>
                <div className="w-24 bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${(currentStep / 2) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <form className="space-y-8">
            {/* Step 1: Personal & Experience */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <FaUserTie className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold">Personal & Experience</h2>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      {...register("fullName", {
                        required: "Full name is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.fullName && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      {...register("email", { required: "Email is required" })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      {...register("phone", { required: "Phone is required" })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FaStar className="mr-1 text-yellow-400" />
                      Years of Experience *
                    </label>
                    <input
                      type="number"
                      min={0}
                      {...register("experience", {
                        required: "Experience is required",
                        min: { value: 0, message: "Must be 0 or more" },
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.experience && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.experience.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Specialties & Motivation */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <FaListAlt className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-bold">
                    Specialties & Motivation
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialties (select all that apply) *
                    </label>
                    <Controller
                      name="specialties"
                      control={control}
                      rules={{
                        validate: (v) =>
                          (v && v.length > 0) ||
                          "Select at least one specialty",
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={specialtiesList}
                          isMulti
                          className="react-select-container"
                          classNamePrefix="react-select"
                          placeholder="Select specialties..."
                        />
                      )}
                    />
                    {errors.specialties && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.specialties.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualifications (certifications, degrees, etc.)
                    </label>
                    <input
                      type="text"
                      {...register("qualifications")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g. Certified Insurance Agent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Why do you want to be an agent? *
                    </label>
                    <textarea
                      {...register("reason", {
                        required: "This field is required",
                      })}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Share your motivation"
                    />
                    {errors.reason && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.reason.message}
                      </p>
                    )}
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
                {[1, 2].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full ${
                      step <= currentStep ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              {currentStep < 2 ? (
                <button
                  type="button"
                  onClick={async () => {
                    let fieldsToValidate = [];
                    if (currentStep === 1) {
                      fieldsToValidate = [
                        "fullName",
                        "email",
                        "phone",
                        "experience",
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
          </form>
        </div>
      </div>
    </>
  );
};

export default BeAgentApplication;
