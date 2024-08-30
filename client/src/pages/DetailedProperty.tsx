import { FaChevronLeft } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import {AgentType, Property} from '../types'
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaLocationDot } from "react-icons/fa6";
import { LiaStarSolid } from "react-icons/lia";
import { LiaBedSolid } from "react-icons/lia";
import { FaKitchenSet } from "react-icons/fa6";
import { FaParking } from "react-icons/fa";
import { MdBalcony } from "react-icons/md";
import { FaSmoking } from "react-icons/fa";
import { FaWifi } from "react-icons/fa";
import { LiaBathSolid } from "react-icons/lia";
import { BiArea } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function DetailedProperty() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property>();
  const [loading, setLoading] = useState<boolean>(true);
  const [propertyLister,setPropertyLister] = useState<AgentType>()
  const [propertiesCount,setPropertiesCount] = useState<number>()
  const [menuOpened,setMenuOpened] = useState<boolean>(false)
  const menuRef = useRef(null)
  const fetchProperty = async (propertyId: any) => {
    try {
      const propertyResponse = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}properties/${propertyId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('personal_token')}`
        }
      });
      if (propertyResponse.status === 200) {
        setProperty(propertyResponse.data.property);
        const agentResponse =  await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}agents/${propertyResponse.data.property.creator}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('personal_token')}`
          }
        });
        if(agentResponse.status === 200){
          setLoading(false);
          setPropertyLister(agentResponse.data.agent)
          setPropertiesCount(agentResponse.data.activeListings.length)
        }
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProperty(id);
  }, [id]);


  const facilities = [
    { icon: <FaKitchenSet className="text-xl text-gray-500" />, label: 'Kitchen' },
    { icon: <LiaBedSolid className="text-xl text-gray-500" />, label: 'Beds' },
    { icon: <FaParking className="text-xl text-gray-500" />, label: 'Parking' },
    { icon: <MdBalcony className="text-xl text-gray-500" />, label: 'Balcony' },
    { icon: <FaSmoking className="text-xl text-gray-500" />, label: 'Smoking' },
    { icon: <FaWifi className="text-xl text-gray-500" />, label: 'Wifi' },
    { icon: <LiaBathSolid className="text-xl text-gray-500" />, label: 'Bathroom' },
    { icon: <BiArea className="text-xl text-gray-500" />, label: 'Surface Area' },
  ];

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpened(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className='bg-[rgb(17,18,20)] min-h-screen p-10'>
      <div className='bg-[rgb(26,28,30)] p-5 rounded-md'>
        <Link to='/properties' className="flex items-center gap-5">
          <FaChevronLeft className="text-white" />
          <h1 className="text-white text-2xl font-semibold">Details</h1>
        </Link>
        {loading ? (
          <div className="flex items-center justify-center min-h-screen"><AiOutlineLoading3Quarters className="text-center text-6xl animate-spin text-white" /></div>
        ) : (
          <div className="bg-[rgb(26,28,30)] p-5 mt-10 rounded-md flex flex-row w-full gap-10">
            <div className="w-2/3">
              <div className="w-[750px]">
                <img src={`${import.meta.env.VITE_FILES_URL}${property?.photo}`} className="rounded-md w-full object-contain" />
              </div>
              <div className="flex flew-row items-center justify-between gap-10">
                <div>
                  <h2 className='text-2xl text-white mt-5'>{property?.propertyType}</h2>
                  <h1 className="text-white text-3xl font-semibold mt-3">{property?.title}</h1>
                  <span className="flex items-center text-gray-500"><FaLocationDot /> {property?.country}, {property?.state}</span>
                  <>
                    <h1 className="text-white font-semibold text-3xl mt-4">Facility</h1>
                    <div className="grid grid-cols-4 py-5">
                      {facilities.map((facility, index) => (
                        <span key={index} className='text-white flex flex-row items-center gap-2 mb-2'>
                            {facility.icon} {facility.label}
                          </span>
                        )
                      )}
                    </div>
                  </>
                  <>
                    <h1 className="text-white font-semibold text-3xl mt-4">Description</h1>
                    <p className="text-gray-600">{property?.description}</p>
                  </>
                </div>
                <div>
                  <div className="flex items-center">
                    <LiaStarSolid className="text-yellow-600" />
                    <LiaStarSolid className="text-yellow-600" />
                    <LiaStarSolid className="text-yellow-600" />
                    <LiaStarSolid className="text-yellow-600" />
                    <LiaStarSolid className="text-yellow-600" />
                  </div>
                  <h2 className="text-white">Price</h2>
                  <span className="flex flex-row items-end">
                    <h1 className="text-blue-500 text-3xl">${property?.price}</h1>
                    <small className="text-gray-600 text-lg font-semibold">
                      /{property?.status === 'rent' ? 'Per Month' : 'Sell Price'}
                    </small>
                  </span>
                </div>
              </div>
            </div>
            <div className="w-1/3 h-max border-2 border-[rgb(35,38,41)] p-4 rounded-md flex items-center justify-center flex-col relative">
              <img src={`${import.meta.env.VITE_FILES_URL}${propertyLister?.avatar}`} className="w-[200px]" /> 
              <p className="text-white">{propertyLister?.firstname} {propertyLister?.lastname}</p>
              <p className="text-gray-500">{propertyLister?.role}</p>
              <span className="text-gray-500 flex items-center gap-2"><FaLocationDot/>{propertyLister?.state}, {propertyLister?.country}</span>
              <p className="text-white">{propertiesCount} {propertiesCount && propertiesCount >= 2 ? 'properties' : 'property'}</p>
              <BsThreeDotsVertical className="absolute top-3 right-3 text-gray-500 cursor-pointer" onClick={()=>{setMenuOpened(!menuOpened)}} />
                {menuOpened && (
                  <div
                  ref={menuRef}
                  className="absolute top-10 text-white right-10 bg-[rgb(20,22,24)] rounded-md shadow-md"
                >
                  <Link
                    to={`/agents/${propertyLister?._id}`}
                    className="block hover:bg-gray-500 py-2 px-4 rounded-md"
                  >
                    View Agent
                  </Link>
                  <Link
                    to={`/agents/edit/${propertyLister?._id}`}
                    className="block hover:bg-gray-500 py-2 px-4 rounded-md"
                  >
                    Edit Agent
                  </Link>
                 
                </div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

