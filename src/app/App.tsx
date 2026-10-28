
import { useState, createContext, useContext, useEffect } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import type {
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { CssBaseline } from "@mui/material";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { onAuthStateChanged, type User } from "firebase/auth";

import Home from "./pages/home";
import Template from "./template";
import AdminHome from "./admin/Admn_home";
import Login from "./admin/Login";
import ProtectedRoute from "../ProtecedRoute";
import AddLunchEvent from "./admin/addNews";
import LunchEventList from "./admin/lunchEventList";
import AddNews from "./admin/addNews";
import NewsList from "./admin/newsList";
import NewsUpdate from "./admin/newsupdate";
import { auth } from "../firebase/firebase";
import NewsDetails from "./pages/viewDetails";

export interface LunchEvent {
  id: string;
  date: string;
  songName: string;
  artistName: string;
  remark?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  details: string;
  author: string;
  authorUid: string;
  imageUrl: string;
  imageFileId: string;
  createdAt: Date | null;
  updatedAt?: Date | null;
}

interface AppContextType {
  eventDate: Date;
  setEventDate: Dispatch<SetStateAction<Date>>;
  globalMsg: string | null;
  setGlobalMsg: Dispatch<SetStateAction<string | null>>;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  weeklyEvents: LunchEvent[];
  setWeeklyEvents: Dispatch<SetStateAction<LunchEvent[]>>;

  // News global state
  news: NewsItem[];
  setNews: Dispatch<SetStateAction<NewsItem[]>>;
  lastNewsDoc: QueryDocumentSnapshot<DocumentData> | null;
  setLastNewsDoc: Dispatch<
    SetStateAction<QueryDocumentSnapshot<DocumentData> | null>
  >;
  hasMoreNews: boolean;
  setHasMoreNews: Dispatch<SetStateAction<boolean>>;
  newsLoaded: boolean;
  setNewsLoaded: Dispatch<SetStateAction<boolean>>;
  resetNewsCache: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

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
      {
        path: "/admin/addnews",
        element: (
          <ProtectedRoute>
            <AddNews />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/newslist",
        element: (
          <ProtectedRoute>
            <NewsList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/newsupdate/:id",
        element: (
          <ProtectedRoute>
            <NewsUpdate />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/newdetails/:id",
        element: (
          <ProtectedRoute>
            <NewsDetails />
          </ProtectedRoute>
        ),
      },
    ],
  },
];

const router = createHashRouter(routes);

export function useApp(): AppContextType {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside AppContext.Provider");
  }

  return context;
}

function App() {
  const [eventDate, setEventDate] = useState(new Date());
  const [globalMsg, setGlobalMsg] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [weeklyEvents, setWeeklyEvents] = useState<LunchEvent[]>([]);

  // News cache and pagination state
  const [news, setNews] = useState<NewsItem[]>([]);
  const [lastNewsDoc, setLastNewsDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMoreNews, setHasMoreNews] = useState(true);
  const [newsLoaded, setNewsLoaded] = useState(false);

  function resetNewsCache() {
    setNews([]);
    setLastNewsDoc(null);
    setHasMoreNews(true);
    setNewsLoaded(false);
  }

  // Keep the global user state synchronized with Firebase Auth.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

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

        news,
        setNews,
        lastNewsDoc,
        setLastNewsDoc,
        hasMoreNews,
        setHasMoreNews,
        newsLoaded,
        setNewsLoaded,
        resetNewsCache,
      }}
    >
      <RouterProvider router={router} />
      <CssBaseline />
    </AppContext.Provider>
  );
}

export default App;
