"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface HeaderState {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

interface HeaderContextValue extends HeaderState {
  setHeader: (state: Partial<HeaderState>) => void;
  resetHeader: () => void;
}

const defaultState: HeaderState = {
  title: "",
  subtitle: undefined,
  actions: undefined,
};

const HeaderContext = createContext<HeaderContextValue | undefined>(undefined);

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<HeaderState>(defaultState);

  const setHeader = useCallback((newState: Partial<HeaderState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  }, []);

  const resetHeader = useCallback(() => {
    setState(defaultState);
  }, []);

  return (
    <HeaderContext.Provider value={{ ...state, setHeader, resetHeader }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
}
