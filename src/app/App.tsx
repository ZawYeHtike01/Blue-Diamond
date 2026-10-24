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
import ProtectedRoute from "../ProtecedRoute";

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
  return (
    <AppContext.Provider
      value={{
        eventDate,
        setEventDate,
        globalMsg,
        setGlobalMsg,
      }}
    >
      <RouterProvider router={router} />
      <CssBaseline />
    </AppContext.Provider>
  );
}

export default App;
