import { Outfit } from 'next/font/google';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer, toast} from 'react-toastify';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import AuthProvider from '@/context/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
const outfit = Outfit({
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
       
        <AuthProvider> 
          <AuthGuard>
           <ThemeProvider>

            <SidebarProvider>
              {children}
              <ToastContainer 
              position='bottom-right' 
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              style={{ zIndex: 100000 }} />
              </SidebarProvider>
          </ThemeProvider>
          </AuthGuard>
        </AuthProvider>
       
      </body>
    </html>
  );
}
