"use client";
import { HeaderDashboard } from "@/components/header/HeaderDashboard";
import UserTable from "@/components/tables/UserTable";
export const Dashboard = () => { 
     const optionsDashboard = [
    { value: "attendance", label: "Báo cáo chấm Công" },
    { value: "payroll", label: "Báo cáo Lương" },
    { value: "latein", label: "Báo cáo đi muộn" },
  ];


  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };
    return <> 
    <HeaderDashboard options={optionsDashboard} handleSelectChange={handleSelectChange}/>
    <UserTable /> 
    </> 
}