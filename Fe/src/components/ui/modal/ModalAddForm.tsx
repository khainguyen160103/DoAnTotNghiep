"use client";
import React, { useState } from "react";
import { Modal } from "./index";
import { FormData } from "@/types/common";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import Button from "../button/Button";
import TextArea from "@/components/form/input/TextArea";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
interface ModalAddFormProps {
  isOpen: boolean;
  onClose: () => void;
  mutate: () => Promise<any>;
}

const ModalAddForm: React.FC<ModalAddFormProps> = ({ isOpen, onClose , mutate}) => {
  const { user } = useAuth();
  const [formType, setFormType] = useState<string>("overtime");
  const [formData, setFormData] = useState({
    title: "",
    request_date: new Date().toISOString().split("T")[0],
    start_at: "",
    end_at: "",
    note: "",
    type_date_ot_id: 1,
    employee_id: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormType(value);
    if (value === "overtime") {
      const now = new Date().toISOString();
      setFormData((prev) => ({
        ...prev,
        start_at: now,
        end_at: now,
        type_date_ot_id: 1, // Default to 1 for weekdays
      }));
    }
  };
  const handleAreaChange = (name: string, value: string) => {
  setFormData((prev) => ({ ...prev, [name]: value }));
  };
    
  const handleSubmit = async () => {
    let apiUrl = "";
    switch (formType) {
      case "overtime":
        apiUrl = "http://localhost:5000/api/form/create/overtime";
        break;
      case "leave":
        apiUrl = "http://localhost:5000/api/form/create/leave";
        break;
      case "verification":
        apiUrl = "http://localhost:5000/api/form/create/vertification";
        break;
      default:
        return;
    }
    
  
    
    try {
      console.log("formData", formData);
      formData.employee_id = user?.id; // Set employee_id from user context
      const response = await axios.post(apiUrl,formData, { 
              withCredentials: true
            });
      console.log("response", response);
      if (response.status === 200) {
        await mutate();
        toast.success("Tạo đơn thành công!");
        onClose();
      } else {
        toast.error("Tạo đơn thất bại!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Đã xảy ra lỗi khi tạo đơn!");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className=" max-w-[600px] p-5 lg:p-10" showCloseButton>
      <h2 className="text-xl font-bold mb-4">Tạo đơn</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="mb-4 ">
          <Label className="block mb-2">Chọn loại đơn</Label>
          <Select
            onChange={(value) => handleSelectChange("formType", value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm  sm:text-sm"
            options={[
              { value: "overtime", label: "Tăng Ca" },
              { value: "leave", label: "Xin Nghỉ" },
              { value: "verification", label: "Xác Nhận Công" },
            ]}
          />
        </div>
        <div className="mb-4">
          <Label className="block mb-2">Tiêu đề</Label>
          <Input
            placeholder="Tiêu đề"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <Label className="block mb-2">Ngày bắt đầu</Label>
          <Input
            type="datetime-local"
            name="start_at"
            value={formData.start_at}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <Label className="block mb-2">Ngày kết thúc</Label>
          <Input
            type="datetime-local"
            name="end_at"
            value={formData.end_at}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <Label className="block mb-2">Ghi chú</Label>
          <TextArea
            placeholder="Ghi chú"
            value={formData.note}
            onChange={(value :string) => handleAreaChange("note", value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm  sm:text-sm"
          />
        </div>
        {formType === "overtime" && (
          <div className="mb-4">
            <Label className="block mb-2">Loại ngày tăng ca</Label>
            <Select
              defaultValue={formData.type_date_ot_id.toString()}
              onChange={(value: string) =>
                setFormData((prev) => ({
                  ...prev,
                  type_date_ot_id: parseInt(value, 10),
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
              options={[
                { value: "1", label: "Ngày thường" },
                { value: "2", label: "Ngày lễ" },
              ]}
            />
          </div>
        )}
      </div>
      <Button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-6"
      >
        Lưu
      </Button>
    </Modal>
  );
};

export default ModalAddForm;
