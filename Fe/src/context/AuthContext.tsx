'use client';

import { useRouter } from "next/navigation";
import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import useSWR from 'swr'
import Cookies from "js-cookie";
import axios from "axios";
import { LoginCredentials ,User, AuthResponse } from "@/types/common";
import { toast } from "react-toastify";
export const fetcher = async (url : string) => {
    const token = Cookies.get('access_token_cookie')
    if(!token) return null
    const res = await axios.post(url,{} ,{ 
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${token}`
            }
    });
    return res.data
}
// creaete context type 
interface AuthContextType { 
    user: User , 
    setUser: (user:User) => void
    isAdmin: () => boolean
    isLoading : boolean,
    login: (credentials : LoginCredentials) => Promise<void>
    logout: () => Promise<void>
    error : any
    refreshUserData: () => void
}
const AuthContext = createContext<AuthContextType | undefined> (undefined);

export default function AuthProvider({children} : {children : ReactNode}) { 
        const router = useRouter()


        const {data, error, isLoading, mutate} = useSWR(
            Cookies.get('access_token_cookie') ? `http://127.0.0.1:5000/api/user/me`: null ,
            fetcher, { 
                revalidateOnMount: true,
                revalidateOnFocus: false,
                refreshInterval: 0,
            }
        )
        
        const user = data?.payload || null;
        
        const isAdmin = () => {
            if (!user) return false;
            if (user.role === 1) return true  
            return false
        }
        
        const setUser = (user: User) => {
            // Cập nhật thông tin người dùng trong SWR cache
            mutate(user, false); // false để không thực hiện lại request
        }

        const login = async (credentials: LoginCredentials) => { 
            try { 
                
               const token = Cookies.get('access_token_cookie')

               if(token) {
                 router.push('/')
               }

               const response = await axios.post(
                    'http://127.0.0.1:5000/api/auth/login', 
                    credentials,
                    {withCredentials: true}
                )
                if(response.data.status === 200) {
                    toast.success("Đăng nhập thành công")
                }
                await mutate();
                    
                const userData = await fetcher('http://127.0.0.1:5000/api/user/me');
                console.log(userData);
                
                await mutate(userData, false);                   
                router.push('/');                                      
            } catch (error) { 
                toast.error("Đăng nhập thất bại")
                console.error("Đăng nhập thất bại", error);           
                throw error;
            }
        }

        const logout = async () => { 
            try{ 
                
                Cookies.remove('access_token_cookie')
                await mutate(null, false); // Xóa thông tin người dùng trong SWR cache
                const res  = await fetcher('http://127.0.0.1:5000/api/auth/logout')
                if(res.status === 200) { 
                   toast.success("Đăng xuất thành công")
                }
                router.push('/login')
            }catch(error) { 
                console.error("Đăng xuất thất bại")
                toast.error("Đăng xuất thất bại")
                throw error;
            }
        }
        const refreshUserData = () => {
            mutate();
        };


        const value = {
            user,
            setUser, 
            isAdmin,
            isLoading,
            error,
            login,
            logout,
            refreshUserData,
        };
        return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () =>  { 
    const context = useContext(AuthContext)
    if(context === undefined)
        throw new Error("useAuth phải được sử dụng trong AuthProvider")
    return context
}