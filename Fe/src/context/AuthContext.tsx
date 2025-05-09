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
    fetchUserData: () => Promise<User | null>
    // login: (credentials : LoginCredentials) => Promise<void>
    // logout: () => Promise<void>
    error : any
    refreshUserData: () => void
}
const AuthContext = createContext<AuthContextType | undefined> (undefined);

export default function AuthProvider({children} : {children : ReactNode}) { 
        const router = useRouter()
        const [isAuthReady, setIsAuthReady] = useState(false);

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
        const fetchUserData = async () => {
            try {
            const token = Cookies.get('access_token_cookie');
            if (!token) return null;
            
            // Sử dụng mutate để cập nhật dữ liệu user
            await mutate();
            return data?.payload;
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu người dùng:", error);
            throw error;
        } finally {
            setIsAuthReady(true);
        }
        }
        const setUser = (user: User) => {
            // Cập nhật thông tin người dùng trong SWR cache
            mutate(user, false); // false để không thực hiện lại request
        }

        // const login = async (data: LoginCredentials) => { 
        //     try { 
                
        //        const token = Cookies.get('access_token_cookie')

        //        if(token) {
        //          router.push('/')
        //        }

        //        const response = await axios.post(
        //             'http://127.0.0.1:5000/api/auth/login', 
        //             data,
        //             {withCredentials: true}
        //         )
        //         console.log(response);
                
        //         if(response.data.status === 200) {
        //             toast.success("Đăng nhập thành công")
        //         }
        //         await mutate();
                    
        //         const userData = await fetcher('http://127.0.0.1:5000/api/user/me');
        //         console.log(userData);
                
        //         await mutate(userData, false);                   
        //         router.push('/');                                      
        //     } catch (error) { 
        //         toast.error("Đăng nhập thất bại")
        //         console.error("Đăng nhập thất bại", error);           
        //         throw error;
        //     }
        // }

        // const logout = async () => { 
        //     try{ 
                
        //         Cookies.remove('access_token_cookie')
        //         await mutate(null, false); // Xóa thông tin người dùng trong SWR cache
        //         const res  = await fetcher('http://127.0.0.1:5000/api/auth/logout')
        //         console.log(res);
                
        //         toast.success("Đăng xuất thành công")
                
        //         router.push('/login')
        //     }catch(error) { 
        //         // toast.error("Đăng xuất thất bại")
        //         console.log(error);
                
        //     }
        // }
        const refreshUserData = () => {
            mutate();
        };


        const value = {
            user,
            setUser, 
            isAdmin,
            isLoading,
            error,
            // login,
            fetchUserData,
            // logout,
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