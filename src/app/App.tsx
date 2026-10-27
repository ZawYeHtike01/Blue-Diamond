import { useState } from "react";
import { createContext } from "react";
import { useContext } from "react";
import { CssBaseline } from "@mui/material";
import { RouterProvider, createHashRouter } from "react-router-dom";
import Home from "./pages/home";
import Template from "./template";
import { useEffect } from "react";
import AdminHome from "./admin/Admn_home";
import Login from "./admin/Login";
import { onAuthStateChanged, type User } from "firebase/auth";
import ProtectedRoute from "../ProtecedRoute";
import AddLunchEvent from "./admin/addLunchEvent";
import LunchEventList from "./admin/lunchEventList";

const AppContext = createContext();

const routes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Template />,
    children: [
      {
        path: "/",
        index: true,
        element: <Home />,
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <AdminHome />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/luncheventlist/submit",
        element: (
          <ProtectedRoute>
            <AddLunchEvent />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/luncheventlist",
        element: (
          <ProtectedRoute>
            <LunchEventList />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
const router = createHashRouter(routes);

export function useApp() {
  return useContext(AppContext);
}

function App() {
  const [eventDate, setEventDate] = useState(new Date());
  const [globalMsg, setGlobalMsg] = useState(null);
  const [user, setUser] = useState<User | null>(null);
  const [weeklyEvents, setWeeklyEvents] = useState([]);

  interface LunchEvent {
    id: string;
    date: string; // YYYY-MM-DD
    songName: string;
    artistName: string;
    remark?: string;
  }

  interface AppContextType {
    weeklyEvents: LunchEvent[];
    setWeeklyEvents: React.Dispatch<React.SetStateAction<LunchEvent[]>>;
  }

  return (
    <AppContext.Provider
      value={{
        eventDate,
        setEventDate,
        globalMsg,
        setGlobalMsg,
        user,
        setUser,
        weeklyEvents,
        setWeeklyEvents,
      }}
    >
      <RouterProvider router={router} />
      <CssBaseline />
    </AppContext.Provider>
  );
}

export default App;
