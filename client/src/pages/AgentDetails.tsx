import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { AgentType, Property } from "../types"
import Banner from "../assets/banner.webp"
import axios from "axios"
import { FaLocationDot } from "react-icons/fa6"
import { IoBedOutline } from "react-icons/io5"
import { BiArea } from "react-icons/bi"

export default function AgentDetails() {
    const [agent,setAgent] = useState<AgentType>()
    const [loading,setLoading] = useState<boolean>(true)
    const [activeListings,setActiveListings] = useState<Property[]>()
    const {id} = useParams<{id:string}>()

    const fetchAgent = async(agentId:string)=>{
        try{
            const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}agents/${agentId}`,{
                params:{
                    id
                },
                headers:{
                    "Authorization":`Bearer ${localStorage.getItem('personal_token')}`
                }
            })
            if(response.status === 200){
                setLoading(false)
                setAgent(response.data.agent)
                setActiveListings(response.data.activeListings)
            }
        }catch(err){
            console.error(err)
        }
    }
    useEffect(()=>{
        if(id){
            fetchAgent(id)
        }
    },[id])
    if(!agent){
        return <h1 className="text-white text-center text-6xl">Agent Not Found</h1>
    }
  return (
    <div className="p-4">
        <h1 className="text-white text-2xl">Agent Details</h1>
        <div className="p-10 flex lg:flex-row md:flex-col gap-10">
            {/* agent profile */}
            <div className="agent bg-[rgb(26,28,30)] w-max rounded-md">
                <div className=" banner">
                    <img src={Banner} className="w-[330px] rounded-md h-40"/>
                <div className="profile flex items-center gap-10 p-2">
                    <img src={`${import.meta.env.VITE_FILES_URL}${agent.avatar}`} className="w-[100px] rounded-full  h-[100px] object-cover -mt-10"  />
                    <div className="flex flex-col justify-end">
                        <h2 className="text-white ">{agent.firstname} {agent.lastname}</h2>
                        <span className="text-gray-500">{agent.role}</span>
                    </div>
                </div>
                <div className="p-6 space-y-3">  
                    <h2 className="text-gray-500 ">
                    Age: <span className="text-white">{new Date().getFullYear() - parseInt(agent.birthdate.split('-')[0])}</span>
                    </h2>
                    <h2 className="text-gray-500    ">Country: <span className="text-white">{agent.country}</span></h2>
                    <h2 className="text-gray-500 ">State: <span className="text-white">{agent.state}</span></h2>
                    <h2 className="text-gray-500 ">Post Code: <span className="text-white">{agent.zipcode}</span></h2>
                    <h2 className="text-gray-500 ">Agent Id: <span className="text-white">#{agent._id}</span></h2>
                    <h2 className="text-gray-500 ">Phone: <span className="text-white">{agent.phone}</span></h2>
                    <h2 className="text-gray-500 ">Email: <span className="text-white">{agent.email}</span></h2>
                </div>
                </div>
            </div>
            {/* active listing */}

            <div className="bg-[rgb(26,28,30)] p-3 space-y-10">
            {activeListings && activeListings.map((property:Property)=>(
                      <Link to={`/properties/${property._id}`} className="flex flew-row items-center gap-4  bg-[rgb(18,19,21)] p-2 rounded-md">
                        <div>
                          <img src={`${import.meta.env.VITE_FILES_URL}${property.photo}`} className='rounded-md h-[150px] object-contain' />
                        </div>
                        <div className="text-white">
                            <span className="bg-[rgb(17,18,20)]  p-2 rounded-md mb-2 text-blue-500 font-semibold">${property.price}</span>
                            <h1 className="text-xl font-semibold">{property.title}</h1>
                            <h1 className="flex items-center gap-1 text-gray-500"><FaLocationDot/> {property.state},{property.country}</h1>
                            <div className="flex justify-between items-center text-white">
                              <span className="flex items-center font-semibold gap-1"><IoBedOutline className="text-xl" /> {property.beds}</span>
                              <span className="flex items-center font-semibold gap-1"><BiArea className="text-xl" /> {property.surface}M</span>
                            </div>
                            <div className="flex gap-2">
                            
                            </div>
                        </div>
                      </Link>
                    ))}
            </div>
        </div>
    </div>
  )
}
