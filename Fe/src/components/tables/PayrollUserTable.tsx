'use client';

import { useState, useEffect } from "react";
import Button from "../ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import ModalUpdateForm from "../ui/modal/ModalUpdateForm";
import { FormSubmissionData, FormData } from "@/types/common";
import { useModal } from "@/hooks/useModal";
import Badge from "../ui/badge/Badge";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../ui/spinner/spinner";
import {VerticallyCenteredModal} from "../ui/modal/VerticallyCenteredModal";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types/common";
import useSWR from 'swr';
import { ModalCreatePayroll } from "../ui/modal/ModalCreatePayroll";
import { PayrollSalaryModal } from "../ui/modal/PayrolSalaryModal";
import { SalaryData } from "@/types/common";


interface EmployeeWithSalary {
  employee: User;
  salary: SalaryData | null;
}

export default function PayrollUserTale(props: { selectMonth : number , selectYear: number , data: User[]; isloading: boolean; mutate: () => Promise<any> }) {
  const { data: employees, mutate, isloading , selectMonth  , selectYear} = props;
  console.log(selectMonth , selectYear);
  
  const { user } = useAuth();
  const token = Cookies.get('access_token_cookie');
  
  
  const [deductions, setDeductions] = useState<any[]>([]);

  useEffect(() => {
    if (user && user.role === 3) {
      const fetchDeductions = async () => {
        try {
          const res = await axios.get(
            `http://127.0.0.1:5000/api/payroll/deduction/${user.id}/${selectMonth}/${selectYear}`
          );
          setDeductions(Array.isArray(res.data.payload) ? res.data.payload : []);
        } catch {
          setDeductions([]);
        }
      };
      fetchDeductions();
    }
  }, [user, selectMonth, selectYear]);
  console.log(deductions);
  

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Tên
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Loại
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Số Tiền
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Ngày xảy ra
                </TableCell>
              </TableRow>
            </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {deductions.length > 0 &&
                  deductions.map((deduction, idx) => (
                    <TableRow key={deduction.id + '-' + deduction.attendance_date + '-' + idx}>
                     <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                        {deduction?.name_deducation}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                        {deduction?.type_deducation}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                        {deduction?.money}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                        {deduction?.attendance_date}
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

// <TableRow>
// <TableCell  className="text-center py-6 text-gray-500">
//   asdasd
// </TableCell>
// </TableRow>