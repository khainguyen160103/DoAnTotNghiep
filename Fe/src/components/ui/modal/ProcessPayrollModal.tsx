import React, { useState } from 'react'
import { Modal } from '.'
import Button from '../button/Button'
import Spinner from '../spinner/spinner'
import { toast } from 'react-toastify'
import { useFetch } from '@/hooks/useFetch'

interface ProcessPayrollModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const ProcessPayrollModal: React.FC<ProcessPayrollModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    month: new Date().getMonth() + 1, // Current month
    year: new Date().getFullYear(), // Current year
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [payrollResult, setPayrollResult] = useState<any>(null)
  
  const { data: employeesData } = useFetch('employee/all')
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'month' || name === 'year' ? parseInt(value) : value
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.employee_id || !formData.month || !formData.year) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }
    
    setIsSubmitting(true)
    setPayrollResult(null)
    
    try {
      const response = await fetch('/api/payroll/process-payroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setPayrollResult(result.payload)
        toast.success('Xử lý bảng lương thành công')
      } else {
        toast.error(result.message || 'Có lỗi xảy ra khi xử lý bảng lương')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi kết nối đến server')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount)
  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h1>Xử lý bảng lương</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nhân viên
            </label>
            <select
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              disabled={isSubmitting || !!payrollResult}
              required
            >
              <option value="">-- Chọn nhân viên --</option>
              {employeesData?.payload?.map((employee: any) => (
                <option key={employee.id} value={employee.id}>
                  {employee.fullname} - {employee.email}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tháng
            </label>
            <select
              name="month"
              value={formData.month}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              disabled={isSubmitting || !!payrollResult}
              required
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Năm
            </label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              disabled={isSubmitting || !!payrollResult}
              required
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
        
        {!payrollResult && (
          <div className="flex justify-end gap-4.5">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner size="sm" /> : 'Xử lý lương'}
            </Button>
          </div>
        )}
      </form>
      
      {payrollResult && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Kết quả xử lý lương</h3>
          
          <div className="mb-6">
            <h4 className="font-medium mb-2">Thông tin chung</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Nhân viên:</p>
                <p className="font-medium">{payrollResult.employee_name}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Kỳ lương:</p>
                <p className="font-medium">{payrollResult.period}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Mã phiếu lương:</p>
                <p className="font-medium">{payrollResult.payroll_id}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-2">Tổng hợp</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Lương cơ bản:</p>
                <p className="font-medium">{formatCurrency(payrollResult.summary.base_salary)}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Số ngày làm việc:</p>
                <p className="font-medium">{payrollResult.summary.working_days}/{payrollResult.summary.standard_days}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Giờ làm thêm:</p>
                <p className="font-medium">{payrollResult.summary.overtime_hours} giờ</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Tổng phụ cấp:</p>
                <p className="font-medium">{formatCurrency(payrollResult.summary.allowances)}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Tổng khấu trừ:</p>
                <p className="font-medium">{formatCurrency(payrollResult.summary.deductions)}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Thực lãnh:</p>
                <p className="font-medium text-lg text-primary">{formatCurrency(payrollResult.summary.net_salary)}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-2">Chi tiết</h4>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="border dark:border-gray-700 px-4 py-2 text-left">Mô tả</th>
                  <th className="border dark:border-gray-700 px-4 py-2 text-right">Số tiền</th>
                  <th className="border dark:border-gray-700 px-4 py-2 text-left">Loại</th>
                </tr>
              </thead>
              <tbody>
                {payrollResult.details.map((detail: any, index: number) => (
                  <tr key={index} className="border-b dark:border-gray-700">
                    <td className="border dark:border-gray-700 px-4 py-2">{detail.description}</td>
                    <td className="border dark:border-gray-700 px-4 py-2 text-right">{formatCurrency(detail.amount)}</td>
                    <td className="border dark:border-gray-700 px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        detail.type === 'earning' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {detail.type === 'earning' ? 'Thu nhập' : 'Khấu trừ'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 dark:bg-gray-800 font-medium">
                  <td className="border dark:border-gray-700 px-4 py-2">Tổng cộng</td>
                  <td className="border dark:border-gray-700 px-4 py-2 text-right">{formatCurrency(payrollResult.summary.net_salary)}</td>
                  <td className="border dark:border-gray-700 px-4 py-2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div className="flex justify-end gap-4.5">
            <Button variant="primary" onClick={onClose}>
              Đóng
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onSuccess()
                onClose()
              }}
            >
              Hoàn tất
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default ProcessPayrollModal
