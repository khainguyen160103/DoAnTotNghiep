import Button from "../button/Button";
import { useState , useEffect} from "react";
import { SalaryData } from "@/types/common";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { User } from "@/types/common";
import Cookies from "js-cookie";
import axios from "axios";
export const ModalCreatePayroll = ({ employee , salary,  onSubmit, onCancel ,selectedMonth , selectedYear }: { employee : User , selectedMonth: number ,selectedYear: number,salary : SalaryData, onSubmit: (data: any) => void; onCancel: () => void }) => {
      const [totalOvertime, setTotalOvertime] = useState<number>(0);
      const [totalAttendance, setTotalAttendance] = useState<number>(0);
      const salaryObj = Array.isArray(salary) ? salary[0] : salary;
      const [formData, setFormData] = useState({
          base_salary: salaryObj?.base_salary ,
          total_attendance: salaryObj?.total_attendance ,
          month: salaryObj?.month ? new Date(salaryObj.month).getMonth() + 1 : "",
          year: salaryObj?.year ,
          salary_ot: salaryObj?.salary_ot ,
          salary_addOn: salaryObj?.salary_addOn ,
          salary_another: salaryObj?.salary_another ,
      });
      useEffect(() => {
        const fetchAttendance = async () => {
          if (!employee) return;
          const token = Cookies.get('access_token_cookie');
          try {
            const res = await axios.get(
              `http://127.0.0.1:5000/api/attendance/allByMonth/${employee.id}/${selectedYear}/${selectedMonth}`,
              { headers: { 'Authorization': `Bearer ${token}` }, withCredentials: true }
            );
            const totalOt: number = Array.isArray(res.data.payload)
            ? res.data.payload.reduce((sum: number, att: { total_overtime?: number }) => sum + (att.total_overtime ? Number(att.total_overtime) : 0), 0)
            : 0;
          setTotalOvertime(totalOt);
            setTotalAttendance(Array.isArray(res.data.payload) ? res.data.payload.length : 0);
          } catch {
            setTotalAttendance(0);
          }
        };
        fetchAttendance();
      }, [employee, selectedMonth, selectedYear]);
      useEffect(() => {
        // Tự động tính lương tăng ca khi có base_salary hoặc totalOvertime thay đổi
        const baseSalary = Number(formData.base_salary) || 0;
        const overtimeRate = 1.5; // hệ số tăng ca
        // 208 là số giờ công chuẩn/tháng (bạn có thể thay đổi nếu khác)
        const overtimeSalary = baseSalary && totalOvertime
          ? Math.round((baseSalary / 192) * overtimeRate * totalOvertime)
          : 0;
        setFormData(prev => ({
          ...prev,
          salary_ot: overtimeSalary
        }));
      }, [formData.base_salary, totalOvertime]);
    console.log(salary);
   
  //  console.log(formData.salary_addon)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        
        const { name, value } = e.target;
        console.log(name , value);
      setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSelectChange = (name: string) => (value: string) => {
      setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };
    useEffect(() => {
      const salaryObj = Array.isArray(salary) ? salary[0] : salary;
      const isMatch =
        salaryObj &&
        Number(new Date(salaryObj.month).getMonth() + 1) === Number(selectedMonth) &&
        Number(salaryObj.year) === Number(selectedYear);
    
      setFormData({
        base_salary: salaryObj?.base_salary ?? "",
        total_attendance: salaryObj?.total_attendance ?? "",
        month: selectedMonth,
        year: selectedYear,
        salary_ot: isMatch ? salaryObj.salary_ot ?? "" : "",
        salary_addOn: isMatch ? salaryObj.salary_addOn ?? "" : "",
        salary_another: isMatch ? salaryObj.salary_another ?? "" : "",
      });
    }, [salary, selectedMonth, selectedYear]);
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="baseSalary" className="block text-sm font-medium text-gray-700 mb-1">
              Lương cơ bản <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              id="base_salary"
              name="base_salary"
              value={formData.base_salary ?? ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <Label htmlFor="totalAttendance" className="block text-sm font-medium text-gray-700 mb-1">
              Công chuẩn <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              id="total_attendance"
              name="total_attendance"
              value={totalAttendance}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
  
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
              Tháng <span className="text-red-500">*</span>
            </Label>
            <Select
              defaultValue={selectedMonth.toString()}
              onChange={handleSelectChange("month")}
              className="w-full p-2 border border-gray-300 rounded-md"
              options={Array.from({ length: 12 }, (_, i) => ({
                value: (i + 1).toString(),
                label: `Tháng ${i + 1}`,
              }))}
            />
          </div>
          <div>
            <Label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Năm <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              id="year"
              name="year"
              value={selectedYear.toString()}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
  
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="salary_ot" className="block text-sm font-medium text-gray-700 mb-1">
              Lương tăng ca
            </Label>
            <Input
              type="number"
              id="salary_ot"
              name="salary_ot"
              value={formData.salary_ot}
              onChange={(e) => {
                const value = e.target.value;
                setFormData((prev) => ({ ...prev, salary_ot: value }));
              }}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <Label htmlFor="salary_addon" className="block text-sm font-medium text-gray-700 mb-1">
              Lương thêm
            </Label>
            <Input
              type="number"
              id="salary_addon"
              name="salary_addOn"
              value={formData.salary_addOn}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <Label htmlFor="salary_another" className="block text-sm font-medium text-gray-700 mb-1">
              Các khoản khác
            </Label>
            <Input
              type="number"
              id="salary_another"
              name="salary_another"
              value={formData.salary_another}
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