import axios from 'axios';
import { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'; 
import 'react-circular-progressbar/dist/styles.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Home() {  
  type DashboardData = {
    propertiesForSell: number;
    propertiesForRent: number;
    totalAgents: number;
    totalProperties: number;
  };

  const [data, setData] = useState<DashboardData | null>(null);

  const getGeneralData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}dashboard-data`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('personal_token')}`
        }
      });
      if (response.status === 200) {
        setData(response.data.dashboard_data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getGeneralData();
  }, []);

  const generalBarOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Dashboard Overview',
      },
    },
  };

  const expenseBarData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Expenses',
        data: [20000, 35500, 50000, 24000, 9000, 64000, 73400],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const expenseBarOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Expenses',
      },
    },
  };

  return (
    <div className='w-full min-h-screen bg-[rgb(17,18,20)] p-5'>
      <h1 className='text-white text-2xl mb-2'>Dashboard</h1>
      <div className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 justify-center gap-20'>
        <div className='bg-[rgb(26,28,30)] p-2 w-max rounded-md'>
          <div className='flex items-center justify-center gap-10'>
            <div className='flex flex-col'>
              <h2 className='text-gray-500 text-2xl'>Properties for Sell</h2>
              <span className='text-white text-xl text-center'>{data?.propertiesForSell}</span>
            </div>
            <div className='w-20'>
              <CircularProgressbar
                styles={buildStyles({
                  rotation: 0.25,
                  strokeLinecap: 'butt',
                  textSize: '16px',
                  pathTransitionDuration: 0.5,
                  pathColor: `rgb(62, 152, 199)`,
                  textColor: '#f100',
                  trailColor: 'rgb(32,34,37)',
                  backgroundColor: '#3e98c7',
                })}
                strokeWidth={20}
                value={data ? (data.propertiesForSell / data.totalProperties) * 100 : 0}
              />
            </div>
          </div>
        </div>

        <div className='bg-[rgb(26,28,30)] p-2 w-max rounded-md'>
          <div className='flex items-center justify-center gap-10'>
            <div className='flex flex-col'>
              <h2 className='text-gray-500 text-2xl'>Properties for Rent</h2>
              <span className='text-white text-xl text-center'>{data?.propertiesForRent}</span>
            </div>
            <div className='w-20'>
              <CircularProgressbar
                styles={buildStyles({
                  rotation: 0.25,
                  strokeLinecap: 'butt',
                  textSize: '16px',
                  pathTransitionDuration: 0.5,
                  pathColor: `#2FD580`,
                  textColor: '#f100',
                  trailColor: 'rgb(32,34,37)',
                  backgroundColor: '#3e98c7',
                })}
                strokeWidth={20}
                value={data ? (data.propertiesForRent / data.totalProperties) * 100 : 0}
              />
            </div>
          </div>
        </div>

        <div className='bg-[rgb(26,28,30)] p-2 w-max rounded-md'>
          <div className='flex items-center justify-center gap-10'>
            <div className='flex flex-col'>
              <h2 className='text-gray-500 text-2xl'>Total Agents</h2>
              <span className='text-white text-xl text-center'>{data?.totalAgents}</span>
            </div>
            <div className='w-20'>
              <CircularProgressbar
                styles={buildStyles({
                  rotation: 0.25,
                  strokeLinecap: 'butt',
                  textSize: '16px',
                  pathTransitionDuration: 0.5,
                  pathColor: `#FC8538`,
                  textColor: '#f100',
                  trailColor: 'rgb(32,34,37)',
                  backgroundColor: '#FC8538',
                })}
                strokeWidth={20}
                value={data ? data.totalAgents : 0}
              />
            </div>
          </div>
        </div>
      </div>

      <div className='mt-10'>
        <Bar data={expenseBarData} options={expenseBarOptions} />
      </div>
    </div>
  );
}
