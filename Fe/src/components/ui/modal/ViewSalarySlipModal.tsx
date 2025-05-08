import React, { useEffect, useState } from 'react'
import { Modal } from '.'
import Button from '../button/Button'
import Spinner from '../spinner/spinner'
import { toast } from 'react-toastify'

interface ViewSalarySlipModalProps {
  isOpen: boolean
  onClose: () => void
  payrollId: string
  employeeId: string
  month: number | string
  year: number | string
}

const ViewSalarySlipModal: React.FC<ViewSalarySlipModalProps> = ({
  isOpen,
  onClose,
  payrollId,
  employeeId,
  month,
  year
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [salarySlip, setSalarySlip] = useState<any>(null)
  
  useEffect(() => {
    const fetchSalarySlip = async () => {
      setIsLoading(true)
      
      try {
        const response = await fetch('/api/payroll/slip', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            employee_id: employeeId,
            month,
            year,
          }),
        })
        
        const result = await response.json()
        
        if (response.ok) {
          setSalarySlip(result.payload)
        } else {
          toast.error(result.message || 'Không thể tải phiếu lương')
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi kết nối đến server')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (isOpen && employeeId && month && year) {
      fetchSalarySlip()
    }
  }, [isOpen, employeeId, month, year])
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount)
  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : salarySlip ? (
        <div>
          <div className="mb-6">
            <div className="flex justify-between border-b pb-4">
              <div>
                <h3 className="text-lg font-medium">PHIẾU LƯƠNG</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Kỳ lương: {month}/{year}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{salarySlip.employee_name}</p>
                <p className="text-gray-600 dark:text-gray-400">{salarySlip.position}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-2">Thông tin chung</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Số ngày làm việc:</p>
                <p className="font-medium">{salarySlip.working_days}/{salarySlip.standard_days} ngày</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Giờ làm thêm:</p>
                <p className="font-medium">{salarySlip.overtime_hours} giờ</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Lương cơ bản:</p>
                <p className="font-medium">{formatCurrency(salarySlip.base_salary)}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Lương tính theo ngày làm:</p>
                <p className="font-medium">{formatCurrency(salarySlip.prorated_salary)}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-2">Các khoản thu nhập</h4>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="border dark:border-gray-700 px-4 py-2 text-left">Khoản mục</th>
                  <th className="border dark:border-gray-700 px-4 py-2 text-right">Số tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border dark:border-gray-700 px-4 py-2">Lương theo ngày công</td>
                  <td className="border dark:border-gray-700 px-4 py-2 text-right">{formatCurrency(salarySlip.prorated_salary)}</td>
                </tr>
                {salarySlip.overtime_hours > 0 && (
                  <tr>
                    <td className="border dark:border-gray-700 px-4 py-2">Tiền làm thêm giờ</td>
                    <td className="border dark:border-gray-700 px-4 py-2 text-right">{formatCurrency(salarySlip.overtime_pay)}</td>
                  </tr>
                )}
                {salarySlip.allowances > 0 && (
                  <tr>
                    <td className="border dark:border-gray-700 px-4 py-2">Phụ cấp</td>
                    <td className="border dark:border-gray-700 px-4 py-2 text-right">{formatCurrency(salarySlip.allowances)}</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 dark:bg-gray-800 font-medium">
                  <td className="border dark:border-gray-700 px-4 py-2">Tổng thu nhập</td>
                  <td className="border dark:border-gray-700 px-4 py-2 text-right">
                    {formatCurrency(salarySlip.prorated_salary + salarySlip.overtime_pay + salarySlip.allowances)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          {salarySlip.deductions > 0 && (
            <div className="mb-6">
              <h4 className="font-medium mb-2">Các khoản khấu trừ</h4>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="border dark:border-gray-700 px-4 py-2 text-left">Khoản mục</th>
                    <th className="border dark:border-gray-700 px-4 py-2 text-right">Số tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border dark:border-gray-700 px-4 py-2">Khấu trừ</td>
                    <td className="border dark:border-gray-700 px-4 py-2 text-right">{formatCurrency(salarySlip.deductions)}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 dark:bg-gray-800 font-medium">
                    <td className="border dark:border-gray-700 px-4 py-2">Tổng khấu trừ</td>
                    <td className="border dark:border-gray-700 px-4 py-2 text-right">{formatCurrency(salarySlip.deductions)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Thực lãnh:</h4>
              <p className="text-xl font-bold text-primary">{formatCurrency(salarySlip.net_salary)}</p>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button variant="primary" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      ) : (
        <div className="py-4">
          <p className="text-center text-gray-500">Không thể tải thông tin phiếu lương</p>
          <div className="flex justify-center mt-4">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default ViewSalarySlipModal
