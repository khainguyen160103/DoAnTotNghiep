import React from "react";
import { ModalCreatePayroll } from "./ModalCreatePayroll";
import { SalaryData, User } from "@/types/common";

interface PayrollSalaryModalProps {
  salary : SalaryData
  selectedMonth: number;
  selectedYear: number;
  isOpen: boolean;
  employee: User | null;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

export const PayrollSalaryModal: React.FC<PayrollSalaryModalProps> = ({
  isOpen,
  employee,
  onClose,
  onSubmit,
  salary,
  selectedMonth,
  selectedYear
}) => {
  if (!isOpen || !employee) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 flex justify-between border-b">
          <h3 className="text-lg font-semibold">
            Khai báo lương - {employee.fullname}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="p-4">
          <ModalCreatePayroll
            employee={employee}
            salary={salary}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
           onSubmit={onSubmit} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
};