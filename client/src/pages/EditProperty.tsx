import axios from "axios";
import { Country, State } from "country-state-city";
import { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToastContext } from "../contexts/ToastContext";
import { Property, StateType } from "../types";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function EditProperty() {
    const {setToastMessage} = useToastContext()
    const navigate = useNavigate()
    const [loading,setLoading] = useState<boolean>(true)
    const {id} = useParams()
    
    
    const [propertyData, setPropertyData] = useState<Property>({
        _id:"",
        title: '',
        description: '',
        propertyType: '',
        country: '',
        state: '',
        price: 0,
        beds: 0,
        photo: '',
        surface: 0,
        status: ''
    });

    

    const [countryStates, setCountryStates] = useState<StateType[]>([]);
    const cancel = ()=>{
        setPropertyData({
            _id:'',
            title: '',
            description: '',
            propertyType: '',
            country: '',
            state: '',
            price: 0,
            beds: 0,
            photo: '',
            surface: 0,
            status: ''
        })
    }

    const fetchProperty = async (propertyId: any) => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}properties/${propertyId}`, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('personal_token')}`
            }
          });
          if (response.status === 200) {
            setLoading(false);
            setPropertyData(response.data.property);
          }
        } catch (err) {
          setLoading(false);
          console.error(err);
        }
      };
    
      useEffect(() => {
        fetchProperty(id);
      }, [id]);

    useEffect(() => {
        if (propertyData.country) {
            const states = State.getStatesOfCountry(propertyData.country);
            setCountryStates(states);
        } else {
            setCountryStates([]);
        }
    }, [propertyData.country]);

    const handleChange =  (e: any) => {
        const {type,name,value,files} = e.target
        setPropertyData({ ...propertyData, [name]: type === "file" ? files[0] : value });
    }

    const handleSubmit = async(e: any) => {
        e.preventDefault();
        try{
            const response = await axios.put(`${import.meta.env.VITE_SERVER_BASE_URL}properties/${id}`,propertyData,{
                headers:{
                    "Authorization":`Bearer ${localStorage.getItem('personal_token')}`,
                    "Content-Type":"multipart/form-data"
                }
            })
            console.log(response)
            if(response.status === 200){
                 navigate('/properties')
                 setToastMessage({ type: response.data.status, message: response.data.message });
            }
        }catch(err:any){
            setToastMessage({ type: "ERROR", message: "An error has occured" });
        }
    }
    console.log(propertyData)

    return (
        <div className="bg-[rgb(17,18,20)] p-10">
            <div>
                <Link to='/' className="flex items-center text-white hover:text-[rgb(72,96,233)] w-max transition-all font-semibold text-md">
                    <IoIosArrowRoundBack className="text-2xl" />
                    <span>Back</span>
                </Link>
                <h1 className="text-2xl text-white mt-10">Create Property</h1>
            </div>
            <div className="bg-[rgb(41,43,45)] p-3 mt-10 rounded-md">
                {loading ? 
                    <div className="flex items-center justify-center">
                        <AiOutlineLoading3Quarters className="text-white animate-spin text-3xl" />
                    </div>
                : (
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-400">Property Title</label>
                        <input 
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Property Title"
                            value={propertyData.title}
                            onChange={handleChange}
                            className="bg-[rgb(17,18,20)] p-2 rounded-md outline-none text-gray-300 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-400">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Description"
                            value={propertyData.description}
                            onChange={handleChange}
                            className="bg-[rgb(17,18,20)] p-2 rounded-md outline-none text-gray-300 w-full h-[86px] resize-none"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="propertyType" className="block text-gray-400">Property Type</label>
                        <select 
                            id="propertyType"
                            name="propertyType"
                            value={propertyData.propertyType}
                            onChange={handleChange}
                            className="bg-[rgb(17,18,20)] p-3 rounded-md outline-none text-gray-500 w-full"
                        >
                            <option value='' disabled>Any Type</option>
                            <option value='Apartment'>Apartment</option>
                            <option value='House'>House</option>
                            <option value='Commercial'>Commercial</option>
                            <option value='Garage'>Garage</option>
                            <option value='Lot'>Lot</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="country" className="block text-gray-400">Country</label>
                        <select
                            id="country"
                            name="country"
                            value={propertyData.country}
                            onChange={handleChange}
                            className="bg-[rgb(17,18,20)] p-3 rounded-md outline-none text-gray-500 w-full"
                        >
                            <option value="" disabled>Any country</option>
                            {Country.getAllCountries().map((country) => (
                                <option key={country.isoCode} value={country.isoCode}>
                                    {country.flag} {country.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="state" className="block text-gray-400">State</label>
                        <select
                            id="state"
                            name="state"
                            value={propertyData.state}
                            onChange={handleChange}
                            className="bg-[rgb(17,18,20)] p-3 rounded-md outline-none text-gray-500 w-full"
                        >
                            <option value="" disabled>Any State</option>
                            {countryStates.map((state: StateType) => (
                                <option key={state.isoCode} value={state.name}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="price" className="block text-gray-400">Price</label>
                        <input 
                            type="number"
                            id="price"
                            name="price"
                            placeholder="Price"
                            value={propertyData.price}
                            onChange={handleChange}
                            className="bg-[rgb(17,18,20)] p-2 rounded-md outline-none text-gray-300 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="beds" className="block text-gray-400">Number of Beds</label>
                        <input 
                            type="number"
                            id="beds"
                            name="beds"
                            placeholder="Number of Beds"
                            value={propertyData.beds}
                            onChange={handleChange}
                            className="bg-[rgb(17,18,20)] p-2 rounded-md outline-none text-gray-300 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="photo" className="block text-gray-400">Photo</label>
                        <input 
                            type="file"
                            id="photo"
                            name="photo"
                            onChange={handleChange}
                            className="bg-[rgb(17,18,20)] p-2 rounded-md outline-none text-gray-300 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="surface" className="block text-gray-400">Surface Area</label>
                        <input 
                            type="number"
                            id="surface"
                            name="surface"
                            placeholder="Surface Area"
                            value={propertyData.surface}
                            onChange={handleChange}
                            className="bg-[rgb(17,18,20)] p-2 rounded-md outline-none text-gray-300 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="status" className="block text-gray-400">Status</label>
                        <select 
                            id="status"
                            name="status"
                            value={propertyData.status}
                            onChange={handleChange}
                            className="bg-[rgb(17,18,20)] p-2 rounded-md outline-none text-gray-300 w-full"
                        >
                            <option value="">Select Status</option>
                            <option value="rent">For Rent</option>
                            <option value="sell">For Sell</option>
                        </select>
                    </div>
                    <div className="md:col-span-2 flex flex-row gap-5">
                        <button 
                            type="submit"
                            className="bg-[rgb(72,96,233)] p-2 rounded-md text-white w-max"
                        >
                            Update Property
                        </button>
                        <button 
                            onClick={cancel}
                            className="bg-gray-400 p-2 rounded-md text-white w-max"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
                )}
            </div>
        </div>
    )
}
