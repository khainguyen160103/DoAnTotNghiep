import React, { useState } from 'react'
import { Modal } from '.'
import Button from '../button/Button'
import Spinner from '../spinner/spinner'
import { toast } from 'react-toastify'
import { useFetch } from '@/hooks/useFetch'

interface CreatePayrollModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const CreatePayrollModal: React.FC<CreatePayrollModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    base_salary: '',
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: employeesData } = useFetch('employee/all')
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.employee_id || !formData.base_salary) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/payroll/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee_id: formData.employee_id,
          base_salary: parseFloat(formData.base_salary),
        }),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        toast.success('Tạo thông tin lương thành công')
        onSuccess()
        onClose()
      } else {
        toast.error(result.message || 'Có lỗi xảy ra khi tạo thông tin lương')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi kết nối đến server')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nhân viên
          </label>
          <select
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            disabled={isSubmitting}
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
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lương cơ bản
          </label>
          <input
            type="number"
            name="base_salary"
            value={formData.base_salary}
            onChange={handleChange}
            placeholder="Nhập lương cơ bản"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            disabled={isSubmitting}
            required
          />
        </div>
        
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
            {isSubmitting ? <Spinner size="sm" /> : 'Tạo mới'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreatePayrollModal
