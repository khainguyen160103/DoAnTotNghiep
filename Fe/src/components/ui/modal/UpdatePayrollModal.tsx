import React, { useState, useEffect } from 'react'
import { Modal } from '.'
import Button from '../button/Button'
import Spinner from '../spinner/spinner'
import { toast } from 'react-toastify'

interface UpdatePayrollModalProps {
  isOpen: boolean
  onClose: () => void
  payrollData: any
  onSuccess: () => void
}

const UpdatePayrollModal: React.FC<UpdatePayrollModalProps> = ({
  isOpen,
  onClose,
  payrollData,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    id: '',
    base_salary: '',
    status: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  useEffect(() => {
    if (payrollData) {
      setFormData({
        id: payrollData.id || '',
        base_salary: String(payrollData.base_salary || ''),
        status: payrollData.status || 'processed'
      })
    }
  }, [payrollData])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.id || !formData.base_salary) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/payroll/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: formData.id,
          base_salary: parseFloat(formData.base_salary),
          status: formData.status
        }),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        toast.success('Cập nhật thông tin lương thành công')
        onSuccess()
        onClose()
      } else {
        toast.error(result.message || 'Có lỗi xảy ra khi cập nhật thông tin lương')
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
            Mã phiếu lương
          </label>
          <input
            type="text"
            value={formData.id}
            className="w-full rounded border-[1.5px] border-stroke bg-gray-100 px-5 py-3 font-medium outline-none"
            disabled
          />
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
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            disabled={isSubmitting}
          >
            <option value="processed">Đã xử lý</option>
            <option value="pending">Đang chờ</option>
            <option value="draft">Bản nháp</option>
          </select>
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
            {isSubmitting ? <Spinner size="sm" /> : 'Cập nhật'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default UpdatePayrollModal
