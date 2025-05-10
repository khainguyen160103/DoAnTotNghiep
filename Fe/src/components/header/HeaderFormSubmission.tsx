"use client";
import { useState } from "react";
import SearchBar from "../ui/search/SearchUser";
import Button from "../ui/button/Button";
import { useModal } from "@/hooks/useModal";
import ModalAddForm from "../ui/modal/ModalAddForm";
interface HeaderDashboardProps {
  mutate: () => Promise<any>;
}

import { useAuth } from "@/context/AuthContext"; 

export const HeaderFormSubmission = ({ mutate }: HeaderDashboardProps) => {
  const {isAdmin} = useAuth()
  const { openModal , isOpen , closeModal} = useModal();

  const handleAddForm = () => {
    openModal();
  }
  return (
    <div className="flex items-center justify-between  py-2 ">     
        <SearchBar />

        {!isAdmin() && <Button onClick={handleAddForm}>+ Thêm mới</Button>}
        <ModalAddForm isOpen={isOpen} onClose={closeModal} mutate={mutate} />
      </div>
  );
}