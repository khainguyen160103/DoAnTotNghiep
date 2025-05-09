"use client";
import FileInput from "../form/input/FileInput";
import Calendar from "../calendar/Calendar";
import Select from "../form/Select";
import { useAuth } from "@/context/AuthContext";
import useSWR from "swr";
import axios from "axios";
import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { AttendanceType } from "@/types/common";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Input from "../form/input/InputField";
import Label from "../form/Label";
export const Attendance = () => {
  const { isAdmin , user } = useAuth();
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<number>(6);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [dayOff, setDayOff] = useState<number | null>(null); // State để lưu ngày phép
  
  const token = Cookies.get("access_token_cookie");
  const {data : users , error: userError, isLoading: userLoading} = useFetch("user/all" ,token);
  const {data : attendance, error : attendanceError, isLoading : attendanceLoading , mutate : attendanceMutate} = useFetch( selectedEmployee ? `attendance/allByMonth/${selectedEmployee}/${selectedYear}/${selectedMonth}` : "", token);
  const { data: attendanceByEmployee, error: attendanceByEmployeeError, isLoading: attendanceByEmployeeLoading, mutate: attendanceByEmployeeMutate } = useFetch(
    user && user?.role !== 1 ? `attendance/allByMonth/${user.id}/${selectedYear}/${selectedMonth}` : "",
    token
  );
  const fetchDayOff = async (employeeId: string) => {
  if (!employeeId) {
    console.log("Không có nhân viên nào được chọn!");
    return null;
  }

  try {
    const response = await fetch(`http://127.0.0.1:5000/api/dayoff/${employeeId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token nếu cần
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Dữ liệu ngày phép:", result);
      return result.payload; // Giả sử API trả về dữ liệu trong `payload`
    } else {
      toast.error("Không thể lấy dữ liệu ngày phép!");
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi gọi API ngày phép:", error);
    toast.error("Đã xảy ra lỗi khi gọi API ngày phép!");
    return null;
  }
   
  };


  const handleSelectChange = async (value: string) => {
    setSelectedEmployee(value);
    console.log(dayOff);
    
    console.log("Selected employee:", value);
     // Cập nhật nhân viên được chọn
    const dayOffData = await fetchDayOff(selectedEmployee);
    if (dayOffData && Array.isArray(dayOffData)) {
      // Lọc đúng tháng/năm đang chọn
      const matched = dayOffData.find(
        (item) =>
          item.DayOff_month === selectedMonth && item.DayOff_year === selectedYear
      );
      setDayOff(matched ? matched.DayOff_number : 0);
    } else {
      setDayOff(0);
  };
}
  
  const handleFileChange =  async (file: File | null) => {
   console.log(file);
   
   if (!file) {
    console.log("Không có file nào được chọn!");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("file", file); // Thêm file vào FormData

    const response = await fetch("http://127.0.0.1:5000/api/attendance/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token nếu cần
      },
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Upload thành công:", result);
      toast.success("Upload file thành công!");
      // Gọi mutate để làm mới dữ liệu nếu cần
      attendanceMutate();
    } else {
      console.error("Upload thất bại:", response.statusText);
      toast.error("Upload file thất bại!");
    }
  } catch (error) {
    console.error("Lỗi khi upload file:", error);
    toast.error("Đã xảy ra lỗi khi upload file!");
  }
  };

  // if (attendanceError) return <div>Đã xảy ra lỗi khi tải dữ liệu</div>;
  // if (!attendance) return <div>Đang tải dữ liệu...</div>;

  // Xử lý dữ liệu từ API để hiển thị trên Calendar
  // const events = data.payload.map((item: any) => ({
  //   date: item.attendance_date,
  //   status: item.attendance_status_id,
  //   note: item.note,
  //   timeIn: item.time_in,
  //   timeOut: item.time_out,
  //   overtime: item.total_overtime,
  // }));
  // if(isAdmin()) { 
    
  // }

   const handleMonthYearChange = (month: number, year: number) => {
    if (month !== selectedMonth || year !== selectedYear) {
      setSelectedMonth(month);
      setSelectedYear(year);
    }
  };
  return (
    <>
      
        {isAdmin() && ( <> 
          <div className="flex justify-between mb-2.5 items-center">
          <FileInput onChange={(file) => handleFileChange(file)} />
          <div className="h-full flex justify-center items-center">
          <Label className="mr-2">Phép:</Label>
          <Input
            className="text-lg font-semibold"
            value={dayOff || 0} 
            onChange={(e) => setDayOff(Number(e.target.value))} // Cập nhật số ngày phép
            // Hiển thị số ngày phép hoặc trạng thái đang tải
          />
          </div>
          <Select
            className="w-s m "
            // options={[
            //   { value: users?.id, label: users?.fullname },
            //   { value: "IT7", label: "Nhân viên IT7" },
            // ]}
            options={ !userLoading && !userError && users?.payload
            ? users.payload.map((item: any) => ({
                value: item.id, // Replace `id` with the actual key for the value
                label: item.fullname, // Replace `fullname` with the actual key for the label
              }))
            : [] }
            placeholder="Chọn nhân viên"
            onChange={(e) => handleSelectChange(e)}
          />
        </div>
        </>)}
      
      <Calendar
        onMonthYearChange={handleMonthYearChange} // Truyền hàm xử lý sự kiện tháng và năm
        // events={events} // Truyền dữ liệu sự kiện vào Calendar
        // onDateClick={(date) => console.log("Ngày được chọn:", date)}
        data={ selectedEmployee ? attendance?.payload : attendanceByEmployee?.payload}
        isLoading={ selectedEmployee ?  attendanceLoading : false}
        error={selectedEmployee ? attendanceError  : false}
        employeeId={user?.role === 1 ? selectedEmployee : user?.id}
        mutate={user?.role === 1 ? attendanceMutate : attendanceByEmployeeMutate}
      />
    </>
  );
};


