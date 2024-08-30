import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import AgentLayout from "../layouts/AgentLayout";
import ToastMessageProvider from "../contexts/ToastContext";
import AuthContextProvider from "../contexts/AuthContext";
import Properties from "../pages/Properties";
import AddProperty from "../pages/AddProperty";
import DetailedProperty from "../pages/DetailedProperty";
import Agents from "../pages/Agents";
import EditProperty from "../pages/EditProperty";
import AgentDetails from "../pages/AgentDetails";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";

export const route = createBrowserRouter([
  {
    element: (
      <ToastMessageProvider>
        <AuthContextProvider>
          <AgentLayout />
        </AuthContextProvider>
      </ToastMessageProvider>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },{
        path: "/properties",
        element: <Properties />,
      },
      {
        path:'/properties/add',
        element:<AddProperty/>
      },
      {
        path:'/properties/:id',
        element:<DetailedProperty/>
      },{
        path:'/properties/:id/edit',
        element:<EditProperty/>
      },
      {
        path:'/agents',
        element:<Agents/>
      },
      {
        path:'/agents/:id',
        element:<AgentDetails/>
      },{
        path:'/profile',
        element:<Profile/>
      
      },{
        path:'/profile/edit',
        element:<EditProfile/>
      }
    ],
  },
  {
    path: "/login",
    element: (
      <ToastMessageProvider>
        <AuthContextProvider>
          <Login />
        </AuthContextProvider>
      </ToastMessageProvider>
    ),
  },
  {
    path: "/register",
    element: (
      <ToastMessageProvider>
        <AuthContextProvider>
          <Register />
        </AuthContextProvider>
      </ToastMessageProvider>
    ),
  },
]);
