"use client";
import FileInput from "../form/input/FileInput";
import Calendar from "../calendar/Calendar";
import Select from "../form/Select";
import { useAuth } from "@/context/AuthContext";
import useSWR from "swr";
import axios from "axios";
import { useState } from "react";

const fetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);

export const Attendance = () => {
  const { isAdmin } = useAuth();
  const [selectedEmployee, setSelectedEmployee] = useState<string>("IT6");
  const [selectedMonth, setSelectedMonth] = useState<number>(6);
  const [selectedYear, setSelectedYear] = useState<number>(2025);

  const { data, error } = useSWR(
    `/api/attendance/allByMonth?employee_id=${selectedEmployee}&month=${selectedMonth}&year=${selectedYear}`,
    fetcher
  );

  const handleSelectChange = (value: string) => {
    setSelectedEmployee(value); // Cập nhật nhân viên được chọn
  };

  const handleFileChange = (file: File | null) => {
    console.log("Selected file:", file);
  };

  if (error) return <div>Đã xảy ra lỗi khi tải dữ liệu</div>;
  if (!data) return <div>Đang tải dữ liệu...</div>;

  // Xử lý dữ liệu từ API để hiển thị trên Calendar
  const events = data.payload.map((item: any) => ({
    date: item.attendance_date,
    status: item.attendance_status_id,
    note: item.note,
    timeIn: item.time_in,
    timeOut: item.time_out,
    overtime: item.total_overtime,
  }));

  return (
    <>
      <div className="flex justify-between mb-2.5">
        <FileInput onChange={handleFileChange} />
        {isAdmin() && (
          <Select
            className="w-s m"
            options={[
              { value: "IT6", label: "Nhân viên IT6" },
              { value: "IT7", label: "Nhân viên IT7" },
            ]}
            placeholder="Chọn nhân viên"
            onChange={(e) => handleSelectChange(e)}
          />
        )}
      </div>
      <Calendar
        // events={events} // Truyền dữ liệu sự kiện vào Calendar
        // onDateClick={(date) => console.log("Ngày được chọn:", date)}
      />
    </>
  );
};