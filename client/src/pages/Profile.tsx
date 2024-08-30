import React, { useEffect, useState, useRef } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { AgentType, Property } from '../types';
import axios from 'axios';
import Banner from '../assets/banner.webp';
import { FaLocationDot } from 'react-icons/fa6';
import { FaPhoneAlt } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';
import { FaPen } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { IoBedOutline } from 'react-icons/io5';
import { BiArea } from 'react-icons/bi';
import { HiOutlineDotsVertical } from 'react-icons/hi';

export default function Profile() {
  const { currentUser } = useAuthContext();
  const [profileData, setProfileData] = useState<AgentType>();
  const [activeListings, setActiveListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchAgent = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}agents/${currentUser?._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('personal_token')}`
        }
      });
      if (response.status === 200) {
        setProfileData(response.data.agent);
        setActiveListings(response.data.activeListings);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchAgent();
    }
  }, [currentUser]);

  const toggleMenu = (id: string) => {
    setPropertyId(id === propertyId ? null : id);
  };

  const handleDeleteProperty = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_BASE_URL}properties/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('personal_token')}`
        }
      });
      setActiveListings(activeListings.filter(property => property._id !== id));
      setPropertyId(null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setPropertyId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='p-4'>
      <h1 className='text-white text-2xl mb-5'>My Profile</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className='bg-[rgb(26,28,30)] p-3 rounded-md flex flex-row gap-10 relative'>
          <div className='relative w-max'>
            <div>
              <img src={Banner} alt="Banner" className='rounded-l-lg w-[400px]' />
            </div>
            <div className='absolute top-10 -right-10'>
              <img
                src={`${import.meta.env.VITE_FILES_URL}${currentUser?.avatar}`}
                alt="Avatar"
                className='w-20 rounded-full border-2 border-white'
              />
            </div>
          </div>
          <div className='px-5'>
            <h1 className='text-white text-2xl'>{currentUser?.firstname} {currentUser?.lastname}</h1>
            <h3 className='text-xl text-gray-500 mb-2'>{currentUser?.role}</h3>
            <div className='flex flex-col mb-2'>
              <label className='text-gray-500 flex items-center'>Address</label>
              <div className='border border-gray-700 p-1 rounded-md bg-transparent text-white flex items-center'>
                <FaLocationDot className='mr-2 text-gray-500' />
                {`${currentUser?.country || ''}, ${currentUser?.state || ''} ${currentUser?.zipcode || ''}`}
              </div>
            </div>
            <div className='flex flex-row w-full'>
              <div className='flex flex-col mr-4 w-[300px]'>
                <label className='text-gray-500'>Phone Number</label>
                <div className='border border-gray-700 p-1 rounded-md bg-transparent text-white flex items-center'>
                  <FaPhoneAlt className='mr-2 text-gray-500' />
                  {currentUser?.phone || 'N/A'}
                </div>
              </div>
              <div className='flex flex-col w-[300px]'>
                <label className='text-gray-500'>Email</label>
                <div className='border border-gray-700 p-1 rounded-md bg-transparent text-white flex items-center'>
                  <IoMdMail className='mr-2 text-gray-500' />
                  {currentUser?.email || 'N/A'}
                </div>
              </div>
            </div>
          </div>
          <Link to='/profile/edit'>
            <FaPen className='absolute right-5 top-5 text-gray-500 text-2xl cursor-pointer' />
          </Link>
        </div>
      )}
      <div className='bg-[rgb(26,28,30)] p-2 rounded-md mt-10'>
        {activeListings.length > 0 && (
          <div className="mt-5">
            <div className="flex items-center justify-center">
              {loading ? (
                <AiOutlineLoading3Quarters className="text-white animate-spin text-6xl" />
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {activeListings.map((property: Property) => (
                    <div key={property._id} className="flex flex-row p-3 items-center gap-10 m-10 bg-[rgb(18,19,21)] rounded-md h-[200px] w-[530px] relative">
                      <div>
                        <img
                          src={`${import.meta.env.VITE_FILES_URL}${property.photo}`}
                          alt="Property"
                          className="rounded-md w-[200px] h-[120px] object-cover"
                        />
                      </div>
                      <div className="text-white">
                        <h1 className="text-xl font-semibold">{property.title}</h1>
                        <h1 className="flex items-center gap-1 text-gray-500">
                          <FaLocationDot /> {property.state}, {property.country}
                        </h1>
                        <div className="flex justify-between items-center text-white">
                          <span className="flex items-center font-semibold gap-1">
                            <IoBedOutline className="text-xl" /> {property.beds}
                          </span>
                          <span className="flex items-center font-semibold gap-1">
                            <BiArea className="text-xl" /> {property.surface}M²
                          </span>
                        </div>
                        <h2 className="bg-[rgb(26,27,30)] w-max py-1 px-2 rounded-md text-blue-500 font-semibold">
                          ${property.price}
                        </h2>
                        <div>
                          <HiOutlineDotsVertical
                            onClick={() => toggleMenu(property._id)}
                            className="text-white absolute top-5 right-3 cursor-pointer"
                          />
                          {property._id === propertyId && (
                            <div
                              ref={menuRef}
                              className="absolute top-10 text-white right-10 bg-[rgb(20,22,24)] rounded-md shadow-md"
                            >
                              <Link
                                to={`/properties/${property._id}`}
                                className="block hover:bg-gray-500 py-2 px-4 rounded-md"
                              >
                                View Property
                              </Link>
                              <Link
                                to={`/properties/edit/${property._id}`}
                                className="block hover:bg-gray-500 py-2 px-4 rounded-md"
                              >
                                Edit Property
                              </Link>
                              <button
                                onClick={() => handleDeleteProperty(property._id)}
                                className="block w-full text-left hover:bg-gray-500 py-2 px-4 rounded-md"
                              >
                                Delete Property
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
