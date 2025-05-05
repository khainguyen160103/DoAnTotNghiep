"use client"
import FileInput from "../form/input/FileInput"
import Calendar from "../calendar/Calendar"
import Select from "../form/Select"
import { useAuth } from "@/context/AuthContext"
export const Attendance = () => {
    const {isAdmin} = useAuth()
    const handleSelectChange = (value: string) => {
        // Xử lý logic khi chọn giá trị từ Select
        console.log("Selected value:", value);
    }
     const handleFileChange = (file: File | null) => {
         // Xử lý logic khi chọn tệp từ FileInput
         console.log("Selected file:", file);
     }
    return <> 
        <div className="flex justify-between mb-2.5">
          <FileInput onChange={handleFileChange}/>
         {isAdmin() && <Select
             className="w-s  m"
             options={[
                 { value: "user", label: "Người dùng" },
                 { value: "admin", label: "Quản trị viên" },
             ]}
             placeholder="Chọn nhân viên"
             onChange={handleSelectChange}
                 />}
         </div>   
        <Calendar />

    </>
} 
