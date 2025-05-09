"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { ReactElement, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect } from "react";
import Spinner from "@/components/ui/spinner/spinner";
export default function SignInForm() {
  const router = useRouter()
  const { isLoading : userLoading , fetchUserData } = useAuth()
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [password, setPassword] = useState('')
  const [username , setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const token = Cookies.get('access_token_cookie')
    if(token) { 
      router.push('/') 
    }
  },[router]) 

  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();

    if (username === '') {
      toast.error("Vui lòng nhập tài khoản")
      return
    }else if(password === '') {
      toast.error("Vui lòng nhập mật khẩu")
    }else { 
      try {
        setIsLoading(true)
        const response = await axios.post('http://127.0.0.1:5000/api/auth/login', {username, password}, 
          { 
            withCredentials: true,
          }
        )
        console.log(userLoading);
        
        
        if (response.status !== 200) {
        toast.success(response.data.message);
        }
        await fetchUserData();
            
            // Sử dụng setTimeout để đảm bảo dữ liệu đã được cập nhật
            setTimeout(() => {
                router.push('/');
            }, 500);
      } catch (error) {
        console.log(error);
        
        if (axios.isAxiosError(error) && error.response) {
          const errorData = error.response.data;
          toast.error(errorData.message );
        } else {
          toast.error("Đăng nhập thất bại");
        }
      } finally {
        setIsLoading(false)
      }
    }
  }
  return  <>
   <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">      
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 text-center font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Đăng nhập
          </h1>
        </div>
        
        {/* Hiển thị spinner khi đang loading, ngược lại hiển thị form */}
        {isLoading ? (
          <div className="flex items-center justify-center h-72">
            <Spinner size="lg" color="blue" />
          </div>
        ) : (
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Tài khoản <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="Tài khoản" type="text" onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                  <Label>
                    Mật khẩu <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu của bạn"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="mt-2.5 flex items-center justify-between">
                  <Button className="w-full" size="sm">
                    Đăng nhập
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  </>
}
