import { FaChevronLeft } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import {Property} from '../types'
import { useEffect, useState } from "react";
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

export default function DetailedProperty() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property>();
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProperty = async (propertyId: any) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}properties/${propertyId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('personal_token')}`
        }
      });
      if (response.status === 200) {
        setLoading(false);
        setProperty(response.data.property);
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
              <div className="w-[950px]">
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
                      {property?.status === 'rent' ? 'Per Month' : 'Sell Price'}
                    </small>
                  </span>
                </div>
              </div>
            </div>
            <div className="1/3">
              Agent section
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

