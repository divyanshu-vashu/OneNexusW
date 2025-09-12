// "use client";
// import { createContext, useState, useContext, useEffect } from "react";
// import { useSession } from "next-auth/react";

// const AppContext = createContext();

// export function AppProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [devices, setDevices] = useState([]);
//   const [schedules, setSchedules] = useState([]);
//   const { data: session } = useSession();

//   // If Google login session exists, set user
//   useEffect(() => {
//     if (session?.user) {
//       setUser(session.user);
//     }
//   }, [session]);

//   return (
//     <AppContext.Provider value={{ user, setUser, devices, setDevices, schedules, setSchedules }}>
//       {children}
//     </AppContext.Provider>
//   );
// }

// export const useAppContext = () => useContext(AppContext);

"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { useSession } from "next-auth/react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const { data: session } = useSession();
  const [devices, setDevices] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [user, setUser] = useState(null);

  // Sync user with session
  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  }, [session]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        devices,
        setDevices,
        schedules,
        setSchedules,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
