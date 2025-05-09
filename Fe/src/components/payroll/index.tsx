"use client"
import FormSubmisstion from "../tables/FormSubmisionTable"
import { HeaderFormSubmission } from "../header/HeaderFormSubmission"
import { useFetch } from "@/hooks/useFetch"
import Spinner from "../ui/spinner/spinner"
import { toast } from "react-toastify"
import PayrollTable from "../tables/PayrollReportTable"
import useSWR from "swr"
import { useAuth } from "@/context/AuthContext"
import Cookies from "js-cookie"
import axios from "axios"
import { User } from "@/types/common"
export const Payroll = () => {
    const { user } = useAuth(); 
    const fetcher = async (url : string) => {
    const token = Cookies.get('access_token_cookie')
    if(!token) return null
    const res = await axios.get(url ,{ 
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${token}`
            }
    });
    return res.data.payload
}
    // const { data, error, isLoading, mutate } = useFetch()
    const {data : users, error, isLoading , mutate , isValidating} = useSWR(user?.role === 1 ?'http://127.0.0.1:5000/api/user/all' : null , fetcher , { 
    // revalidateOnFocus: false,      // Tắt khi focus
    // revalidateOnReconnect: true,   // Bật khi kết nối lại
    // revalidateIfStale: tr,      // Tắt revalidate tự động dữ liệu cũ
    // revalidateOnMount: true, 
  })
    
    return <div className="flex justify-between mb-2.5 flex-col">
        {/* <HeaderFormSubmission mutate={mutate} />
        
        {data && !error && !isLoading && (<FormSubmisstion 
                data={data.payload} 
                isloading={isLoading}
                mutate={mutate} 
                />)
            } 
        {error && toast.error("Lỗi khi tải dữ liệu")} */}
        <PayrollTable data={users} isloading={isLoading} mutate={mutate}/>
         </div> 

} 