import { Country, State } from "country-state-city";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Property, SearchFilterType, StateType } from "../types";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaLocationDot } from "react-icons/fa6";
import { IoBedOutline } from "react-icons/io5";
import { BiArea } from "react-icons/bi";


export default function Properties() {
  const [properties,setproperties] = useState<Property[]>([])
  const [loading,setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchFilter, setSearchFilter] = useState<SearchFilterType>({
    title: "",
    country: "",
    state: "",
    propertyType:"",
    status:''
  });

  
  const [countryStates, setCountryStates] = useState<StateType[]>([]);
  useEffect(() => {
    if (searchFilter.country) {
      const states = State.getStatesOfCountry(searchFilter.country);
      setCountryStates(states);
    } else {
      setCountryStates([]);
    }
  }, [searchFilter.country]);

  const handleChange = (e: any) => {
    setSearchFilter({...searchFilter,[e.target.name]:e.target.value})
  };

  const fetchProperties = async(page:number)=>{
    try{
      const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}properties`,{

        params: {
          ...searchFilter,
          page,
          limit: 10,
        },  
        headers:{
          'Authorization':`Bearer ${localStorage.getItem('personal_token')}`
        }
      }
    )

      if(response.status === 200){
        setproperties(response.data.properties)
        setTotalPages(response.data.totalPages);
        setLoading(false)
      }
    }catch(err){
      setLoading(false)
      console.error(err)
    }
  }
  useEffect(()=>{
    fetchProperties(currentPage)
  },[searchFilter,currentPage])
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className="bg-[rgb(17,18,20)] p-10">
      <div className="bg-[rgb(26,28,30)] mb-10 rounded-md flex flex-row items-center justify-between p-10">
        <h1 className="text-white text-xl">Property List</h1>
        <Link to='/properties/add' className="py-3 px-4 text-white bg-[rgb(72,96,233)] rounded-md">
          + Add Property
        </Link>
      </div>

      <div className="bg-[rgb(26,28,30)] rounded-md p-5">
        <div className="flex flex-row gap-3 items-center flex-wrap justify-center">
          <div>
            <input
              type="text"
              name="title"
              placeholder="Property Title"
              className="bg-[rgb(17,18,20)]  p-3 placeholder:text-gray-500 rounded-md outline-none text-white"
            />
          </div>
          
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
              {countryStates.map((state:StateType) => (
                <option key={state.isoCode} value={state.name}>
                    {state.name}
                </option>
              ))}
            </select>
          </div>

              <div>
                <select 
                name='propertyType'
                value={searchFilter.propertyType}
                onChange={handleChange}
                className="bg-[rgb(17,18,20)] w-[300px] p-3 placeholder:text-gray-500 rounded-md outline-none text-gray-500"  
                >
                    <option value='' disabled selected>Any Type</option>
                    <option value='apartments'>Apartments</option>
                    <option value='houses'>Houses</option>
                    <option value='commercial'>Commercial</option>
                    <option value='garages'>Garages</option>
                    <option value='lots'>Lots</option>
                </select>
              </div>
              <div>
                <select 
                name='status'
                value={searchFilter.status}
                onChange={handleChange}
                className="bg-[rgb(17,18,20)] w-[300px] p-3 placeholder:text-gray-500 rounded-md outline-none text-gray-500"  
                >
                    <option value='' disabled selected>Any Status</option>
                    <option value='sell'>For Sell</option>
                    <option value='rent'>For Rent</option>
                </select>
              </div>

        </div>

        <div className="mt-5">
              <div className="flex items-center justify-center">
                {loading ? <AiOutlineLoading3Quarters className="text-white animate-spin text-6xl" /> : (
                  <div className="grid grid-cols-2">
                    {properties.map((property:Property)=>(
                      <div className="flex flew-row items-center gap-2 m-10">
                        <div>
                          <img src={`${import.meta.env.VITE_FILES_URL}${property.photo}`} className='rounded-md h-[150px] object-contain' />
                        </div>
                        <div className="text-white">
                            <span className="bg-[rgb(17,18,20)]  p-2 rounded-md mb-2 text-blue-500 font-semibold">{property.price}</span>
                            <h1 className="text-xl font-semibold">{property.title}</h1>
                            <h1 className="flex items-center gap-1 text-gray-500"><FaLocationDot/> {property.state},{property.country}</h1>
                            <div className="flex justify-between items-center text-white">
                              <span className="flex items-center font-semibold gap-1"><IoBedOutline className="text-xl" /> {property.beds}</span>
                              <span className="flex items-center font-semibold gap-1"><BiArea className="text-xl" /> {property.surface}M</span>
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
                  <span className="text-white mx-2">Page {currentPage} of {totalPages}</span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="text-blue-500 bg-[rgb(17,18,20)] p-2 rounded-md mx-2 cursor-pointer"
                  >
                    Next
                  </button>
                </div>

        </div>
      </div>
    </div>
  );
}
