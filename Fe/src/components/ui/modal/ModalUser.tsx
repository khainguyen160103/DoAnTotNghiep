import { Modal } from "."
import Input from "@/components/form/input/InputField"
import Label from "@/components/form/Label"
import Button from "../button/Button"
import {User} from "@/types/common"
import React from "react"

interface ModalUserProps {
    isOpen: boolean;
    handleSave: (userData: Partial<User>) => void ;
    user: User | null; // Thay đổi kiểu dữ liệu của user thành User hoặc null
    handleCloseModal: () => void;
} 


export const ModalUser : React.FC<ModalUserProps> = ({ 
    isOpen, handleSave, user, handleCloseModal
}) => {

    const [userData, setUserData] = React.useState<Partial<User>>({}); // Khởi tạo state cho dữ liệu người dùng

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({ ...prevData, [name]: value })); // Cập nhật state khi có thay đổi trong input
    }
    const handleSubmit = ( e: React.FormEvent) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của form
        // handleSave
        handleSave(userData); // Gọi hàm handleSave với dữ liệu người dùng đã cập nhật
        handleCloseModal(); // Đóng modal sau khi lưu dữ liệu
     }
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
                        <Label className="text-start">Ngày tạo</Label>
                        <Input name="created_at"  onChange={handleChange} value={user?.created_at} type="text" />
                    </div>
                    <div>
                        <Label className="text-start">Trạng Thái Tài Khoản</Label>
                        <Input name="work_status"  onChange={handleChange} value={user?.work_status} type="text" />
                    </div>
                    <div>
                        <Label className="text-start">Quyền</Label>
                        <Input name="role"  onChange={handleChange} value={user?.role} type="text" />
                    </div>
                    <div>
                        <Label className="text-start">Trạng Thái Làm Việc</Label>
                        <Input name="employee_type"  onChange={handleChange} value={user?.employee_type} type="text" />
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