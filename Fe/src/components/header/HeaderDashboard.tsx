"use client";
import { useState } from "react";

import Select from "../form/Select";
import SelectInputs from "../form/form-elements/SelectInputs";
import { ChevronDownIcon } from "@/icons";
import DateTimeSelect from "../common/DatetimeSelect";
import DatePicker from "../form/date-picker";

interface HeaderDashboardProps {
  options: { value: string; label: string }[];
  handleSelectChange: (value: string) => void;
} 

export const HeaderDashboard = ({ options , handleSelectChange }: HeaderDashboardProps) => {
    const [dateRange, setDateRange] = useState<string>("01/03/2023 - 31/03/2023");
  const handleDateChange = (dates: any) => {
    // Xử lý logic khi chọn ngày
    setDateRange("01/03/2023 - 31/03/2023"); // Ví dụ
  };
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white shadow-md">
        <div className="relative">
           <Select
            options={options}
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon/>
            </span>
         </div>
        <DatePicker 
          id="date-picker"
          mode="range"
          onChange={handleDateChange}
          defaultDate='2023-03-01' // Adjusted to match updated type
          placeholder="Chọn ngày"
        />
        <div className="relative">
        <Select
          options={[
            { value: "user", label: "Người dùng" },
            { value: "admin", label: "Quản trị viên" },
          ]}
          placeholder="Chọn nhân viên"
          onChange={handleSelectChange}
        />
      </div>
    </div>
  );
}