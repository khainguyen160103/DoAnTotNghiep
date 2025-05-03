import React, { useState } from "react";
import DatePicker from "@/components/form/date-picker";
import Select from "@/components/form/Select";

const DateTimeSelect: React.FC = () => {
  const [dateRange, setDateRange] = useState<string>("01/03/2023 - 31/03/2023");
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleDateChange = (dates: any) => {
    // Xử lý logic khi chọn ngày
    setDateRange("01/03/2023 - 31/03/2023"); // Ví dụ
  };

  const handleSelectChange = (value: string) => {
    setSelectedOption(value);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <DatePicker
          id="date-picker"
          mode="range"
          onChange={handleDateChange}
          defaultDate='2023-03-01' // Adjusted to match updated type
          placeholder="Chọn ngày"
        />
      </div>
      <div className="relative">
        <Select
          options={[
            { value: "user", label: "Người dùng" },
            { value: "admin", label: "Quản trị viên" },
          ]}
          placeholder="Chọn vai trò"
          onChange={handleSelectChange}
        />
      </div>
    </div>
  );
};

export default DateTimeSelect;