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
import ModalUpdateForm from "../ui/modal/ModalUpdateForm";
import { FormSubmissionData, FormData } from "@/types/common";
import { useModal } from "@/hooks/useModal";
import Badge from "../ui/badge/Badge";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../ui/spinner/spinner"; // Adjust the path based on your project structure
import {VerticallyCenteredModal} from "../ui/modal/VerticallyCenteredModal";
import Cookies from "js-cookie";

export default function FormSubmisstion(props: { data: FormSubmissionData;isloading : boolean; mutate: () => Promise<any> }) {
  const { data, mutate ,isloading } = props;
  const { letterLeaves, letterOvertimes, letterVertifications } = data;
  const { isOpen: isOpenDelete, openModal: openModalDelete, closeModal: closeModalDelete } = useModal();
  const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();
  const [itemSelect, setItemSelect] = useState<FormData | null>(null);

  const handleOpenModalEdit = async (id: string) => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/api/form/all/${id}`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setItemSelect(res.data.payload); // Lưu dữ liệu form được chọn
        openModalEdit(); // Mở modal
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Có lỗi xảy ra khi tải dữ liệu");
    }
  };

  const handleCloseModalEdit = () => {
    setItemSelect(null); // Xóa dữ liệu form được chọn
    closeModalEdit(); // Đóng modal
  };

  const handleSave = () => {
    handleCloseModalEdit();
    mutate(); // Làm mới dữ liệu trong bảng
  };
  const handleOpenModalDelete = async (id: string) => {
     const res = await axios.get(`http://127.0.0.1:5000/api/form/all/${id}`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setItemSelect(res.data.payload); // Lưu dữ liệu form được chọn
        openModalDelete(); // Mở modal
      }
    
  }; 
  const handleCloseModalDelete = () => { 
    setItemSelect(null);
    closeModalDelete();
  }
   const handleConfirmDelete = async (confirm: boolean ) => {
      const id = itemSelect?.id
      if(confirm) {
        const token = Cookies.get('access_token_cookie')
        const res = await axios.delete(`http://127.0.0.1:5000/api/form/delete/${id}`, { 
             withCredentials: true,
             headers: {
                  'Authorization': `Bearer ${token}`
                }
        }) 
        console.log(res);
        await mutate()
        toast.success("Xóa đơn thành công");
      } else {
        toast.error("Có lỗi xảy ra khi xóa đơn");

    }
  } 
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
           { !isloading && <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {!isloading && letterOvertimes.map((letter) => (
                <TableRow key={letter.id}>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {letter.id}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    <Badge color="primary" variant="light" size="md">
                      Đơn Tăng Ca
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {letter.letter_status_id === 1 ? (
                      <Badge color="error" variant="solid" size="md">
                        Từ Chối
                      </Badge>
                    ) : letter.letter_status_id === 2 ? (
                      <Badge color="warning" variant="solid" size="md">
                        Chờ duyệt
                      </Badge>
                    ) : (
                      <Badge color="success" variant="solid" size="md">
                        Đã Duyệt
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {letter.create_at}
                  </TableCell >

                   

                  <TableCell className="flex justify-center px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                     <Button onClick={() => handleOpenModalEdit(letter.id)}  variant="outline" size="sm" className="mr-2">
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
                      {/* {userSelected && isOpenEdit && (<ModalUser isOpen={isOpenEdit} handleSave={handleSave} handleCloseModal={handleCloseModalEdit} user={userSelected}/> )} */}
                      <Button onClick={() => handleOpenModalDelete(letter.id)} variant="outline" size="sm">
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
                    {itemSelect && isOpenDelete  && (<VerticallyCenteredModal isOpen={isOpenDelete} handleCloseModal={handleCloseModalDelete} handleConfirmDelete={handleConfirmDelete}/>)}

                  </TableCell>
                </TableRow>
              ))}

              {!isloading && letterVertifications.map((letter) => (
                <TableRow key={letter.id}>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {letter.id}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    <Badge color="primary" variant="light" size="md">
                      Đơn Tăng Ca
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {letter.letter_status_id === 1 ? (
                      <Badge color="error" variant="solid" size="md">
                        Từ Chối
                      </Badge>
                    ) : letter.letter_status_id === 2 ? (
                      <Badge color="warning" variant="solid" size="md">
                        Chờ duyệt
                      </Badge>
                    ) : (
                      <Badge color="success" variant="solid" size="md">
                        Đã Duyệt
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {letter.create_at}
                  </TableCell >

                   

                  <TableCell className="flex justify-center px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                     <Button onClick={() => handleOpenModalEdit(letter.id)}  variant="outline" size="sm" className="mr-2">
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
                      {/* {userSelected && isOpenEdit && (<ModalUser isOpen={isOpenEdit} handleSave={handleSave} handleCloseModal={handleCloseModalEdit} user={userSelected}/> )} */}
                      <Button onClick={() => handleOpenModalDelete(letter.id)} variant="outline" size="sm">
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
                    {itemSelect && isOpenDelete  && (<VerticallyCenteredModal isOpen={isOpenDelete} handleCloseModal={handleCloseModalDelete} handleConfirmDelete={handleConfirmDelete}/>)}

                  </TableCell>
                </TableRow>
              ))}

              {!isloading && letterLeaves.map((letter) => (
                <TableRow key={letter.id}>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {letter.id}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    <Badge color="primary" variant="light" size="md">
                      Đơn Tăng Ca
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {letter.letter_status_id === 1 ? (
                      <Badge color="error" variant="solid" size="md">
                        Từ Chối
                      </Badge>
                    ) : letter.letter_status_id === 2 ? (
                      <Badge color="warning" variant="solid" size="md">
                        Chờ duyệt
                      </Badge>
                    ) : (
                      <Badge color="success" variant="solid" size="md">
                        Đã Duyệt
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {letter.create_at}
                  </TableCell >

                   

                  <TableCell className="flex justify-center px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                     <Button onClick={() => handleOpenModalEdit(letter.id)}  variant="outline" size="sm" className="mr-2">
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
                      {/* {userSelected && isOpenEdit && (<ModalUser isOpen={isOpenEdit} handleSave={handleSave} handleCloseModal={handleCloseModalEdit} user={userSelected}/> )} */}
                      <Button onClick={() => handleOpenModalDelete(letter.id)} variant="outline" size="sm">
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
                    {itemSelect && isOpenDelete  && (<VerticallyCenteredModal isOpen={isOpenDelete} handleCloseModal={handleCloseModalDelete} handleConfirmDelete={handleConfirmDelete}/>)}

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>}
          </Table>
        </div>
      </div>

      {/* Modal */}
      {itemSelect && isOpenEdit && (
        <ModalUpdateForm
          isOpen={isOpenEdit}
          handleClose={handleCloseModalEdit}
          handleSave={handleSave}
          data={itemSelect}
          mutate={mutate} // Truyền mutate để làm mới dữ liệu
        />
      )}
      {isloading && <Spinner size="lg" color="blue"/>}

    </div>
  );
}