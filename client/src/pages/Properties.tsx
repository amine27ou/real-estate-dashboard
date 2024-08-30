import { Country, State } from "country-state-city";
import {useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Property, SearchFilterType, StateType } from "../types";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BiArea } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
import { IoBedOutline } from "react-icons/io5";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useToastContext } from "../contexts/ToastContext";

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchFilter, setSearchFilter] = useState<SearchFilterType>({
    country: "",
    state: "",
    propertyType: "",
    status: ""
  });
  const {setToastMessage} = useToastContext() 
  const [countryStates, setCountryStates] = useState<StateType[]>([]);
  const [propertyId,setPropertyId] = useState<string|null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (searchFilter.country) {
      const states = State.getStatesOfCountry(searchFilter.country);
      setCountryStates(states);
    } else {
      setCountryStates([]);
    }
  }, [searchFilter.country]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchFilter({ ...searchFilter, [e.target.name]: e.target.value });
  };

  const fetchProperties = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}properties`, {
        params: {
          ...searchFilter,
          page,
          limit: 10,
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('personal_token')}`
        }
      });

      if (response.status === 200) {
        setProperties(response.data.properties);
        setTotalPages(response.data.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(currentPage);
  }, [searchFilter, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const toggleMenu = (id: string) => {
    setPropertyId(propertyId === id ? null : id);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setPropertyId(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_BASE_URL}properties/${propertyId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('personal_token')}`,
          },
        }
      );
  
      if (response.status === 200 || response.status === 201) {
        setToastMessage({type:response.data.status,message:response.data.message});
      } else {
        setToastMessage({type:'fail',message:'Something went wrong.'});
      }
    } catch (err) {
      console.error('Failed to delete property:', err);
      setToastMessage({type:'fail',message:'Error occurred while deleting the property.'});
    }
  };


  return (
    <div className="bg-[rgb(17,18,20)] p-10">
      <div className="bg-[rgb(26,28,30)] mb-10 rounded-md flex flex-row items-center justify-between p-10">
        <h1 className="text-white text-xl">Property List</h1>
        <Link to="/properties/add" className="py-3 px-4 text-white bg-[rgb(72,96,233)] rounded-md">
          + Add Property
        </Link>
      </div>

      <div className="bg-[rgb(26,28,30)] rounded-md p-5">
          <div>
            <div className="flex flex-row gap-3 items-center flex-wrap justify-center">

              <div>
                <select
                  name="country"
                  value={searchFilter.country}
                  onChange={handleChange}
                  className="bg-[rgb(17,18,20)]  p-3 placeholder:text-gray-500 rounded-md outline-none text-gray-500"
                >
                  <option value="" disabled>
                    Any country
                  </option>
                  {Country.getAllCountries().map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  name="state"
                  value={searchFilter.state}
                  onChange={handleChange}
                  className="bg-[rgb(17,18,20)] w-[300px] p-3 placeholder:text-gray-500 rounded-md outline-none text-gray-500"
                >
                  <option value="" disabled>
                    Any State
                  </option>
                  {countryStates.map((state: StateType) => (
                    <option key={state.isoCode} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  name="propertyType"
                  value={searchFilter.propertyType}
                  onChange={handleChange}
                  className="bg-[rgb(17,18,20)] w-[300px] p-3 placeholder:text-gray-500 rounded-md outline-none text-gray-500"
                >
                  <option value="" disabled>
                    Any Type
                  </option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Garage">Garage</option>
                  <option value="Lot">Lot</option>
                </select>
              </div>

              <div>
                <select
                  name="status"
                  value={searchFilter.status}
                  onChange={handleChange}
                  className="bg-[rgb(17,18,20)] w-[300px] p-3 placeholder:text-gray-500 rounded-md outline-none text-gray-500"
                >
                  <option value="" disabled>
                    Any Status
                  </option>
                  <option value="sell">For Sell</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
              <button className="text-gray-500 " onClick={()=>{setSearchFilter({
                  country: "",
                  state: "",
                  propertyType: "",
                  status: ""})}}>Clear Filters</button>
            </div>

            {properties && properties.length > 0 ? (  
            <div className="mt-5">
              <div className="flex items-center justify-center">
                {loading ? (
                  <AiOutlineLoading3Quarters className="text-white animate-spin text-6xl" />
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {properties.map((property: Property) => (
                      <div key={property._id} className="flex flew-row p-3 items-center gap-10 m-10 bg-[rgb(18,19,21)]  rounded-md h-[200px] w-[530px] relative">
                        <div>
                          <img
                            src={`${import.meta.env.VITE_FILES_URL}${property.photo}`}
                            className="rounded-md w-[200px] h-[120px] object-cover"
                            alt="Property"
                          />
                        </div>
                        <div className="text-white ">
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
                          <h2 className="bg-[rgb(26,27,30)] w-max py-1 px-2 rounded-md  text-blue-500 font-semibold">
                            ${property.price}
                          </h2>
                          <div>
                           
                            <HiOutlineDotsVertical onClick={()=>{toggleMenu(property._id)}} className="text-white absolute top-5 right-3 cursor-pointer" />
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
                    <button onClick={()=>{handleDeleteProperty(property._id)}} className="block w-full text-left hover:bg-gray-500 py-2 px-4 rounded-md">
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

              <div className="flex justify-center items-center mt-5">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="text-blue-500 bg-[rgb(17,18,20)] p-2 rounded-md mx-2 cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-white mx-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="text-blue-500 bg-[rgb(17,18,20)] p-2 rounded-md mx-2 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
        ) : (
          <h1 className="text-white text-2xl">There are no properties</h1>
        )}
          </div>
      </div>
    </div>
  );
}
