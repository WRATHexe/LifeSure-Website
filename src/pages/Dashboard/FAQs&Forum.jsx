import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaQuestionCircle } from "react-icons/fa";

const faqs = [
  {
    question: "How do I apply for a new insurance policy?",
    answer:
      "Go to the 'All Policies' page, select a policy, and click 'Apply'. Fill out the application form and submit.",
  },
  {
    question: "How can I contact my assigned agent?",
    answer:
      "You can find your assigned agent's contact details in your dashboard under 'My Policies' or 'Assigned Agent' section.",
  },
  {
    question: "What should I do if my claim is rejected?",
    answer:
      "Check the admin feedback for the reason. If you need further clarification, contact support or your agent.",
  },
  {
    question: "How do I update my profile information?",
    answer:
      "Navigate to the 'Profile' section in your dashboard and update your details.",
  },
];

const FAQsAndForum = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center mb-8">
        <FaQuestionCircle className="text-blue-600 text-3xl mr-3" />
        <h1 className="text-3xl font-extrabold text-gray-800">FAQs & Forum</h1>
      </div>
      <div className="space-y-5">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className={`rounded-xl border shadow transition-all duration-200 ${
              openIndex === idx
                ? "bg-blue-50 border-blue-200"
                : "bg-white border-gray-200"
            }`}
          >
            <button
              className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none group"
              onClick={() => toggleAccordion(idx)}
              aria-expanded={openIndex === idx}
            >
              <span className="font-semibold text-gray-900 group-hover:text-blue-700 transition">
                {faq.question}
              </span>
              <span className="ml-2 text-blue-600">
                {openIndex === idx ? (
                  <FaChevronUp className="transition-transform duration-200" />
                ) : (
                  <FaChevronDown className="transition-transform duration-200" />
                )}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === idx ? "max-h-40" : "max-h-0"
              }`}
            >
              {openIndex === idx && (
                <div className="px-6 pb-5 text-gray-700 border-t border-blue-100 animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 text-center text-gray-500 text-sm">
        Didn&apos;t find your answer?{" "}
        <a
          href="mailto:support@lifesure.com"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Contact Support
        </a>
      </div>
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(-8px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease;
          }
        `}
      </style>
    </div>
  );
};

export default FAQsAndForum;
