import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Country, State } from "country-state-city";
import { useAuthContext } from "../contexts/AuthContext";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { AgentType } from "../types";
import axios from "axios";
import { useToastContext } from "../contexts/ToastContext";

export default function EditProfile() {
  const { register, currentUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {setToastMessage} = useToastContext()
  const [agentInfo, setAgentInfo] = useState<AgentType>({
    _id: "",
    firstname: "",
    lastname: "",
    birthdate: "",
    phone: "",
    gender: "",
    country: "",
    state: "",
    zipcode: 0,
    email: "",
    password: "",
    avatar: "",
    role: "",
  });

  type StateType = {
    countryCode: string;
    isoCode: string;
    latitude?: string | null;
    longitude?: string | null;
    name: string;
  };

  const [countryStates, setCountryStates] = useState<StateType[]>([]);
  
  useEffect(() => {
    if (agentInfo.country) {
      const states = State.getStatesOfCountry(agentInfo.country);
      setCountryStates(states);
    } else {
      setCountryStates([]);
    }
  }, [agentInfo.country]);

  useEffect(() => {
    if (currentUser) {
      setAgentInfo({
        _id: currentUser?._id,
        firstname: currentUser?.firstname,
        lastname: currentUser?.lastname,
        birthdate: currentUser?.birthdate,
        phone: currentUser?.phone,
        gender: currentUser?.gender,
        country: currentUser?.country,
        state: currentUser?.state,
        zipcode: currentUser?.zipcode,
        email: currentUser?.email,
        password: currentUser?.password,
        avatar: currentUser?.avatar,
        role: currentUser?.role,
      });
    }
  }, [currentUser]);

  const handleChange = (e: any) => {
    const { name, type, value, files } = e.target;
    setAgentInfo({ ...agentInfo, [name]: type === "file" ? files[0] : value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(`${import.meta.env.VITE_SERVER_BASE_URL}agents/${currentUser?._id}`,agentInfo,{
        headers:{
            'Authorization':`Bearer ${localStorage.getItem('personal_token')}`,
            "Content-Type":"multipart/form-data"
        }
      })
      if(response.status === 200){
        setToastMessage({
            type:response.data.status,
            message:response.data.message
        })
        setLoading(false);
        navigate('/profile')
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-2/3 flex justify-center items-center flex-col">
        <div className="flex flex-col">
          <h1 className="text-4xl text-white font-semibold font-poppins mt-20">Welcome back</h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-[rgb(26,28,30)] rounded-md mt-10 w-full p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className='text-white'>First Name</label>
            <input
              type="text"
              name="firstname"
              value={agentInfo.firstname}
              onChange={handleChange}
              placeholder="John"
              className="border-gray-400 border p-2 my-3 w-full rounded-md outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className='text-white'>Last Name</label>
            <input
              type="text"
              name="lastname"
              value={agentInfo.lastname}
              onChange={handleChange}
              placeholder="Doe"
              className="border-gray-400 border p-2 my-3 w-full rounded-md outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className='text-white'>Birthdate</label>
            <input
              type="date"
              name="birthdate"
              value={agentInfo.birthdate}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]} // Set max to today's date
              className="border-gray-400 border p-2 my-3 w-full rounded-md outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className='text-white'>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={agentInfo.phone}
              onChange={handleChange}
              placeholder="+012 345 5678"
              className="border-gray-400 border p-2 my-3 w-full rounded-md outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className='text-white'>Gender</label>
            <select
              name="gender"
              value={agentInfo.gender}
              onChange={handleChange}
              className="border-gray-400 border p-2 my-3 w-full rounded-md outline-none bg-white"
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className='text-white'>Country</label>
            <select
              name="country"
              value={agentInfo.country}
              onChange={handleChange}
              className="border-gray-400 border p-2 my-3 w-full rounded-md outline-none bg-white"
            >
              <option value="" disabled>Select a country</option>
              {Country.getAllCountries().map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className='text-white'>State</label>
            <select
              name="state"
              value={agentInfo.state}
              onChange={handleChange}
              className="border-gray-400 border p-2 my-3 w-full rounded-md outline-none bg-white"
            >
              <option value="" disabled>Select a state</option>
              {countryStates.map((state: StateType) => (
                <option key={state.isoCode} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-white">Postal Code</label>
            <input
              type="number"
              name="zipcode"
              value={agentInfo.zipcode}
              onChange={handleChange}
              placeholder="123456"
              className="border-gray-400 border p-2 my-3 w-full rounded-md outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className='text-white'>Email</label>
            <input
              type="email"
              name="email"
              value={agentInfo.email}
              onChange={handleChange}
              placeholder="example@email.co"
              className="border-gray-400 border p-2 my-3 w-full rounded-md outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className='text-white'>Password</label>
            <input
              type="password"
              name="password"
              value={agentInfo.password}
              onChange={handleChange}
              placeholder="**********"
              className="border-gray-400 border p-2 my-3 w-full rounded-md outline-none"
            />
          </div>
          <div className="flex flex-col col-span-2">
            <label className='text-white'>Avatar</label>
            <input
              type="file"
              name="avatar"
              onChange={handleChange}
              className="text-white border-gray-400 border p-2 my-3 w-full rounded-md outline-none"
            />
          </div>
          <button type="submit" className="bg-[#465AE8] text-white p-2 rounded-md my-3 col-span-2">
            {loading ? <AiOutlineLoading3Quarters className="animate-spin text-white" /> : 'Update'}
          </button>
        </form>
      </div>
    </div>
  );
}
