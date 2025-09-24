'use client';
import { createContext, useContext, useState } from 'react';

const RefreshContext = createContext(null);

export function RefreshProvider({ children }) {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <RefreshContext.Provider value={{ refreshKey, setRefreshKey }}>
      {children}
    </RefreshContext.Provider>
  );
}

export function useRefresh() {
  return useContext(RefreshContext);
}
