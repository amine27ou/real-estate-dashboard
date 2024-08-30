import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Country, State } from "country-state-city";
import { useAuthContext } from "../contexts/AuthContext";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { AgentType } from "../types";

export default function Register() {
  const {register,currentUser} = useAuthContext()
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()
  const [agentInfo, setAgentInfo] = useState<AgentType>({
    _id:'',
    firstname: "",
    lastname: "",
    birthdate: "",
    phone: "",
    gender: "",
    country: "",
    state: "",
    zipcode:0,
    email: "",
    password: "",
    avatar:"",
    role:"",
  });

  type State  = {
    countryCode:string,
    isoCode:string,
    latitude?:string | null,
    longitude?:string | null,
    name:string,
  }

  
  const [countryStates, setCountryStates] = useState<State[]>([]);
  useEffect(() => {
    if (agentInfo.country) {
      const states = State.getStatesOfCountry(agentInfo.country);
      setCountryStates(states);
    } else {
      setCountryStates([]);
    }
  }, [agentInfo.country]);


  useEffect(()=>{
    if(currentUser){
      navigate('/properties')
    }
  },[currentUser])
  
  const handleChange = (e:any) => {
    const {name,type,value,files} = e.target
    setAgentInfo({ ...agentInfo, [name]: type === 'file' ? files[0] : value });
  };
  
  const handleSubmit = (e:any)=>{
    e.preventDefault()
    setLoading(true)
    try{
      register(agentInfo).then(()=>{
        setLoading(false)
      })
    }catch(err){
      setLoading(false)
      console.error(err)
    }
  }
  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 flex justify-center items-center flex-col">
        <div className="flex flex-col">
          <h1 className="text-4xl font-semibold font-poppins mt-20">Welcome back</h1>
          <p className="text-gray-500">
            Welcome back! Please enter your details.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col mt-10 w-1/2 p-10 flex-wrap" >
          <div className="flex flex-col">
            <label>First Name</label>
            <input
              type="text"
              name="firstname"
              value={agentInfo.firstname}
              onChange={handleChange}
              placeholder="John"
              className="border-gray-400 border p-2 my-3 w-full rounded-md outline-none"
              required
            />
          </div>
          <div className="flex flex-col">
            <label>Last Name</label>
            <input
              type="text"
              name="lastname"
              value={agentInfo.lastname}
              onChange={handleChange}
              placeholder="Doe"
              className="border-gray-400 border p-2 my-3 w-full rounded-md outline-none"
              required
            />
          </div>
          <div className="flex flex-col">
            <label>Birthdate</label>
            <input
              type="date"
              name="birthdate"
              value={agentInfo.birthdate}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]} // Set max to today's date
              className="border-gray-400 border p-2 my-3 w-full rounded-md outline-none"
              required
            />
          </div>
          <div className="flex flex-col">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={agentInfo.phone}
              onChange={handleChange}
              placeholder="+012 345 5678"
              className="border-gray-400 border p-2 my-3 w-full rounded-md outline-none"
              required
            />
          </div>
          <div className="flex flex-col">
            <label>Gender</label>
            <select
              name="gender"
              value={agentInfo.gender}
              onChange={handleChange}
              className="border-gray-400 border p-2 my-3 w-full rounded-md outline-none bg-white"
              required
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label>Country</label>
            <select
              name="country"
              value={agentInfo.country}
              onChange={handleChange}
              className="border-gray-400 border p-2 my-3 w-full rounded-md outline-none bg-white"
              required
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
            <label>State</label>
            <select
              name="state"
              value={agentInfo.state}
              onChange={handleChange}
              className="border-gray-400 border p-2 my-3 w-full rounded-md outline-none bg-white"
              required
            >
              <option value="" disabled>Select a state</option>
              {countryStates.map((state:State) => (
                <option key={state.isoCode} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label>Postal Code</label>
            <input
              type="number"
              name="zipcode"
              value={agentInfo.zipcode}
              onChange={handleChange}
              placeholder="123456"
              className="border-gray-400 border p-2 my-3 w-full rounded-md outline-none"
              required
            />
          </div><div className="flex flex-col">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={agentInfo.email}
              onChange={handleChange}
              placeholder="example@email.co"
              className="border-gray-400 border p-2 my-3 w-full rounded-md outline-none"
              required
            />
          </div>
          <div className="flex flex-col">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={agentInfo.password}
              onChange={handleChange}
              placeholder="**********"
              className="border-gray-400 border p-2 my-3 w-full rounded-md outline-none"
              required
            />
          </div>
          <div className="flex flex-col">
            <label>Avatar</label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
              className="border-gray-400 border p-2 my-3 w-full rounded-md outline-none"
              required
            />
          </div>
          <button type="submit" className="bg-[#465AE8] text-white p-2 rounded-md my-3">
            {loading ? <AiOutlineLoading3Quarters className="animate-spin text-white" /> : 'Sign Up'}
          </button>
          <button className="mt-3 border p-2 rounded-md">Sign in with Google</button>
          <p className="mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-[#465AE8]">
              Sign in
            </Link>
          </p>
        </form>
      </div>
      <div className="w-1/2 lg:bg-login-banner bg-cover bg-center sm:bg-none fixed top-0 right-0 bottom-0">
        {/* This div will have the background image */}
      </div>
    </div>
  );
}
