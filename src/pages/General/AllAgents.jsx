import { useQuery } from "@tanstack/react-query";
import { FaEnvelope, FaStar, FaUserTie } from "react-icons/fa";
import useAxios from "../../hooks/useAxios";

const AllAgents = () => {
  const axios = useAxios();
  const { data: agents = [], isLoading } = useQuery({
    queryKey: ["allAgents"],
    queryFn: async () => {
      const res = await axios.get("/agents");
      return res.data.agents || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Find the most experienced agent for "Top Agent" badge
  const maxExp = Math.max(
    ...agents.map((a) => parseInt(a.agentApplication?.experience) || 0)
  );

  return (
    <section className="py-16 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Soft background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/dot-grid.png')]"></div>
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-3">
            <FaUserTie className="w-7 h-7 text-blue-600 mr-2" />
            <span className="text-blue-600 font-semibold uppercase tracking-wide text-sm">
              All Agents
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Meet Our LifeSure Agents
          </h1>
          <div className="flex justify-center">
            <div className="h-1 w-32 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-full mb-4"></div>
          </div>
          <p className="text-gray-600 text-lg">
            Our professional team is here to help you with your insurance needs.
          </p>
        </div>
        {isLoading ? (
          <div className="text-center py-20 text-gray-500">
            Loading agents...
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No agents found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {agents.map((agent, idx) => {
              const isTopAgent =
                parseInt(agent.agentApplication?.experience) === maxExp &&
                maxExp > 0;
              // Specialties as badges
              const specialties = agent.agentApplication?.qualifications
                ? agent.agentApplication.qualifications
                    .split(",")
                    .map((s) => s.trim())
                : [];
              return (
                <div
                  key={agent.uid}
                  className={`relative bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-2 hover:border-indigo-300 group opacity-0 animate-fade-in`}
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  {/* Top Agent Badge */}
                  {isTopAgent && (
                    <span className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow animate-bounce">
                      Top Agent
                    </span>
                  )}
                  {/* Avatar with gradient ring */}
                  <div className="bg-gradient-to-tr from-blue-400 via-indigo-400 to-purple-400 p-1 rounded-full mb-4 shadow-lg">
                    <img
                      src={agent.photoURL || "/avatar-default.png"}
                      alt={agent.displayName || "Agent"}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
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
                  <div className="flex flex-wrap justify-center gap-2 mb-3">
                    {specialties.length > 0 ? (
                      specialties.map((spec, idx) => (
                        <span
                          key={idx}
                          className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200"
                        >
                          {spec}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs">
                        No specialties listed
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <FaEnvelope className="mr-1" />
                    {agent.email}
                  </div>
                  {/* Contact button with tooltip */}
                  <div className="relative group">
                    <a
                      href={`mailto:${agent.email}`}
                      className="mt-2 inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold text-sm shadow hover:bg-blue-700 transition"
                    >
                      Contact
                    </a>
                    <span className="absolute left-1/2 -top-8 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs rounded px-2 py-1 pointer-events-none transition-opacity duration-200">
                      Email this agent
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Fade-in animation keyframes */}
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px);}
            to { opacity: 1; transform: none;}
          }
          .animate-fade-in {
            animation: fade-in 0.7s cubic-bezier(.4,0,.2,1) forwards;
          }
        `}
      </style>
    </section>
  );
};

export default AllAgents;
