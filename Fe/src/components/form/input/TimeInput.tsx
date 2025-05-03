import React from "react";

interface SelectTimeInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const SelectTimeInput: React.FC<SelectTimeInputProps> = ({
  value,
  onChange,
  label,
}) => {
  // Tạo danh sách các tùy chọn giờ (00:00 - 23:30, cách nhau 30 phút)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedTime = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        times.push(formattedTime);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="flex flex-col">
      {label && <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>
          Select time
        </option>
        {timeOptions.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectTimeInput;