// API utility functions to communicate with the backend

import { getToken } from './auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

// Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  full_name: string;
}

export interface ProfileData {
  phone_number: string;
  address: string;
  date_of_birth: string;
  gender: string;
  height?: number;
  weight?: number;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export interface SubscriptionData {
  plan_id: number;
}

export interface PaymentData {
  subscription_id: number;
  amount: number;
  payment_method: string;
  reference_number?: string;
}

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'API Error')
  }
  return data
}

// Generic fetch function with auth
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  return handleResponse(response)
}

// Authentication API calls
export async function login(credentials: LoginCredentials) {
  const formData = new FormData();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  const response = await fetch(`${API_URL}/api/auth/token`, {
    method: 'POST',
    body: formData,
  });

  return handleResponse(response);
}

export async function register(data: RegisterData) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

// User related API calls
export const getCurrentUser = () => fetchWithAuth('/user')
export const getUserProfile = () => fetchWithAuth('/user/profile')
export const updateUserProfile = (data: any) => 
  fetchWithAuth('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })

// Profile API calls
export async function createUserProfile(token: string, profileData: ProfileData) {
  const response = await fetch(`${API_URL}/api/users/me/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  return handleResponse(response);
}

// Membership related API calls
export const getActiveSubscription = () => fetchWithAuth('/subscription/active')
export const getMembershipPlans = () => fetchWithAuth('/membership-plans')

// Attendance related API calls
export const getUserAttendance = () => fetchWithAuth('/attendance')
export const getActiveAttendance = () => fetchWithAuth('/attendance/active')
export const checkIn = () => 
  fetchWithAuth('/attendance/check-in', {
    method: 'POST',
  })
export const checkOut = () => 
  fetchWithAuth('/attendance/check-out', {
    method: 'POST',
  })

// Payment API calls
export async function getUserPayments(token: string) {
  const response = await fetch(`${API_URL}/api/payments/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

export async function createPayment(token: string, paymentData: PaymentData) {
  const response = await fetch(`${API_URL}/api/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(paymentData),
  });

  return handleResponse(response);
}

// Admin API calls
export async function getAllUsers(token: string) {
  const response = await fetch(`${API_URL}/api/admin/users`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

export async function getAllSubscriptions(token: string) {
  const response = await fetch(`${API_URL}/api/admin/subscriptions`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

export async function getAllAttendance(token: string) {
  const response = await fetch(`${API_URL}/api/admin/attendance`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
} 