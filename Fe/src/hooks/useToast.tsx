import { toast, ToastOptions } from 'react-toastify';

export const useToast = () => {
  const defaultOptions: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  const success = (message: string, options?: ToastOptions) => {
    return toast.success(message, { ...defaultOptions, ...options });
  };

  const error = (message: string, options?: ToastOptions) => {
    return toast.error(message, { ...defaultOptions, ...options });
  };

  const info = (message: string, options?: ToastOptions) => {
    return toast.info(message, { ...defaultOptions, ...options });
  };

  const warning = (message: string, options?: ToastOptions) => {
    return toast.warning(message, { ...defaultOptions, ...options });
  };

  return {
    success,
    error,
    info,
    warning,
    toast // để sử dụng các phương thức nguyên bản nếu cần
  };
};