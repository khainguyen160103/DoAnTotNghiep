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

export default function PayrollTable(props: { selectMonth : number , selectYear: number , data: User[]; isloading: boolean; mutate: () => Promise<any> }) {
  const { data: employees, mutate, isloading , selectMonth  , selectYear} = props;
  console.log(selectMonth , selectYear);
  const { isOpen: isOpenDelete, openModal: openModalDelete, closeModal: closeModalDelete } = useModal();
  const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();
  const { isOpen: isOpenCreate, openModal: openModalCreate, closeModal: closeModalCreate } = useModal();
  const [itemSelect, setItemSelect] = useState<FormData | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const { user } = useAuth();
  const token = Cookies.get('access_token_cookie');
  const [employeesWithSalary, setEmployeesWithSalary] = useState<EmployeeWithSalary[]>([]);

  const filteredEmployeesWithSalary = employeesWithSalary.map(({ employee, salary }) => ({
    employee,
    salary: salary && salary.month && salary.year
      ? (Number(salary.month.split("-")[1]) === selectMonth && Number(salary.year) === selectYear ? salary : null)
      : null
  }));
  const fetcher = async (url: string) => {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true
    });
    return response.data.payload;
  };

  // Gọi API lấy dữ liệu lương của tất cả nhân viên
  const { data: salaryData, error: salaryError, isLoading: isSalaryLoading, mutate: mutateSalary } = useSWR(
    'http://127.0.0.1:5000/api/payroll/all',
    fetcher
  );

  // Kết hợp dữ liệu nhân viên và lương
  useEffect(() => {
    if (employees && Array.isArray(employees) && !isloading) {
      const combinedData: EmployeeWithSalary[] = employees.map(emp => {
        // Tìm dữ liệu lương cho nhân viên này nếu có
        const salary = salaryData && Array.isArray(salaryData) 
          ? salaryData.find((s: SalaryData) => s.employee_id === emp.id) || null
          : null;
          
        return {
          employee: emp,
          salary: salary
        };
      });
      
      setEmployeesWithSalary(combinedData);
    }
  }, [employees, salaryData, isloading, isSalaryLoading]);

  // Format số tiền thành VND
  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null) return "—";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleOpenModalEdit = async (id: string) => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/api/form/all/${id}`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setItemSelect(res.data.payload);
        openModalEdit();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Có lỗi xảy ra khi tải dữ liệu");
    }
  };

  const handleCloseModalEdit = () => {
    setItemSelect(null);
    closeModalEdit();
  };

  const handleSave = () => {
    handleCloseModalEdit();
    mutate();
    mutateSalary();
  };
  
  const handleOpenModalDelete = async (id: string) => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/api/form/all/${id}`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setItemSelect(res.data.payload);
        openModalDelete();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const handleCloseModalDelete = () => {
    setItemSelect(null);
    closeModalDelete();
  };
  
  const handleConfirmDelete = async (confirm: boolean) => {
    const id = itemSelect?.id;
    if (confirm) {
      try {
        const token = Cookies.get('access_token_cookie');
        const res = await axios.delete(`http://127.0.0.1:5000/api/form/delete/${id}`, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        toast.success("Xóa đơn thành công");
        await mutate();
        await mutateSalary();
      } catch (error) {
        toast.error("Có lỗi xảy ra khi xóa đơn");
      }
    }
    handleCloseModalDelete();
  };

  // Xử lý tạo mới dữ liệu lương cho nhân viên
  const handleOpenCreateSalary = (employee: User) => {
    console.log(employee);
    
    setSelectedEmployee(employee);
    openModalCreate();
  };

  const handleCloseCreateSalary = () => {
    setSelectedEmployee(null);
    closeModalCreate();
  };

  const handleCreateSalary = async (formData: any) => {
    if (!selectedEmployee) return;
    console.log(formData);
    const monthString = `${formData.year}-${formData.month.toString().padStart(2, "0")}-01`;
    const salary_total =
        Number(formData.base_salary) +
        Number(formData.salary_ot) +
        Number(formData.salary_addOn) +
        Number(formData.salary_another);
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/payroll/create', {
        employee_id: selectedEmployee.id,
        base_salary: Number(formData.base_salary),
        month: monthString,
        year: Number(formData.year),
        total_attendance: Number(formData.total_attendance),
        salary_ot: Number(formData.salary_ot) || 0,
        salary_addOn: Number(formData.salary_addOn) || 0,
        salary_another: Number(formData.salary_another) || 0,
        salary_total: salary_total
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true
      });

      if (response.status === 200) {
        toast.success("Tạo dữ liệu lương thành công!");
        handleCloseCreateSalary();
        mutateSalary();
      }
    } catch (error) {
      console.error("Error creating salary data:", error);
      toast.error("Có lỗi xảy ra khi tạo dữ liệu lương");
    }
  };

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
                  Mã nhân viên
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Họ và tên
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Vị trí
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Lương cơ bản
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Lương tăng ca
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Lương thêm
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Các khoản khác
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Tổng lương
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Tác vụ
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            {(isloading || isSalaryLoading) ? (
              <TableBody>
                <TableRow>
                  <TableCell className="text-center py-8">
                    <Spinner size="lg" color="blue" />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {filteredEmployeesWithSalary && filteredEmployeesWithSalary.length > 0 ? (
                  filteredEmployeesWithSalary.map(({ employee, salary }) => (
                    <TableRow key={employee.id}>
                      <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                        {employee.id}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                        {employee.fullname}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                        {employee.position || "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                        {salary ? formatCurrency(salary.base_salary) : "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                        {salary ? formatCurrency(salary.salary_ot) : "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                        {salary ? formatCurrency(salary.salary_addOn) : "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                        {salary ? formatCurrency(salary.salary_another) : "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                        {salary ? (
                          <Badge color="success" variant="light" size="md">
                            {formatCurrency(salary.salary_total)}
                          </Badge>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                          <Button 
                            onClick={() => handleOpenCreateSalary(employee)} 
                            variant="outline" 
                            size="sm"
                          >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-1"
                              >
                                <path
                                  d="M13.7474 20.4429H21"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M12.78 3.79479C13.5557 2.86779 14.95 2.73186 15.8962 3.49173C15.9485 3.53296 17.6295 4.83879 17.6295 4.83879C18.669 5.46719 18.992 6.80311 18.3494 7.82259C18.3153 7.87718 8.81195 19.7645 8.81195 19.7645C8.49578 20.1589 8.01583 20.3918 7.50291 20.3973L3.86353 20.4429L3.04353 16.9723C2.92866 16.4843 3.04353 15.9718 3.3597 15.5773L12.78 3.79479Z"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M11.0208 6.00098L16.4731 10.1881"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              Sửa
                          </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell  className="text-center py-6 text-gray-500">
                      {salaryError ? "Có lỗi xảy ra khi tải dữ liệu" : "Không có dữ liệu nhân viên"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </div>
      </div>

      {/* Modal tạo mới dữ liệu lương */}
      <PayrollSalaryModal
        isOpen={isOpenCreate}
        employee={selectedEmployee}
        onClose={handleCloseCreateSalary}
        onSubmit={handleCreateSalary}
        selectedMonth={selectMonth}
        selectedYear={selectYear}
        salary={
          selectedEmployee && salaryData && Array.isArray(salaryData)
            ? salaryData.find((s: SalaryData) => s.employee_id === selectedEmployee.id) || null
            : null
        }
      />
    </div>
  );
}
