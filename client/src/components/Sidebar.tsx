import { NavLink } from 'react-router-dom';
import { RxDashboard } from "react-icons/rx";
import { FaRegBuilding } from "react-icons/fa";
import { IoPeopleOutline } from "react-icons/io5";
import { FaRegStar } from "react-icons/fa";
import { BiMessageDetail } from "react-icons/bi";
import { IoPersonCircleOutline } from "react-icons/io5";

export default function Sidebar() {
  return (
    <div className='bg-[rgb(26,28,30)] relative w-[250px]'>
        <div className='links absolute p-10 flex flex-col space-y-2'>
            <NavLink 
              to='/' 
              className={({ isActive }) =>
                isActive ? 'bg-[rgb(72,96,233)] text-white flex items-center gap-4 py-3 px-6 transition-all rounded-md' 
                         : 'text-gray-500 hover:text-white flex items-center gap-4 py-3 px-6 transition-all rounded-md hover:bg-[rgb(72,96,233)]'
              }
            >
              <RxDashboard className='text-xl' />
              <span className='font-poppins '>Dashboard</span>
            </NavLink>
            <NavLink 
              to='/properties' 
              className={({ isActive }) =>
                isActive ? 'bg-[rgb(72,96,233)] text-white flex items-center gap-4 py-3 px-6 transition-all rounded-md' 
                         : 'text-gray-500 hover:text-white flex items-center gap-4 py-3 px-6 transition-all rounded-md hover:bg-[rgb(72,96,233)]'
              }
            >
              <FaRegBuilding className='text-xl' />
              <span className='font-poppins '>Property</span>
            </NavLink>
            <NavLink 
              to='/agents' 
              className={({ isActive }) =>
                isActive ? 'bg-[rgb(72,96,233)] text-white flex items-center gap-4 py-3 px-6 transition-all rounded-md' 
                         : 'text-gray-500 hover:text-white flex items-center gap-4 py-3 px-6 transition-all rounded-md hover:bg-[rgb(72,96,233)]'
              }
            >
              <IoPeopleOutline className='text-xl' />
              <span className='font-poppins '>Agent</span>
            </NavLink>
            <NavLink 
              to='/reviews' 
              className={({ isActive }) =>
                isActive ? 'bg-[rgb(72,96,233)] text-white flex items-center gap-4 py-3 px-6 transition-all rounded-md' 
                         : 'text-gray-500 hover:text-white flex items-center gap-4 py-3 px-6 transition-all rounded-md hover:bg-[rgb(72,96,233)]'
              }
            >
              <FaRegStar className='text-xl' />
              <span className='font-poppins '>Review</span>
            </NavLink>
            
            <NavLink 
              to='/profile' 
              className={({ isActive }) =>
                isActive ? 'bg-[rgb(72,96,233)] text-white flex items-center gap-4 py-3 px-6 transition-all rounded-md' 
                         : 'text-gray-500 hover:text-white flex items-center gap-4 py-3 px-6 transition-all rounded-md hover:bg-[rgb(72,96,233)]'
              }
            >
              <IoPersonCircleOutline className='text-xl' />
              <span className='font-poppins '>My Profile</span>
            </NavLink>
        </div>
    </div>
  );
}
