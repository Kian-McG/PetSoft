"use client";
import React, { createContext, useState } from "react";

type SearchContextProviderProps = {
  children: React.ReactNode;
};

type TSearchContext = {
  searchText: string;
  handleChangeSearchText: (text: string) => void;
};

export const SearchContext = createContext<TSearchContext | null>(null);
const SearchContextProvider = ({ children }: SearchContextProviderProps) => {
  //state
  const [searchText, setSearchText] = useState<string>("");

  //derived state

  //handlers
  const handleChangeSearchText = (text: string) => {
    setSearchText(text);
  };

  return (
    <SearchContext.Provider
      value={{
        searchText,
        handleChangeSearchText,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContextProvider;
