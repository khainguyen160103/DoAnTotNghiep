"use client"
import FileInput from "../form/input/FileInput"
import Calendar from "../calendar/Calendar"
import Select from "../form/Select"

export const Attendance = () => {
    const handleSelectChange = (value: string) => {
        // Xử lý logic khi chọn giá trị từ Select
        console.log("Selected value:", value);
    }
    return <> 
        <div className="flex justify-between mb-2.5">
        <FileInput />
        <Select
            className="w-sm"
            options={[
                { value: "user", label: "Người dùng" },
                { value: "admin", label: "Quản trị viên" },
            ]}
            placeholder="Chọn nhân viên"
            onChange={handleSelectChange}
            />
        </div>
        <Calendar />

    </>
} 
