'use client'; // Đánh dấu đây là Client Component

import React, { useEffect, useState } from 'react';
import BasicTableOne from './BasicTableOne';
import { User } from '@/types/common';
import useSWR from 'swr';
import { useAuth  } from '@/context/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import Button from '../ui/button/Button';
import { useModal } from '@/hooks/useModal';
import { ModalAddUser } from '../ui/modal/ModalAddUser';
import { toast } from 'react-toastify';
import { useRef } from 'react';
import SearchBar from '../ui/search/SearchUser';
import Spinner from '../ui/spinner/spinner';
export default function UserTable() {
  const { user } = useAuth(); // Lấy thông tin người dùng từ AuthContext
  const { isOpen, openModal, closeModal } = useModal(); // Sử dụng hook useModal để quản lý trạng thái modal

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
  const {data : users, error, isLoading , mutate , isValidating} = useSWR('http://127.0.0.1:5000/api/user/all' , fetcher , { 
    revalidateOnFocus: false,      // Tắt khi focus
    revalidateOnReconnect: true,   // Bật khi kết nối lại
    revalidateIfStale: false,      // Tắt revalidate tự động dữ liệu cũ
    revalidateOnMount: true, 
  })
  
  const handleAddUser = () => {
    openModal(); // Mở modal khi thêm người dùng mới
  }
  const handleCloseModal = () => { 
    closeModal(); // Đóng modal khi không cần thiết nữa
  }
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSave = async (userData : Partial<User>) => {  // Xử lý lưu người dùng mới ở đây
      const token = Cookies.get('access_token_cookie')
      console.log(userData);
      
      const response = await axios.post('http://127.0.0.1:5000/api/user/create', 
        userData
    , { 
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${token}`
      } 
    })
    console.log(response.data); // Kiểm tra phản hồi từ API
    
    if(response.status === 200) {
      await mutate()
      toast.success("Thêm người dùng thành công")
    }
    closeModal(); // Đóng modal sau khi lưu người dùng mới
  }

//  useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         const token = Cookies.get('access_token_cookie')
//         const data = await axios.get('http://127.0.0.1:5000/api/user/all',{ 
//           withCredentials: true,
//            headers: {
//               'Authorization': `Bearer ${token}`
//             }
//         })
//         const usersData = data.data.payload || [] // Lấy dữ liệu người dùng từ phản hồi
//         if(usersData !== null) { 
//           setUsers(usersData);
//         }
//         setLoading(false);

//     } catch (error) {
//         console.log(error)     
//     }finally {
       
//         setLoading(false);
//     }
    
//     }
//     fetchUsers();
//     },[])

  return ( 
    <>
    <div className='flex justify-between items-center mb-4'>
    <SearchBar />
    <Button onClick={handleAddUser} className=''>+ Thêm mới</Button>
    </div>

    {/* Hiển thị lỗi nếu có */}
    {/* {error && <div className="text-red-500">Có lỗi xảy ra: {error.message}</div>} */}
    
    {/* Hiển thị dữ liệu khi sẵn sàng */}
    {users && !isLoading &&  !error && (<BasicTableOne users={users} mutate={mutate}/>)}
    
    {/* Hiển thị indicator khi đang revalidate */}
    {isValidating && !isLoading && (
      <Spinner size="lg" color="blue" />
    )}
    {/* <BasicTableOne users={users} /> */}
    <ModalAddUser user={null} isOpen={isOpen} handleSave={handleSave} handleCloseModal={handleCloseModal}/>
    </>
  )
}