import { Link } from "react-router-dom";
import { AgentType } from "../types";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { IoMailSharp } from "react-icons/io5";
import { FaPhoneAlt, FaBuilding } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function Agents() {
  const [agents, setAgents] = useState<AgentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [agentId, setAgentId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const fetchAgents = async (page: number) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_BASE_URL}agents`,
        {
          params: {
            page,
            limit: 10,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("personal_token")}`,
          },
        }
      );
      if (response.status === 200) {
        setLoading(false);
        setAgents(response.data.agents);
        setTotalPages(response.data.totalPages);
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAgents(currentPage);
  }, [currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const toggleMenu = (id: string) => {
    setAgentId(agentId === id ? null : id);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setAgentId(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-10">
      <div className="flex text-white items-center justify-between mb-5">
        <h1 className="text-2xl font-semibold">Agents List</h1>
        <Link
          to="/agents/add"
          className="bg-[rgb(72,96,233)] px-4 py-2 rounded-md"
        >
          Add Agent
        </Link>
      </div>
      <div className="p-5 rounded-md">
        {loading ? (
          <p>Loading...</p>
        ) : agents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent) => (
              <div
                key={agent._id}
                className="relative flex flex-row items-center gap-3 bg-[rgb(26,28,30)] p-4 rounded-md"
              >
                <div>
                  <img
                    src={`${import.meta.env.VITE_FILES_URL}${agent.avatar}`}
                    alt={`${agent.firstname} ${agent.lastname}`}
                    className="w-[300px] rounded-md"
                  />
                </div>
                <div>
                  <h1 className="text-white font-semibold">
                    {agent.firstname} {agent.lastname}
                  </h1>
                  <h2 className="text-gray-500">{agent.role}</h2>
                  <span className="flex items-center gap-2 text-gray-500 m-2">
                    <IoMailSharp />
                    {agent.email}
                  </span>
                  <span className="flex items-center gap-2 text-gray-500 m-2">
                    <FaPhoneAlt />
                    {agent.phone}
                  </span>
                  <span className="flex items-center gap-2 text-gray-500 m-2">
                    <FaLocationDot />
                    {agent.country}, {agent.state}
                  </span>
                  <span className="flex items-center gap-2 text-gray-500 m-2">
                    <FaBuilding />
                    1
                  </span>
                </div>
                <BsThreeDotsVertical
                  onClick={() => toggleMenu(agent._id)}
                  className="absolute top-5 right-5 cursor-pointer text-white"
                />
                {agent._id === agentId && (
                  <div
                    ref={menuRef}
                    className="absolute top-10 text-white right-10 bg-[rgb(20,22,24)] rounded-md shadow-md"
                  >
                    <Link to={`/agents/${agent._id}`} className="block  hover:bg-gray-500 py-2 px-4 rounded-md">
                      View Agent
                    </Link>
                    <Link to={`/agents/edit/${agent._id}`} className="block  hover:bg-gray-500 py-2 px-4 rounded-md">
                      Edit Agent
                    </Link>
                    <button className="block w-full text-left   hover:bg-gray-500 py-2 px-4 rounded-md">
                      Delete Agent
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No agents found.</p>
        )}
      </div>
      <nav className="flex items-center justify-center mt-10 gap-5">
        <button
          className="bg-[rgb(12,13,14)] text-[rgb(72,96,233)] px-4 py-2 rounded-md"
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
        >
          Previous
        </button>
        <span className="text-white font-semibold">
          {currentPage} of {totalPages}
        </span>
        <button
          className="bg-[rgb(12,13,14)] text-[rgb(72,96,233)] px-4 py-2 rounded-md"
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
        >
          Next
        </button>
      </nav>
    </div>
  );
}
