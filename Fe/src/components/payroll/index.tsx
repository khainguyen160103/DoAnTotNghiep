"use client"
import { useState } from "react"
import { useFetch } from "@/hooks/useFetch"
import Spinner from "../ui/spinner/spinner"
import { toast } from "react-toastify"
import PayrollReportTable from "../tables/PayrollReportTable"
import PayrollActionHeader from "./PayrollActionHeader"
import CreatePayrollModal from "../ui/modal/CreatePayrollModal"
import ProcessPayrollModal from "../ui/modal/ProcessPayrollModal"
import ViewSalarySlipModal from "../ui/modal/ViewSalarySlipModal"
import UpdatePayrollModal from "../ui/modal/UpdatePayrollModal"

export const Payroll = () => {
    const [activeModal, setActiveModal] = useState<string | null>(null)
    const [selectedPayroll, setSelectedPayroll] = useState<any>(null)
    const [refreshKey, setRefreshKey] = useState<number>(0)
    
    // Fetch all payroll data
    const { data, error, isLoading, mutate } = useFetch(`payroll/all?refreshKey=${refreshKey}`, "")
    
    // Handlers for different actions
    const handleCreateNew = () => {
        setActiveModal("create")
    }
    
    const handleProcessPayroll = () => {
        setActiveModal("process")
    }
    
    const handleViewSlip = (payrollData: any) => {
        setSelectedPayroll(payrollData)
        setActiveModal("viewSlip")
    }
    
    const handleUpdate = (payrollData: any) => {
        setSelectedPayroll(payrollData)
        setActiveModal("update")
    }
    
    const closeModal = () => {
        setActiveModal(null)
        setSelectedPayroll(null)
    }
    
    const refreshData = () => {
        setRefreshKey(prev => prev + 1)
        mutate()
    }
    
    if (error) toast.error("Lỗi khi tải dữ liệu bảng lương")
    
    return (
        <div className="flex justify-between mb-2.5 flex-col">
            <PayrollActionHeader 
                onCreateNew={handleCreateNew}
                onProcessPayroll={handleProcessPayroll}
            />
            
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Spinner size="lg" color="blue"/>
                </div>
            ) : (
                <PayrollReportTable 
                    data={data?.payload || []}
                    onViewSlip={handleViewSlip}
                    onUpdatePayroll={handleUpdate}
                />
            )}
            
            {/* Modals */}
            {activeModal === "create" && (
                <CreatePayrollModal 
                    isOpen={true}
                    onClose={closeModal}
                    onSuccess={refreshData}
                />
            )}
            
            {activeModal === "process" && (
                <ProcessPayrollModal 
                    isOpen={true}
                    onClose={closeModal}
                    onSuccess={refreshData}
                />
            )}
            
            {activeModal === "viewSlip" && selectedPayroll && (
                <ViewSalarySlipModal 
                    isOpen={true}
                    onClose={closeModal}
                    payrollId={selectedPayroll.id}
                    employeeId={selectedPayroll.employee_id}
                    month={selectedPayroll.month}
                    year={selectedPayroll.year}
                />
            )}
            
            {activeModal === "update" && selectedPayroll && (
                <UpdatePayrollModal 
                    isOpen={true}
                    onClose={closeModal}
                    payrollData={selectedPayroll}
                    onSuccess={refreshData}
                />
            )}
        </div>
    )
}