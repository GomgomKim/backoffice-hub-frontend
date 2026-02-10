"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { httpClient } from "@/shared/api";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { getToken, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      httpClient.setTokenProvider(async () => {
        try {
          return await getToken();
        } catch {
          return null;
        }
      });
    }
  }, [getToken, isLoaded]);

  return <>{children}</>;
}
