"use client";
import { useSearchContext } from "@/lib/hooks";
import React from "react";

const SearchForm = () => {
  const { searchText, handleChangeSearchText } = useSearchContext();
  return (
    <form className="w-full h-full">
      <input
        className="w-full  bg-white/20 rounded-md outline-none px-5 transition focus:bg-white/50 hover:bg-white/30 placeholder:text-white/50 text-md py-3"
        placeholder="Seach pets"
        type="search"
        value={searchText}
        onChange={(e)=>{handleChangeSearchText(e.target.value)}}
      />
    </form>
  );
};

export default SearchForm;
