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

// Interface cho dữ liệu lương
interface SalaryData {
  id: string;
  base_salary: number;
  month: string;
  salary_addon: number;
  salary_another: number;
  salary_ot: number;
  salary_total: number;
  total_attendance: number;
  year: string;
  employee_id: string;
}

// Interface cho nhân viên với dữ liệu lương
interface EmployeeWithSalary {
  employee: User;
  salary: SalaryData | null;
}

export default function PayrollTable(props: { data: User[]; isloading: boolean; mutate: () => Promise<any> }) {
  const { data: employees, mutate, isloading } = props;
  const { isOpen: isOpenDelete, openModal: openModalDelete, closeModal: closeModalDelete } = useModal();
  const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();
  const { isOpen: isOpenCreate, openModal: openModalCreate, closeModal: closeModalCreate } = useModal();
  const [itemSelect, setItemSelect] = useState<FormData | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const { user } = useAuth();
  const token = Cookies.get('access_token_cookie');
  const [employeesWithSalary, setEmployeesWithSalary] = useState<EmployeeWithSalary[]>([]);

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
    setSelectedEmployee(employee);
    openModalCreate();
  };

  const handleCloseCreateSalary = () => {
    setSelectedEmployee(null);
    closeModalCreate();
  };

  const handleCreateSalary = async (formData: any) => {
    if (!selectedEmployee) return;

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/payroll/create', {
        employee_id: selectedEmployee.id,
        base_salary: parseFloat(formData.baseSalary),
        month: formData.month,
        year: formData.year,
        total_attendance: parseInt(formData.totalAttendance),
        salary_ot: parseFloat(formData.salaryOT) || 0,
        salary_addon: parseFloat(formData.salaryAddon) || 0,
        salary_another: parseFloat(formData.salaryAnother) || 0
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
                {employeesWithSalary && employeesWithSalary.length > 0 ? (
                  employeesWithSalary.map(({ employee, salary }) => (
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
                        {salary ? formatCurrency(salary.salary_addon) : "—"}
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
                        {salary ? (
                          <div className="flex justify-center">
                            <Button onClick={() => handleOpenModalEdit(salary.id)} variant="outline" size="sm" className="mr-2">
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
                          </div>
                        ) : (
                          <Button 
                            onClick={() => handleOpenCreateSalary(employee)} 
                            variant="primary" 
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
                                d="M12 4v16m8-8H4"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Khai báo lương
                          </Button>
                        )}
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

      {/* Modal chỉnh sửa */}
      {itemSelect && isOpenEdit && (
        <ModalUpdateForm
          isOpen={isOpenEdit}
          handleClose={handleCloseModalEdit}
          handleSave={handleSave}
          data={itemSelect}
          mutate={mutate}
        />
      )}

      {/* Modal tạo mới dữ liệu lương */}
      {selectedEmployee && isOpenCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-11/12 max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 flex justify-between border-b">
              <h3 className="text-lg font-semibold">Khai báo lương - {selectedEmployee.fullname}</h3>
              <button onClick={handleCloseCreateSalary} className="text-gray-500 hover:text-gray-700">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="p-4">
              <SalaryCreateForm onSubmit={handleCreateSalary} onCancel={handleCloseCreateSalary} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Component form tạo mới dữ liệu lương
function SalaryCreateForm({ onSubmit, onCancel }: { onSubmit: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    baseSalary: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    totalAttendance: "22",
    salaryOT: "0",
    salaryAddon: "0",
    salaryAnother: "0"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="baseSalary" className="block text-sm font-medium text-gray-700 mb-1">
            Lương cơ bản <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="baseSalary"
            name="baseSalary"
            value={formData.baseSalary}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="totalAttendance" className="block text-sm font-medium text-gray-700 mb-1">
            Công chuẩn <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="totalAttendance"
            name="totalAttendance"
            value={formData.totalAttendance}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
            Tháng <span className="text-red-500">*</span>
          </label>
          <select
            id="month"
            name="month"
            value={formData.month}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <option key={month} value={month}>Tháng {month}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
            Năm <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="salaryOT" className="block text-sm font-medium text-gray-700 mb-1">
            Lương tăng ca
          </label>
          <input
            type="number"
            id="salaryOT"
            name="salaryOT"
            value={formData.salaryOT}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="salaryAddon" className="block text-sm font-medium text-gray-700 mb-1">
            Lương thêm
          </label>
          <input
            type="number"
            id="salaryAddon"
            name="salaryAddon"
            value={formData.salaryAddon}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="salaryAnother" className="block text-sm font-medium text-gray-700 mb-1">
            Các khoản khác
          </label>
          <input
            type="number"
            id="salaryAnother"
            name="salaryAnother"
            value={formData.salaryAnother}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button onClick={onCancel} variant="outline">
          Hủy
        </Button>
        <Button variant="primary">
          Lưu
        </Button>
      </div>
    </form>
  );
}