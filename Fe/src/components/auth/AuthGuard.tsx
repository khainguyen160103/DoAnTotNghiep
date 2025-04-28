'use client'; 

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const {user, isLoading,  error} = useAuth()
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    console.log(user);
    
  useEffect(() => { 
    if(!isLoading && !user) { 
        router.push('/login')
     
  }}, [isLoading,user, router]);

        // if(!isLoading || !isAuthenticated) 
        // { 
        //      return <div className="flex items-center justify-center min-h-screen">
        //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        //     </div>;
        // }
    // if (isLoading) { 
    //     return (
    //         <div className="flex items-center justify-center min-h-screen">
    //             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    //         </div>
    //     );
    // }
    //  if (!user) {
    //     return (
    //         <div className="flex items-center justify-center min-h-screen">
    //             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    //         </div>
    //     );
    // }
    return <>{children}</>;
} 