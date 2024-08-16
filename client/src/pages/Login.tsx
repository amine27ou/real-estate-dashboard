import  { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Login() {
  const {login,errors} = useAuthContext()
  const [loading,setLoading] = useState(false)
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
  const handleChange = (e:any)=>{
    setLoginInfo({...loginInfo,[e.target.name]:e.target.value})
  }

  const handleSubmit = async(e:any)=>{
    e.preventDefault()
    setLoading(true)
    try{
      login(loginInfo).then(()=>{
        setLoading(false)
      })
    }catch(err:any){
      setLoading(false)
    }
  }
  return (
    <div className="flex h-screen">
      <div className="lg:w-1/2 md:w-full flex justify-center items-center flex-col">
      <div className='flex flex-col '>
            <h1 className='text-4xl font-semibold font-poppins'>Welcome back</h1>
            <p className='text-gray-500'>Welcome back! Please enter your details.</p>
      </div>
      <form onSubmit={handleSubmit} className='flex flex-col mt-10 lg:w-1/2 md:w-full justify-center p-10 '>
        <div className='flex flex-col'>
            <label>Email</label>
            <input 
            type='email'
            name='email'
            placeholder='Enter your email'
            className='border-gray-400 border p-2 my-3 w-full rounded-md outline-none'
            onChange={handleChange}
            required
            />
        </div><div className='flex flex-col'>
            <label>Password</label>
            <input 
            type='password'
            name='password'
            placeholder='**********'
            className='border-gray-400 border p-2 my-3 w-full rounded-md outline-none'
            onChange={handleChange}
            required
            />
            {errors && (<p className='text-red-500'>{errors}</p>)}
        </div>
        <button type='submit' className='flex items-center justify-center bg-[#465AE8] text-white p-2 rounded-md my-3'>{loading ? <AiOutlineLoading3Quarters className='animate-spin text-white ' /> :'Sign in'}</button>
        <button className="mt-3 border p-2 rounded-md mb-4">Sign in with Google</button>
        <p>Don't have an account <Link to='/register' className='text-[#465AE8]'>Sign up</Link></p>
      </form>
      </div>
      <div className="w-1/2 lg:bg-login-banner bg-cover bg-center hidden lg:block">
        {/* This div will have the background image */}
      </div>
    </div>
  );
}
