"use client"
import FormSubmisstion from "../tables/FormSubmisionTable"
import { HeaderFormSubmission } from "../header/HeaderFormSubmission"
import { useFetch } from "@/hooks/useFetch"
import Spinner from "../ui/spinner/spinner"
import { toast } from "react-toastify"
import PayrollReportTable from "../tables/PayrollReportTable"

export const Payroll = () => {
    const { data, error, isLoading, mutate } = useFetch("form/all")
  
    
    return <div className="flex justify-between mb-2.5 flex-col">
        {/* <HeaderFormSubmission  options={[{ value: "option1", label: "Option 1" }, { value: "option2", label: "Option 2" }]} handleSelectChange={(value) => console.log(value)} /> */}
        
        {/* {data && !error && !isLoading && (<FormSubmisstion  */}
                {/* data={data.payload}  */}
                {/* mutate={async () => {  }}  */}
                {/* />) */}
            {/* }  */}
        {/* {error && toast.error("Lỗi khi tải dữ liệu")}
        {isLoading && <Spinner size="lg" color="blue"/>} */}
        <PayrollReportTable />
         </div> 

} 