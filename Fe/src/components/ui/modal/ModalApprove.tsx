import React, { useState } from "react";
import Button from "../button/Button";
import { Modal } from ".";
import axios from "axios";
import { FormData } from "@/types/common";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import TextArea from "@/components/form/input/TextArea";
import { DateEnv } from "@fullcalendar/core/internal";
import DatePicker from "@/components/form/date-picker";
import { toast } from "react-toastify";

interface ModalApproveFormProps {
  isOpen: boolean;
  handleClose: () => void;
  handleSave: (updatedData: any) => void;
  data: FormData;
  mutate: () => Promise<any>;
}

export const ModalApprve: React.FC<ModalApproveFormProps> = ({
  isOpen,
  handleClose,
  handleSave,
  data,
  mutate,
}) => {
  const [formState, setFormState] = useState<FormData>({ ...data });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    console.log("Selected value:", value);
    
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleAreaChange = (name: string, value: string) => {
  setFormState((prev) => ({ ...prev, [name]: value }));
  };
  
  function toDatetimeLocal(dateStr?: string) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    // Chuyển về local time
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  }

  console.log("formState", formState);
  const handleApprove = async () => {
    try {
      // Gọi API PATCH để cập nhật dữ liệu
      await axios.patch(
        `http://127.0.0.1:5000/api/form/update/${formState.id}`,
        {
          letter_status_id :3,
        },
        { withCredentials: true }
      );

      // Gọi mutate để làm mới dữ liệu từ SWR
      await mutate();

      // Gọi hàm handleSave để xử lý dữ liệu sau khi lưu
      handleSave(formState);
       toast.success("Cập nhật thành công!");

      // Đóng modal
      handleClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật dữ liệu:", error);
    }
  };
  const handleRefuse = async () => {
    try {
      // Gọi API PATCH để cập nhật dữ liệu
      await axios.patch(
        `http://127.0.0.1:5000/api/form/update/${formState.id}`,
        {
          letter_status_id :1,
        },
        { withCredentials: true }
      );

      // Gọi mutate để làm mới dữ liệu từ SWR
      await mutate();

      // Gọi hàm handleSave để xử lý dữ liệu sau khi lưu
      handleSave(formState);
       toast.success("Cập nhật thành công!");

      // Đóng modal
      handleClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật dữ liệu:", error);
    }
  };
  return (
    <Modal className="max-w-[600px] p-5 lg:p-10" isOpen={isOpen} onClose={handleClose}>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Chỉnh sửa thông tin đơn</h2>
        <div className="mb-4">
          <Label className="block text-sm font-medium text-gray-700">Tiêu đề</Label>
          <Input
            readonly
            type="text"
            name="title"
            value={formState.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm  sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <Label className="block text-sm font-medium text-gray-700">Ghi chú</Label>
          <TextArea
            readonly
            value={formState.note}
            onChange={(value :string) => handleAreaChange("note", value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm  sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <Label className="block mb-2">Ngày bắt đầu</Label>
            <Input
                readonly
              type="datetime-local"
              name="start_at"
              value={toDatetimeLocal(formState.start_at)}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
        </div>
        <div className="mb-4">
         <Label className="block mb-2">Ngày kết thúc</Label>
          <Input
          readonly
            type="datetime-local"
            name="start_at"
            value={toDatetimeLocal(formState.end_at)}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleRefuse} className="mr-2">
            Từ chối 
          </Button>
          <Button variant="primary" size="sm" onClick={handleApprove}>
            Duyệt 
          </Button>
        </div>
      </div>
    </Modal>
  );
};
