import { FaTimes } from "react-icons/fa";

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  size = "4xl",
  headerColor = "blue",
}) => {
  if (!isOpen) return null;

  const colorClasses = {
    blue: {
      gradient: "from-blue-50 to-blue-100",
      border: "border-blue-200",
      iconBg: "bg-blue-600",
      titleColor: "text-blue-600",
    },
    green: {
      gradient: "from-green-50 to-green-100",
      border: "border-green-200",
      iconBg: "bg-green-600",
      titleColor: "text-green-600",
    },
  };

  const colors = colorClasses[headerColor];

  return (
    <div className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div
        className={`bg-white rounded-2xl max-w-${size} w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 animate-scaleIn`}
      >
        {/* Modal Header */}
        <div
          className={`bg-gradient-to-r ${colors.gradient} px-6 py-5 border-b ${colors.border}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {Icon && (
                <div className={`p-2.5 ${colors.iconBg} rounded-xl shadow-md`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                {subtitle && (
                  <p
                    className={`${colors.titleColor} text-sm font-medium truncate max-w-md`}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white hover:bg-opacity-60 rounded-lg transition-all duration-200 hover:rotate-90"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] bg-gray-50">
          <div className="bg-white rounded-xl p-6 shadow-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
