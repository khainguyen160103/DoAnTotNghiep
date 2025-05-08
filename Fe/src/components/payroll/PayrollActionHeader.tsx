import React from 'react'
import Button from '../ui/button/Button'

interface PayrollActionHeaderProps {
  onCreateNew: () => void
  onProcessPayroll: () => void
}

const PayrollActionHeader: React.FC<PayrollActionHeaderProps> = ({
  onCreateNew,
  onProcessPayroll
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Quản lý lương</h2>
      <div className="flex space-x-2">
        <Button
          // color="primary"
          onClick={onCreateNew}
          className="flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo thông tin lương
        </Button>
        <Button
          // color="success"
          onClick={onProcessPayroll}
          className="flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Xử lý bảng lương
        </Button>
      </div>
    </div>
  )
}

export default PayrollActionHeader
