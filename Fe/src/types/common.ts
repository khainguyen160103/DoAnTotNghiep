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
