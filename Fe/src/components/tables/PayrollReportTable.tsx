import { useState } from "react"
import { Table } from "../ui/table"
import Badge from "../ui/badge/Badge"
import { formatCurrency } from "@/utils/formatters"

interface PayrollReportTableProps {
  data: any[]
  onViewSlip: (payroll: any) => void
  onUpdatePayroll: (payroll: any) => void
}

const PayrollReportTable = ({
  data = [],
  onViewSlip,
  onUpdatePayroll
}: PayrollReportTableProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Format date from database (assumes format like "2023-05-01")
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "numeric",
    })
  }

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(data.length / itemsPerPage)

  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'processed':
        return 'success' as const
      case 'pending':
        return 'warning' as const
      case 'draft':
        return 'gray' as const // Changed to 'gray' to match valid BadgeColor type
      default:
        return 'info' as const
    }
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <Table
          className="w-full"
          // headings={[
          //   "ID",
          //   "Nhân viên",
          //   "Kỳ lương",
          //   "Lương cơ bản",
          //   "Tổng thu nhập",
          //   "Thực lãnh",
          //   "Trạng thái",
          //   "Thao tác"
          // ]}
          data={currentItems.map((payroll) => [
            payroll.id,
            payroll.employee_name || `Nhân viên ${payroll.employee_id}`,
            formatDate(payroll.month),
            formatCurrency(payroll.base_salary),
            formatCurrency(payroll.gross_salary),
            formatCurrency(payroll.net_salary),
            <Badge 
              key={`badge-${payroll.id}`}
              color={getStatusColor(payroll.status)}
              text={payroll.status || "N/A"}
            />,
            <div key={`actions-${payroll.id}`} className="flex items-center space-x-2">
              <button
                className="text-primary hover:text-blue-700"
                onClick={() => onViewSlip(payroll)}
              >
                Xem phiếu
              </button>
              <button
                className="text-warning hover:text-amber-700"
                onClick={() => onUpdatePayroll(payroll)}
              >
                Cập nhật
              </button>
            </div>
          ])}
          containerClassName="min-w-full"
        />
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 mb-6">
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
              >
                Trước
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === page
                      ? "bg-primary text-white border-primary"
                      : "border-gray-300"
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
              >
                Tiếp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PayrollReportTable