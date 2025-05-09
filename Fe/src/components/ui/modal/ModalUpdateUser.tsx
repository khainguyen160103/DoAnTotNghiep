import { Modal } from "."
import Input from "@/components/form/input/InputField"
import SelectInputs from "@/components/form/form-elements/SelectInputs"
import Label from "@/components/form/Label"
import Button from "../button/Button"
import {User} from "@/types/common"
import { useState , useEffect} from "react"
import { ChevronDownIcon } from "@/icons"
import Select from "@/components/form/Select"
import { toast } from "react-toastify"
import axios from "axios"
import Cookies from "js-cookie"
interface ModalUpdateUserProps {
    isOpen: boolean;
    mutate: () => Promise<any>; // Thêm tham số mutate vào props
    handleSave: (userData: Partial<User>) => void ;
    user: User; // Thay đổi kiểu dữ liệu của user thành User hoặc null
    handleCloseModal: () => void;
} 

const positionOptions = [
    { value: "HR", label: "Hành Chính nhân sự" },
    { value: "BOD", label: "Giám Đốc" },
    { value: "SEO", label: "SEO & Content" },
    { value: "SALE", label: "Sale" },
    { value: "IT", label: "Phát Triển" },

  ];
const workStatusnOptions = [
    { value: "active", label: "Đang làm" },
    { value: "terminated", label: "Đã nghỉ" },
  ];
const employeeTypeOptions = [
    { value: "Full-time", label: "Full-time" },
    { value: "Part-time", label: "Part-time" },
    { value: "Thực tập sin", label: "Thực tập sinh" },
    { value: "Freelancer", label: "Freelancer" },
]
const roleOptions = [
    { value: "1", label: "HR" },
    { value: "3", label: "User" },
];

export const ModalUpdateUser : React.FC<ModalUpdateUserProps> = ({ 
    isOpen, handleSave, user, handleCloseModal , mutate
}) => {
    const token = Cookies.get('access_token_cookie')
    const [userData , setUserData ] = useState<User>({...user}); // Khởi tạo state cho dữ liệu người dùng mới
    console.log(userData);
    
    // useEffect(() => {
    //     if(isOpen) { 
    //         setUserData({}); 
    //     }
    // },[isOpen])
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };
    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    //     console.log(e.target.value , e.target.name);
          
    //     const { name, value } = e.target;
    //     setUserData((prevData) => ({ ...prevData, [name]: value })); // Cập nhật state khi có thay đổi trong input
    // }


    const handleSubmit = async ( e: React.FormEvent) => { 
        e.preventDefault()
        if(!userData.id || !userData.fullname || !userData.username || !userData.password || !userData.email) {
            toast.error("Vui lòng điền đầy đủ thông tin" ,{ 
                style: { 
                    zIndex: "9999999999999 !important",

                }
            })
        }else{ 
            try {
                console.log("Dữ liệu người dùng:", userData);
      // Gọi API PATCH để cập nhật dữ liệu
               const response =  await axios.patch(
                    `http://127.0.0.1:5000/api/auth/update`,
                    {
                    id: userData.id,
                    fullname: userData.fullname,
                    username: userData.username,
                    password: userData.password,
                    work_status: userData.work_status,
                    employee_type: userData.employee_type,
                    email: userData.email,
                    role_id : Number(userData.role),
                    },
                    { withCredentials: true 
                        , headers: { 
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                if (response.status === 200) {
                    console.log("Cập nhật thành công:", response.data);
                }
                console.log("Token:", userData);
                
      // Gọi mutate để làm mới dữ liệu từ SWR
      await mutate();

      // Gọi hàm handleSave để xử lý dữ liệu sau khi lưu
      handleSave(userData);
       toast.success("Cập nhật thành công!");

      // Đóng modal
      handleCloseModal();
    } catch (error) {
      console.error("Lỗi khi cập nhật dữ liệu:", error);
    }
            handleSave(userData); // Gọi hàm handleSave với dữ liệu người dùng đã cập nhật
        }
     }

    // const handleSelectChange = (value: string) => {
    //     console.log("Selected value:", value);
    //     setUserData((prevData) => ({ ...prevData, position_id: value })); // Cập nhật state khi có thay đổi trong select
    // };
    const handleSelectChange = (name: string, value: string) => {
    console.log("Selected value:", value);
    
    setUserData((prev) => ({ ...prev, [name]: value }));
    };

  
    return ( 
          <Modal className="max-w-[600px] p-5 lg:p-10" isOpen={isOpen} onClose={handleCloseModal} showCloseButton={true} isFullscreen={false} >
            <form onSubmit={handleSubmit} >
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <Label className="text-start">Họ Và Tên</Label>
                        <Input name="fullname"  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)} value={userData.fullname} type="text" />
                    </div>
                    <div>
                        <Label className="text-start">Username</Label>
                        <Input name="username"  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)} value={userData.username} type="text" />
                    </div>
                    <div>
                        <Label className="text-start">Password</Label>
                        <Input name="password"  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)} value={userData.password} type="text" />
                    </div>
                     <div>
                        <Label className="text-start">Trạng thái làm việc</Label>
                         <div className="relative">
                            <Select
                                options={workStatusnOptions}
                                placeholder={userData.work_status === "active" ? "Đang làm" : "Đã nghỉ"}
                                onChange={(value) => handleSelectChange("work_status", value)}
                                className="dark:bg-dark-900 w-full"
                            />
            
                            </div>
                    </div>

                    <div>
                        <Label className="text-start">Email</Label>
                        <Input type='email' name="email"  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)} value={userData.email} />
                    </div>
                    <div>
                        <Label className="text-start">Vị Trí</Label>
                         <div className="relative">
                            <Select
                                options={positionOptions}
                                placeholder={userData.position}
                                onChange={(value) => handleSelectChange("position", value)}
                                className="dark:bg-dark-900 w-full"
                            />
            
                            </div>
                    </div>
                    <div>
                        <Label className="text-start">Loại nhân viên</Label>
                         <div className="relative">
                            <Select
                                options={employeeTypeOptions}
                                placeholder={userData.employee_type}
                                onChange={(value) => handleSelectChange("employee_type", value)}
                                className="dark:bg-dark-900 w-full"
                            />
                            </div>
                    </div>
                    <div>
                        <Label className="text-start">Quyền</Label>
                         <div>
                         <div className="relative">
                            <Select
                                options={roleOptions}
                                placeholder={String(user?.role)}
                                onChange={(value) => handleSelectChange("role", value)}
                                className="dark:bg-dark-900 w-full"
                            />
                
                            </div>
                    </div>
                    </div>
                </div>
                    
                <div className="flex justify-end pt-5 space-x-0">
                    <Button  className="mr-2" variant="primary"> 
                        Lưu 
                    </Button>
                    <Button variant="outline" onClick={handleCloseModal}> 
                        Hủy  
                    </Button> 
                </div>                      
            </form>
        </Modal>
    )
    }