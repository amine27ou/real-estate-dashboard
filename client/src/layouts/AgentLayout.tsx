import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useToastContext } from '../contexts/ToastContext';
import Toast from '../components/Toast';
import { useState } from 'react';

export default function AgentLayout() {
  const { toastMessage } = useToastContext();
  const [menuOpened, setMenuOpened] = useState(false);

  const handleClickOutside = () => {
    if (menuOpened) {
      setMenuOpened(false);
    }
  };

  return (
    <div className="bg-[rgb(26,28,30)] fixed inset-0 flex flex-col">
      {toastMessage.message && (
        <div className='fixed top-20 right-20'>
          <Toast type={toastMessage.type} message={toastMessage.message} />
        </div>
      )}
      <Navbar setMenuOpened={setMenuOpened} menuOpened={menuOpened} />
      <div className="flex flex-row flex-1">
        <Sidebar />
        <div className="flex-1 overflow-y-auto" onClick={handleClickOutside}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
