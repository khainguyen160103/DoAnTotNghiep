"use client"
import FormSubmisstion from "../tables/FormSubmisionTable"
import { HeaderFormSubmission } from "../header/HeaderFormSubmission"
import { useFetch } from "@/hooks/useFetch"
import Spinner from "../ui/spinner/spinner"
import { toast } from "react-toastify"


export const SubmissionForm = () => {
    const { data, error, isLoading, mutate } = useFetch("form/all")
  
    
    return <div className="flex justify-between mb-2.5 flex-col">
        <HeaderFormSubmission mutate={mutate} />
        
        {data && !error && !isLoading && (<FormSubmisstion 
                data={data.payload} 
                isloading={isLoading}
                mutate={mutate} 
                />)
            } 
        {error && toast.error("Lỗi khi tải dữ liệu")}
         </div> 

} 