export interface LoginCredentials { 
    username :string, 
    password: string
}
export interface User{ 
    id: string
    employee_type: string
    username: string
    isActived: boolean
    fullname: string
    email: string
    password: string
    role: number
    created_at?: string
    work_status: string
    role_id: number
}
export interface AuthState { 
    user: User | null
    // isAuthenticated: boolean
    isLoading: boolean
    error: any
}
export interface AuthResponse { 
    message: string
    payload: {
        token: string
    }
    status: number | null
}

export interface FormSubmissionData {
  letterLeaves: Array<{
    create_at: string;
    end_at: string;
    id: string;
    letter_status_id: number;
    [key: string]: any; // Nếu có thêm các trường khác
  }>;
  letterOvertimes: Array<{
    create_at: string;
    end_at: string;
    id: string;
    employee_id: string;
    letter_status_id: number;
    [key: string]: any; // Nếu có thêm các trường khác
  }>;
  letterVertifications: Array<{
    create_at: string;
    id: string;
    letter_status_id: number;
    note: string;
    [key: string]: any; // Nếu có thêm các trường khác
  }>;
}


export interface  FormData {
        create_at : string,
        employee_id: string,
        end_at?:string,
        id: string
        letter_status_id: number,
        note: string,
        request_date?: string,
        start_at?: string,
        title: string,
        type_date_ot_id?: number
  
}