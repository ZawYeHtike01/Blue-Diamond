import { useState } from "react";
import { createContext } from "react";
import { useContext } from "react";
import { CssBaseline } from "@mui/material";

import { RouterProvider, createHashRouter } from "react-router-dom";
import Home from "./pages/home";
import Template from "./template";
import { useEffect } from "react";

const AppContext = createContext();

const routes = [
  {
    path: "/",
    element: <Template />,
    children: [
      {
        index:true,
        element: <Home />,
      },
      
    ],
  },
];
const router = createHashRouter(routes);

export function useApp() {
  return useContext(AppContext);
}

function App() {
  const [isauth, setisAuth] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [globalMsg, setGlobalMsg] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [JapanseHolidays, setJapaneseHolidays] = useState([]);
  const [userData, setUserData] = useState();
  const [workname, setWorkName] = useState([]);
  const [monthCache, setMonthCache] = useState({});
  const [total, setTotal] = useState();
  const [checkHour, setCheckHour] = useState([]);
  const [course, setCourse] = useState({});
  const [admin, setAdmin] = useState(false);
  const [work,setWork]=useState('all');
  
  


  return (
    <AppContext.Provider
      value={{
        
      }}
    >
      <RouterProvider router={router} />
      <CssBaseline />
    </AppContext.Provider>
  );
}

export default App;
