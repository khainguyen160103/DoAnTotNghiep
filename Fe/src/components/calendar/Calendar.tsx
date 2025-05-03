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
interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    workHours?: string;
    status?: string;
  };
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [showFileInput, setShowFileInput] = useState(false);

  
  const calendarsEvents = {
    Danger: "danger",
    Success: "success",
    Primary: "primary",
    Warning: "warning",
  };

  useEffect(() => {
    // Initialize with some events
    setEvents([
      // {
      //   id: "1",
      //   title: "Event Conf.",
      //   start: new Date().toISOString().split("T")[0],
      //   extendedProps: { calendar: "Danger" },
      // },
      // {
      //   id: "2",
      //   title: "Meeting",
      //   start: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      //   extendedProps: { calendar: "Success" },
      // },
      // {
      //   id: "3",
      //   title: "Workshop",
      //   start: new Date(Date.now() + 172800000).toISOString().split("T")[0],
      //   end: new Date(Date.now() + 259200000).toISOString().split("T")[0],
      //   extendedProps: { calendar: "Primary" },
      // },
    ]);
  }, []);
  useEffect(() => {
  setEvents([
    {
      id: "1",
      time: "08:23 - 17:45",
      start: new Date().toISOString().split("T")[0],
      extendedProps: {
        calendar: "Danger",
        workHours: "1",
        status: "Đi muộn - Về sớm",
      },
    },
    {
      id: "2",
      time: "08:45 - 17:15",
      start: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      extendedProps: {
        calendar: "Warning",
        workHours: "0.84",
        status: "Nghỉ",
      },
    },
    {
      id: "3",
      time: "08:23 - 20:15",
      start: new Date(Date.now() + 172800000).toISOString().split("T")[0],
      extendedProps: {
        calendar: "Success",
        workHours: "1.35",
        status: "Tăng ca - Làm thêm",
      },
    },
  ]);
}, []);
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);
    setEventStartDate(event.start?.toISOString().split("T")[0] || "");
    setEventEndDate(event.end?.toISOString().split("T")[0] || "");
    setEventLevel(event.extendedProps.calendar);
    openModal();
  };

  const handleAddOrUpdateEvent = () => {
    if (selectedEvent) {
      // Update existing event
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                title: eventTitle,
                start: eventStartDate,
                end: eventEndDate,
                extendedProps: { calendar: eventLevel },
              }
            : event
        )
      );
    } else {
      // Add new event
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: eventTitle,
        start: eventStartDate,
        end: eventEndDate,
        allDay: true,
        extendedProps: { calendar: eventLevel },
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
    closeModal();
    resetModalFields();
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("");
    setSelectedEvent(null);
  };

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
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Thời gian vào 
              </label>
              <div className="relative">
                 <Input type="time" />
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Thời gian ra
              </label>
              <div className="relative">
                 <Input type="time" />
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
              onClick={closeModal}
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
  console.log(eventInfo.event);
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
            <p className="mr-1 text-sm font-semibold text-gray-800"> {eventInfo.event.extendedProps.time} </p>
            <span className="black"><TimeIcon  /></span>
          
      </div>
      <div className="text-lg font-bold text-gray-900 font-bold text-center">{eventInfo.event.extendedProps.workHours}</div>
      <div className={`text-sm font-medium text-center ${statusColorClass}`}>{eventInfo.event.extendedProps.status}</div>

    </div>
  );
};

export default Calendar;
