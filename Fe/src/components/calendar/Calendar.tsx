"use client";
import React, { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import SelectTimeInput from "../form/input/TimeInput";
import { TimeIcon } from "@/icons";
import Input from "../form/input/InputField";
import FileInputExample from "../form/form-elements/FileInputExample";
import FileInput from "../form/input/FileInput";
import { AttendanceType } from "@/types/common";
import { startOfMonth, endOfMonth, format } from "date-fns";
import Label from "../form/Label";
import axios from "axios";
import { toast } from "react-toastify";
interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    workHours?: number;
    status?: string;
  };
}
interface CalendarProps {
  onMonthYearChange: (month: number, year: number) => void; 
  data: AttendanceType[];
  isLoading : boolean
  error : boolean // Ensure data is an array
  employeeId?: string; // Optional employee ID prop
  mutate: () => Promise<any>; // Optional mutate function prop
}
const Calendar: React.FC<CalendarProps> = ({ onMonthYearChange , data , isLoading , error , employeeId, mutate}) => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [eventTitle, setEventTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [showFileInput, setShowFileInput] = useState(false);
  const [eventStartTime, setEventStartTime] = useState(""); // Thời gian vào
  const [eventEndTime, setEventEndTime] = useState(""); // Thời gian ra
  
  const calendarsEvents = {
    Danger: "danger",
    Success: "success",
    Primary: "primary",
    Warning: "warning",
  };
  const getWorkingDaysInMonth = (year: number, month: number) => {
  const start = new Date(year, month - 1, 1); // Ngày đầu tiên của tháng
  const end = new Date(year, month, 0); // Ngày cuối cùng của tháng
  const allDays = [];

  const currentDate = start;
  while (currentDate <= end) {
    const dayOfWeek = currentDate.getDay(); // 0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      allDays.push(currentDate.toISOString().split("T")[0]); // Chỉ lấy thứ 2 đến thứ 6
    }
    currentDate.setDate(currentDate.getDate() + 1); // Tăng ngày lên 1
  }

  return allDays;
};
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentDate = calendarApi.getDate();
      const currentMonth = currentDate.getMonth() + 1; // Tháng (0-based, nên cần +1)
      const currentYear = currentDate.getFullYear();

      // Gọi hàm callback để truyền tháng và năm lên cha
      onMonthYearChange(currentMonth, currentYear);
    }
  }, [calendarRef, onMonthYearChange]);

