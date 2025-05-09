"use client"
import FormSubmisstion from "../tables/FormSubmisionTable"
import { HeaderFormSubmission } from "../header/HeaderFormSubmission"
import { useFetch } from "@/hooks/useFetch"
import Spinner from "../ui/spinner/spinner"
import { toast } from "react-toastify"
import PayrollTable from "../tables/PayrollReportTable"
import useSWR from "swr"
import { useState } from "react"
import { useAuth ,} from "@/context/AuthContext"
import Cookies from "js-cookie"
import axios from "axios"
import Select from "../form/Select"
import { User } from "@/types/common"
export const Payroll = () => {
    const { user } = useAuth(); 
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
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
    
  })
    
    return <div className="flex justify-between mb-2.5 flex-col">
            <div className="flex gap-4 mb-4">
                <Select
                    placeholder="Chọn tháng"
                    onChange={value => setSelectedMonth(Number(value))}
                    options={Array.from({ length: 12 }, (_, i) => ({
                    value: (i + 1).toString(),
                    label: `Tháng ${i + 1}`,
                    }))}
                    className="w-32"
                />
                <Select
                    placeholder="Chọn năm"
                    onChange={value => setSelectedYear(Number(value))}
                    options={Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - 2 + i;
                    return { value: year.toString(), label: year.toString() };
                    })}
                    className="w-32"
                />
                </div>
            <PayrollTable  selectMonth={selectedMonth} selectYear={selectedYear} data={users} isloading={isLoading} mutate={mutate}/>
         </div> 

} 