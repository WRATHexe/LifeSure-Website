import jsPDF from "jspdf";
import { FaFileDownload } from "react-icons/fa";

const PdfDownloader = ({ policy, user }) => {
  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("LifeSure Policy Document", 20, 20);

    doc.setFontSize(12);
    doc.text(
      `Policy Name: ${policy.policyName || policy.policy?.title || "N/A"}`,
      20,
      40
    );
    doc.text(`Applicant: ${user?.displayName || user?.email || "N/A"}`, 20, 50);
    doc.text(
      `Application Date: ${
        policy.submittedAt
          ? new Date(policy.submittedAt).toLocaleDateString()
          : "N/A"
      }`,
      20,
      60
    );
    doc.text(
      `Coverage: ${
        policy.coverageAmount || policy.policy?.coverageMax || "N/A"
      }`,
      20,
      70
    );
    doc.text(
      `Duration: ${policy.duration || policy.policy?.duration || "N/A"}`,
      20,
      80
    );
    doc.text(
      `Premium: ${policy.premium || policy.policy?.premium || "N/A"}`,
      20,
      90
    );
    doc.text(`Status: Approved`, 20, 100);

    doc.save(
      `Policy_${policy.policyName || policy.policy?.title || "LifeSure"}.pdf`
    );
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      title="Download Policy PDF"
    >
      <FaFileDownload className="h-3 w-3 mr-1" />
      Download Policy
    </button>
  );
};

export default PdfDownloader;