//   useEffect(() => {
//   setEvents([
//     {
//       id: "1",
//       time: "08:23 - 17:45",
//       start: new Date().toISOString().split("T")[0],
//       extendedProps: {
//         calendar: "Danger",
//         workHours: "1",
//         status: "Đi muộn - Về sớm",
//       },
//     },
//     {
//       id: "2",
//       time: "08:45 - 17:15",
//       start: new Date(Date.now() + 86400000).toISOString().split("T")[0],
//       extendedProps: {
//         calendar: "Warning",
//         workHours: "0.84",
//         status: "Nghỉ",
//       },
//     },
//     {
//       id: "3",
//       time: "08:23 - 20:15",
//       start: new Date(Date.now() + 172800000).toISOString().split("T")[0],
//       extendedProps: {
//         calendar: "Success",
//         workHours: "1.35",
//         status: "Tăng ca - Làm thêm",
//       },
//     },
//   ]);
// }, []);
  const convertDateToYYYYMMDD = (date: Date): string => {
    console.log(date);
    
    return date.toISOString().split("T")[0];
  };  
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    console.log();
      
    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    
    const event = clickInfo.event;
    const formattedDate = convertDateToYYYYMMDD(event.start!);
    setSelectedDate(formattedDate);
    console.log("Ngày được chọn:", selectedDate); // Lưu ngày đã chọn vào state
  // Gán thông tin sự kiện vào state
    setSelectedEvent(event as unknown as CalendarEvent);
    const timeIn = event.extendedProps.timeIn;
    const timeOut = event.extendedProps.timeOut;   
    setEventStartDate(event.start?.toISOString().split("T")[0] || ""); // Ngày bắt đầu
    setEventEndDate(event.end?.toISOString().split("T")[0] || ""); // Ngày kết thúc
    setEventStartTime(event.extendedProps.timeIn); // Thời gian vào (HH:mm)
    setEventEndTime(event.extendedProps.timeOut); // Thời gian ra (HH:mm)
    setEventLevel(event.extendedProps.calendar || ""); 

    // Mở modal
    openModal();
  };

  const handleAddOrUpdateEvent = async () => {
    console.log(selectedEvent);
    
     if (selectedEvent?.id) {
    console.log(selectedDate);
    
    // Cập nhật sự kiện hiện tại
    const updatedEvent = {
      id: selectedEvent.id,
      attendance_date: selectedDate, // Ngày chấm công
      time_in: eventStartTime, // Thêm giây vào thời gian vào
      time_out: eventEndTime, // Thêm giây vào thời gian ra
      note: selectedEvent.extendedProps.status, // Ghi chú
      total_overtime: 0, // Giờ làm thêm (có thể tính toán hoặc lấy từ state)
      employee_id: employeeId, // ID nhân viên (cần thay thế bằng giá trị thực tế)
      attendance_status_id: 1, // Trạng thái chấm công
    };
    console.log(updatedEvent);
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/attendance/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      });

      if (response.ok) {
        await mutate()
        toast.success("Cập nhật thành công!");
        
        // Cập nhật sự kiện trong danh sách
        // setEvents((prevEvents) =>
        //   prevEvents.map((event) =>
        //     event.id === selectedEvent.id
        //       ? {
        //           ...event,
        //           title: eventTitle,
        //           start: eventStartDate,
        //           end: eventEndDate,
        //           extendedProps: { calendar: eventLevel },
        //         }
        //       : event
        //   )
        // );

        // Đóng modal
        closeModal();
        resetModalFields();
      } else {
        toast.error("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
    }
    };


  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("");
    setSelectedEvent(null);
  };
    useEffect(() => {
    if (data && data.length > 0) {
      const formattedEvents = formatEvents(data); // Chuyển đổi dữ liệu API
      setEvents(formattedEvents); // Cập nhật state events
    }else 
      setEvents([]); // Nếu không có dữ liệu, đặt events thành mảng rỗng
  }, [data]);
  const formatEvents = (data: AttendanceType[]) => {
  return data.map((item) => ({
    id: item.id,
    title: item.note, // Ghi chú sẽ hiển thị làm tiêu đề
    start: item.attendance_date, // Ngày bắt đầu
    end: item.attendance_date, // Ngày kết thúc (nếu cần)
    extendedProps: {
      calendar: item.workHours < 1 ? "Danger" : " ", // Provide a default or derived value for 'calendar'
      timeIn: item.time_in,
      timeOut: item.time_out,
      status: item.attendance_status_id ? item.attendance_status_id.toString() : "N/A",
      totalOvertime: item.total_overtime,
      workHours: item.workHours,
    },
  }));
  };
  const handleInputChange = (fieldName: string, value: string) => {
  console.log("Field name:", fieldName, "Value:", value);
  // Cập nhật giá trị tương ứng trong state dựa trên tên trường
  
  switch (fieldName) {
    case "eventTitle":
      setEventTitle(value);
      break;
    case "eventStartDate":
      setEventStartTime(value || eventStartTime);
      break;
    case "eventEndDate":
      setEventEndTime(value || eventEndTime);
      break;
    case "eventLevel":
      setEventLevel(value);
      break;
    default:
      console.warn(`Field ${fieldName} không được xử lý.`);
  }
};

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      try {
        const response = await axios.delete(`http://127.0.0.1:5000/api/attendance/delete/${selectedEvent.id}`, {
    
        });
        if(response.status === 200) {
          toast.success("Xóa thành công!");
          setEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== selectedEvent.id)
          );
          // Đóng modal
          closeModal();
          resetModalFields();
        }
      }catch (error) {
        console.error("Lỗi khi gọi API:", error);
        toast.error("Xóa thất bại!");
      }
    }
  }



  return (
    <div className="rounded-2xl border  border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          datesSet={() => {
                if (calendarRef.current) {
              const calendarApi = calendarRef.current.getApi();
              const currentDate = calendarApi.getDate();
              const currentMonth = currentDate.getMonth() + 1;
              const currentYear = currentDate.getFullYear();

              // Gọi hàm callback khi lịch thay đổi
              onMonthYearChange(currentMonth, currentYear);
          }}}
        />
      </div>
     
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 text-center lg:text-2xl">
              {selectedEvent ? "Chỉnh sửa Công" : "Thêm Công"}
            </h5>
          </div>
          <div className="mt-8">

            <div className="mt-6">
              <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Thời gian vào 
              </Label>
              <div className="relative">
                 <Input type="time" 
                  value={eventStartTime}
                  onChange={(e) => handleInputChange("eventStartDate", e.target.value|| eventEndDate)}/>
              </div>
            </div>

            <div className="mt-6">
              <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Thời gian ra
              </Label>
              <div className="relative">
                 <Input type="time"
                  value={eventEndTime}
                  onChange={(e) => handleInputChange("eventEndDate", e.target.value || eventEndTime)}
                 />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModal}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Đóng
            </button>
            {selectedEvent ? ( <button
              onClick={handleDeleteEvent}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-red-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Xóa
            </button>) : ""}
            <button
              onClick={handleAddOrUpdateEvent}
              type="button"
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
            >
              {selectedEvent ? "Cập nhật" : "Lưu"}
            </button>
            
          </div>
        </div>
      </Modal>
    </div>
  );
};

const renderEventContent = (eventInfo: EventContentArg) => {
  const statusColorClass = eventInfo.event.extendedProps.calendar === "Danger"
      ? "text-red-500"
      : eventInfo.event.extendedProps.calendar === "Warning"
      ? "text-yellow-500"
      : eventInfo.event.extendedProps.calendar === "Success"
      ? "text-green-500"
      : "text-blue-500";
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div
      className={`event-fc-color flex-col justify-center items-center flex fc-event-main p-1 rounded-sm`}
    > 
      <div className="flex fc-event-title  ">
            <p className="mr-1 text-sm font-semibold text-gray-800"> {eventInfo.event.extendedProps.timeIn} </p> -
            <p className="mr-1 text-sm font-semibold text-gray-800"> {eventInfo.event.extendedProps.timeOut} </p>
            <span className="black"><TimeIcon  /></span>
          
      </div>
      <div className="text-lg font-bold text-gray-900 font-bold text-center">{eventInfo.event.extendedProps.workHours}</div>
      <div className={`text-sm font-medium text-center ${statusColorClass}`}>{eventInfo.event.extendedProps.workHours < 1 ? "Đi muộn - Về sớm" : ""}</div>

    </div>
  );
};

export default Calendar;
