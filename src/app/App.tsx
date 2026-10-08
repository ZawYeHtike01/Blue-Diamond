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
        path: "/",
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
