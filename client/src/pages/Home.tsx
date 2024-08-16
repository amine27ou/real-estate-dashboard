import { useAuthContext } from '../contexts/AuthContext';

export default function Home() {
  const { currentUser } = useAuthContext();
  
  
  return (
    <div className='w-full min-h-screen bg-[rgb(17,18,20)]'>
      <h1 className='text-white'>Home</h1>
      {currentUser ? (
        <p className='text-white'>Welcome, {currentUser.firstname}!</p>
      ) : (
        <p className='text-white'>Loading user information...</p>
      )}
    </div>
  );
}
