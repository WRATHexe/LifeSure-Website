import { useQuery } from "@tanstack/react-query";
import { FaStar, FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios";

const MAX_AGENTS = 3;

const TopAgents = () => {
  const axios = useAxios();
  const navigate = useNavigate();
  const { data: agents = [], isLoading } = useQuery({
    queryKey: ["topAgents"],
    queryFn: async () => {
      const res = await axios.get("/agents");
      // Sort by experience (years) if available, then take top 3
      return (res.data.agents || [])
        .sort((a, b) => {
          const expA = parseInt(a.agentApplication?.experience) || 0;
          const expB = parseInt(b.agentApplication?.experience) || 0;
          return expB - expA;
        })
        .slice(0, MAX_AGENTS);
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-gray-500">Loading agents...</span>
        </div>
      </section>
    );
  }

  if (!agents.length) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-3">
            <FaUserTie className="w-6 h-6 text-blue-600 mr-2" />
            <span className="text-blue-600 font-semibold uppercase tracking-wide text-sm">
              Meet Our Agents
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Our Featured Experts
          </h2>
          <p className="text-gray-600 text-lg">
            Professional, experienced, and ready to help you.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <div
              key={agent.uid}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center"
            >
              <img
                src={agent.photoURL || "/avatar-default.png"}
                alt={agent.displayName || "Agent"}
                className="w-24 h-24 rounded-full border-4 border-blue-100 shadow-lg mb-4 object-cover"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {agent.displayName || "Agent"}
              </h3>
              <div className="flex items-center mb-2">
                <FaStar className="text-yellow-400 mr-1" />
                <span className="text-gray-700 font-medium">
                  {agent.agentApplication?.experience
                    ? `${agent.agentApplication.experience} yrs experience`
                    : "Experienced"}
                </span>
              </div>
              <div className="text-gray-600 text-sm text-center mb-2">
                <span className="font-semibold">Specialties:</span>{" "}
                {agent.agentApplication?.qualifications
                  ? agent.agentApplication.qualifications
                  : "—"}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/agents")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          >
            View All Agents
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopAgents;
