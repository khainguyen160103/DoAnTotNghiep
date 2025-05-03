"use client";
import { useState } from "react";
import SearchBar from "../ui/search/SearchUser";
import Button from "../ui/button/Button";
interface HeaderDashboardProps {
  options: { value: string; label: string }[];
  handleSelectChange: (value: string) => void;
} 

export const HeaderFormSubmission = ({ options , handleSelectChange }: HeaderDashboardProps) => {

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white shadow-md">     
        <SearchBar />
        <Button>+ Thêm mới</Button>
      </div>
  );
}