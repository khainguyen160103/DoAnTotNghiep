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

interface ModalFormEditProps {
  isOpen: boolean;
  handleClose: () => void;
  handleSave: (updatedData: any) => void;
  data: FormData;
  mutate: () => Promise<any>;
}

const ModalUpdateForm: React.FC<ModalFormEditProps> = ({
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
  
  const handleDateChange = (dates: Date[]) => {
              if (dates && dates[0]) {
                setFormState((prev) => ({ ...prev, start_at: dates[0].toISOString() }));
              }
            }


  console.log("formState", formState);
  const handleSubmit = async () => {
    try {
      // Gọi API PATCH để cập nhật dữ liệu
      await axios.patch(
        `http://127.0.0.1:5000/api/form/update/${formState.id}`,
        {
          title: formState.title,
          request_date: formState.request_date,
          start_at: formState.start_at,
          end_at: formState.end_at,
          note: formState.note,
          employee_id: formState.employee_id,
          letter_status_id : formState.letter_status_id,
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
        <h2 className="text-lg font-semibold mb-4">Chỉnh sửa thông tin form</h2>
        <div className="mb-4">
          <Label className="block text-sm font-medium text-gray-700">Mã Đơn</Label>
          <Input
            type="text"
            name="id"
            value={formState.id}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <Label className="block text-sm font-medium text-gray-700">Tiêu đề</Label>
          <Input
            type="text"
            name="title"
            value={formState.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
          <Select
            onChange={(value) => handleSelectChange("letter_status_id", value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            options={[
              { value: "1", label: "Từ Chối" },
              { value: "2", label: "Chờ Duyệt" },
              { value: "3", label: "Đã Duyệt" },
            ]}
          />
        </div>
        <div className="mb-4">
          <Label className="block text-sm font-medium text-gray-700">Ghi chú</Label>
          <TextArea
            value={formState.note}
            onChange={(value :string) => handleAreaChange("note", value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <Label className="block mb-2">Ngày bắt đầu</Label>
            <Input
              type="datetime-local"
              name="start_at"
              value={formState.start_at}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
        </div>
        <div className="mb-4">
         <Label className="block mb-2">Ngày kết thúc</Label>
          <Input
            type="datetime-local"
            name="start_at"
            value={formState.end_at}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleClose} className="mr-2">
            Hủy
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Lưu
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalUpdateForm;