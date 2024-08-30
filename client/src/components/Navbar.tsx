import logo from '../assets/logo.svg'
import { useAuthContext } from '../contexts/AuthContext'
import { IoLogOutOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

type NavbarProps = {
  setMenuOpened: (open: boolean) => void;
  menuOpened: boolean;
};

export default function Navbar({ setMenuOpened, menuOpened }: NavbarProps) {
  const { currentUser, loading, logout } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      localStorage.removeItem('personal_token');
      navigate('/login');
    }
  }, [loading, currentUser, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='bg-[rgb(26,28,30)] p-5 flex items-center justify-between relative'>
      <div className="flex items-center gap-2">
        <img src={logo} alt='logo' />
        <h1 className='font-poppins text-white text-2xl font-semibold'>Yarigo</h1>
      </div>
      <div onClick={() => setMenuOpened(!menuOpened)} className='flex items-center justify-center gap-2 bg-[rgb(41,43,45)] p-1 cursor-pointer rounded-md'>
        <img src={`${import.meta.env.VITE_FILES_URL}${currentUser?.avatar}`} alt='profile' className='h-[50px] object-cover rounded-full w-[50px]' />
        <div>
          <p className='text-white text-sm'>{currentUser?.firstname} {currentUser?.lastname}</p>
          <p className='text-gray-400 text-sm'>{currentUser?.role}</p>
        </div>
      </div>
      {menuOpened && (
        <div className='bg-[rgb(41,43,45)] absolute top-[100px] right-10 flex flex-col rounded-md w-52 z-10'>
          <button className='m-2 hover:text-[rgb(72,96,233)] p-2 text-gray-400 flex items-center gap-2'>
            <FaUserCircle className='text-xl' /><span>My Profile</span>
          </button>
          <button onClick={logout} className='m-2 hover:text-[rgb(72,96,233)] p-2 text-gray-400 flex items-center gap-2'>
            <IoLogOutOutline className='text-xl' /><span>Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
