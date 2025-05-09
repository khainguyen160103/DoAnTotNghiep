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

interface ModalAddUserProps {
    isOpen: boolean;
    handleSave: (userData: Partial<User>) => void ;
    user: User | null; // Thay đổi kiểu dữ liệu của user thành User hoặc null
    handleCloseModal: () => void;
} 

const positionOptions = [
    { value: "HR", label: "Hành Chính nhân sự" },
    { value: "BOD", label: "Giám Đốc" },
    { value: "SEO", label: "SEO & Content" },
    { value: "SALE", label: "Sale" },
    { value: "IT", label: "Phát Triển" },

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

export const ModalAddUser : React.FC<ModalAddUserProps> = ({ 
    isOpen, handleSave, user, handleCloseModal
}) => {

    const [userData , setUserData ] = useState<Partial<User>>({}); // Khởi tạo state cho dữ liệu người dùng mới
    
    useEffect(() => {
        if(isOpen) { 
            setUserData({}); 
        }
    },[isOpen])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
        console.log(e.target.value , e.target.name);
          
        const { name, value } = e.target;
        setUserData((prevData) => ({ ...prevData, [name]: value })); // Cập nhật state khi có thay đổi trong input
    }


    const handleSubmit = ( e: React.FormEvent) => { 
        e.preventDefault()
        if(!userData.id || !userData.fullname || !userData.username || !userData.password || !userData.email) {
            toast.error("Vui lòng điền đầy đủ thông tin" ,{ 
                style: { 
                    zIndex: "9999999999999 !important",

                }
            })
        }else{ 
            handleSave(userData); // Gọi hàm handleSave với dữ liệu người dùng đã cập nhật
        }
     }

    const handleSelectChange = (value: string) => {
        console.log("Selected value:", value);
        setUserData((prevData) => ({ ...prevData, position_id: value })); // Cập nhật state khi có thay đổi trong select
    };
    
    return ( 
          <Modal className="max-w-[600px] p-5 lg:p-10" isOpen={isOpen} onClose={handleCloseModal} showCloseButton={true} isFullscreen={false} >
            <form onSubmit={handleSubmit} >
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <Label className="text-start">Mã nhân viên</Label>
                        <Input name="id"  onChange={handleChange} value={user?.id} type="text" />
                    </div>
                    <div>
                        <Label className="text-start">Họ Và Tên</Label>
                        <Input name="fullname"  onChange={handleChange} value={user?.fullname} type="text" />
                    </div>
                    <div>
                        <Label className="text-start">Username</Label>
                        <Input name="username"  onChange={handleChange} value={user?.username} type="text" />
                    </div>
                    <div>
                        <Label className="text-start">Password</Label>
                        <Input name="password"  onChange={handleChange} value={user?.password} type="text" />
                    </div>
                    <div>
                        <Label className="text-start">Email</Label>
                        <Input type='email' name="email"  onChange={handleChange} value={user?.email} />
                    </div>
                    <div>
                        <Label className="text-start">Vị Trí</Label>
                         <div className="relative">
                            <Select
                                options={positionOptions}
                                placeholder="Vị Trí"
                                onChange={handleSelectChange}
                                className="dark:bg-dark-900 w-full"
                            />
                            </div>
                    </div><div>
                        <Label className="text-start">Loại nhân viên</Label>
                         <div className="relative">
                            <Select
                                options={employeeTypeOptions}
                                placeholder="Loại nhân viên"
                                onChange={handleSelectChange}
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
                                placeholder="Quyền"
                                onChange={handleSelectChange}
                                className="dark:bg-dark-900 w-full"
                            />
                            
                            </div>
                    </div>
                    </div>
                </div>
                    
                <div className="flex justify-end pt-5 space-x-0">
                    <Button className="mr-2" variant="primary"> 
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