import React, { createContext, useState, useContext, ReactNode } from "react";
import { Session } from "@supabase/auth-js";

type AppContextType = {
  session: Session | null;
  setSession: (session: Session | null) => void;
  // Add other global states and their setters here
};

const defaultAppContext: AppContextType = {
  session: null,
  setSession: () => {},
  // Initialize other states with default values if needed
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  // Add other state hooks here

  return (
    <AppContext.Provider value={{ session, setSession }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
