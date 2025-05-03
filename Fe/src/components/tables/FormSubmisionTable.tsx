'use client';

import { useState } from "react";
import Button from "../ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Spinner from "../ui/spinner/spinner";
import { User } from "@/types/common";
import { useModal } from "@/hooks/useModal";
import Badge from "../ui/badge/Badge";
import { useAuth } from "@/context/AuthContext";
import {VerticallyCenteredModal} from "../ui/modal/VerticallyCenteredModal";
import { ModalUser } from "../ui/modal/ModalUser";
import { toast } from "react-toastify";
// Define the table data using the interface
import useSWR, { mutate } from "swr";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function FormSubmisstion(props : {users: User[] , mutate: () => Promise<any>}) {
  const { users , mutate} = props;
  const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();
  const { isOpen: isOpenDelete, openModal: openModalDelete, closeModal: closeModalDelete } = useModal();
  const [idSelected, setIdSelected] = useState<string | null>(null);
  

  const { user } = useAuth(); 
  const handleOpenModalEdit = (userID : string) => {
    setIdSelected(userID);
    openModalEdit();

    
  };
  const handleOpenModalDelete = (userID : string) => {
    setIdSelected(userID);
    openModalDelete();
    
  };

  const handleCloseModalEdit = () => { 
    setIdSelected(null);
    closeModalEdit();
  }
    const handleCloseModalDelete = () => { 
    setIdSelected(null);
    closeModalDelete();
  }
   const handleConfirmDelete = async (confirm: boolean ) => {
      const id = userSelected?.id
      if(confirm) {
        const token = Cookies.get('access_token_cookie')
        const res = await axios.patch(`http://127.0.0.1:5000/api/user/${id}`, {} , { 
             withCredentials: true,
             headers: {
                  'Authorization': `Bearer ${token}`
                }
        }) 
        console.log(res);
        await mutate()
        toast.success("Xóa người dùng thành công");
      } else {
        toast.error("Có lỗi xảy ra khi xóa người dùng");

    }
  }
  const handleSave = () => {
    // Handle save logic here
    console.log("Save button clicked");
    closeModalEdit();
  };
  const userSelected = Array.isArray(users) && idSelected ? 
    users.find((user) => user.id === idSelected) : null;
  const hasUsers = Array.isArray(users) && users.length > 0;
  console.log(users);
  
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
         <Table>
            {/* Table Header */}
             <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  STT
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Mã Đơn
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Loại Đơn
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Trạng thái
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Ngày tạo

                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Tác vụ
                </TableCell>
                
              </TableRow>
            </TableHeader>
           

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
               
                <TableRow>
                  <TableCell className="px-5 py-4 sm:px-6 text-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          001
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                   a01
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                   Xin nghi 
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                  Refuse
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                   12/11/2023
                  </TableCell>
                  {/* <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                   " {user.isActived ? 'True': 'False'}"
                  </TableCell>   */}
                  <TableCell className=" flex justify-center px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    <Button onClick={() => handleOpenModalEdit(user.id)}  variant="outline" size="sm" className="mr-2">
                       <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-1"
                          >
                            <path
                              d="M13.7474 20.4429H21"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M12.78 3.79479C13.5557 2.86779 14.95 2.73186 15.8962 3.49173C15.9485 3.53296 17.6295 4.83879 17.6295 4.83879C18.669 5.46719 18.992 6.80311 18.3494 7.82259C18.3153 7.87718 8.81195 19.7645 8.81195 19.7645C8.49578 20.1589 8.01583 20.3918 7.50291 20.3973L3.86353 20.4429L3.04353 16.9723C2.92866 16.4843 3.04353 15.9718 3.3597 15.5773L12.78 3.79479Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M11.0208 6.00098L16.4731 10.1881"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                    </Button>
                    {userSelected && isOpenEdit && (<ModalUser isOpen={isOpenEdit} handleSave={handleSave} handleCloseModal={handleCloseModalEdit} user={userSelected}/> )}
                    <Button onClick={() => handleOpenModalDelete(user.id)} variant="outline" size="sm">
                      <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-1 text-error-500"
                          >
                            <path
                              d="M19.3248 9.46826C19.3248 9.46826 18.7818 16.2033 18.4668 19.0403C18.3168 20.3953 17.4798 21.1893 16.1088 21.2143C13.4998 21.2613 10.8878 21.2643 8.27979 21.2093C6.96079 21.1823 6.13779 20.3783 5.99079 19.0473C5.67379 16.1853 5.13379 9.46826 5.13379 9.46826"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M20.708 6.23975H3.75"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M17.4406 6.23973C16.6556 6.23973 15.9796 5.68473 15.8256 4.91573L15.5826 3.69973C15.4326 3.13873 14.9246 2.75073 14.3456 2.75073H10.1126C9.53358 2.75073 9.02558 3.13873 8.87558 3.69973L8.63258 4.91573C8.47858 5.68473 7.80258 6.23973 7.01758 6.23973"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                    </Button>
                   {userSelected && isOpenDelete  && (<VerticallyCenteredModal isOpen={isOpenDelete} handleCloseModal={handleCloseModalDelete} handleConfirmDelete={handleConfirmDelete}/>)}
                  </TableCell> 
                </TableRow>
                
              {/* )) */}
            {/* } */}
            </TableBody>
          </Table>
        {/* // :  <Spinner size="lg" color="blue" />} */}
        </div>
      </div>
    </div>
  );
}
