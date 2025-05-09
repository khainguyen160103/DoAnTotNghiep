"use client";
import React from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../button/Button";
import { Modal } from ".";
import { useModal } from "@/hooks/useModal";

interface VerticallyCenteredModalProps {
  isOpen: boolean;
  handleCloseModal: () => void;
  handleConfirmDelete: (confirm : boolean) => void;
  message?: string;
}

export const  VerticallyCenteredModal : React.FC<VerticallyCenteredModalProps> = ({
  isOpen,
  handleCloseModal,
  handleConfirmDelete,
  message
}) => {
  // const { openModal, closeModal } = useModal();
  const handleSave = () => {
    // Handle save logic here
    handleConfirmDelete(true)
    handleCloseModal();
  };
  return (
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        showCloseButton={false}
        className="max-w-[507px] p-6 lg:p-10"
      >
        <div className="text-center">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
           {message ? message : "Bạn có chắc chắn muốn xóa không?"} 
          </h4>
          <div className="flex items-center justify-center w-full gap-3 mt-8">
            <Button size="sm"  onClick={handleCloseModal}>
              Thoát 
            </Button>
            <Button size="sm" variant="outline" onClick={handleSave}>
              Đồng ý 
            </Button>
          </div>
        </div>
      </Modal>
  );
}
