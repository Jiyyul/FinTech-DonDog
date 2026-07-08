"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type SearchContextValue = {
  query: string;
  setQuery: (query: string) => void;
  selectTransactionId: string | null;
  requestSelectTransaction: (id: string) => void;
  clearSelectTransaction: () => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [selectTransactionId, setSelectTransactionId] = useState<string | null>(null);

  const requestSelectTransaction = useCallback((id: string) => {
    setSelectTransactionId(id);
    setQuery("");
  }, []);

  const clearSelectTransaction = useCallback(() => {
    setSelectTransactionId(null);
  }, []);

  const value = useMemo(
    () => ({
      query,
      setQuery,
      selectTransactionId,
      requestSelectTransaction,
      clearSelectTransaction,
    }),
    [query, selectTransactionId, requestSelectTransaction, clearSelectTransaction]
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
}
