import { login as apiLogin, getCurrentUser } from './api';

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
}

// Predefined users for mock authentication
const MOCK_USERS = {
  admin: {
    id: 1,
    username: 'admin',
    email: 'admin@nielsfitness.com',
    full_name: 'Admin User',
    role: 'admin',
    is_active: true
  },
  staff: {
    id: 2,
    username: 'staff',
    email: 'staff@nielsfitness.com',
    full_name: 'Staff User',
    role: 'staff',
    is_active: true
  },
  member: {
    id: 3, 
    username: 'member',
    email: 'member@example.com',
    full_name: 'Test Member',
    role: 'member',
    is_active: true
  }
};

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

// Token management
export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token)
  }
}

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
  }
}

export const logout = () => {
  removeToken()
}

// User role management
export const setUserRole = (role: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userRole', role)
  }
}

export const getUserRole = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userRole')
  }
  return null
}

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken()
}

// Protected route middleware
export const requireAuth = () => {
  if (!isAuthenticated()) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return false
  }
  return true
}

// Mock function to generate a token
function generateMockToken(): string {
  return Math.random().toString(36).substr(2) + Date.now().toString(36);
}

// Authentication functions
export async function login(emailOrUsername: string, password: string): Promise<{ token: string; user: User }> {
  console.log('Mock login attempt with:', emailOrUsername);
  
  // Try to use the real API first
  try {
    const formData = new FormData();
    formData.append('username', emailOrUsername);
    formData.append('password', password);

    const response = await fetch('http://localhost:8000/api/auth/token', {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      console.log('Real API login successful');
      const data = await response.json();
      const token = data.access_token;
      setToken(token);
      
      const user = await getCurrentUser(token);
      return { token, user };
    }
    
    console.log('Real API login failed, falling back to mock');
  } catch (error) {
    console.log('Error with real API, falling back to mock:', error);
  }
  
  // Fall back to mock authentication
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      // Check for admin
      if ((emailOrUsername === 'admin' || emailOrUsername === 'admin@nielsfitness.com') && password === 'admin123') {
        const token = generateMockToken();
        setToken(token);
        console.log('Mock admin login successful');
        resolve({ token, user: MOCK_USERS.admin });
        return;
      }
      
      // Check for staff
      if ((emailOrUsername === 'staff' || emailOrUsername === 'staff@nielsfitness.com') && password === 'staff123') {
        const token = generateMockToken();
        setToken(token);
        console.log('Mock staff login successful');
        resolve({ token, user: MOCK_USERS.staff });
        return;
      }
      
      // Check for member
      if ((emailOrUsername === 'member' || emailOrUsername === 'member@example.com') && password === 'member123') {
        const token = generateMockToken();
        setToken(token);
        console.log('Mock member login successful');
        resolve({ token, user: MOCK_USERS.member });
        return;
      }
      
      // If we get here, authentication failed
      console.log('Mock login failed');
      reject(new Error('Invalid email/username or password'));
    }, 500);
  });
}

export async function getAuthenticatedUser(): Promise<User | null> {
  const token = getToken();
  
  if (!token) {
    return null;
  }
  
  // Try the real API first
  try {
    const user = await getCurrentUser(token);
    return user;
  } catch (error) {
    console.log('Error getting authenticated user from API, checking mock storage');
    
    // Fall back to mock authentication
    // In a real implementation, we'd decode the token and use that information
    // For now, we'll check local storage for the role
    const mockUserRole = localStorage.getItem('mockUserRole');
    if (mockUserRole && MOCK_USERS[mockUserRole as keyof typeof MOCK_USERS]) {
      return MOCK_USERS[mockUserRole as keyof typeof MOCK_USERS];
    }
    
    // If we can't determine the user, clear the token
    removeToken();
    return null;
  }
}

// Store mock user role in localStorage
export function storeMockUserRole(role: string): void {
  if (isBrowser) {
    localStorage.setItem('mockUserRole', role);
  }
}

// Role checking helpers
export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin';
}

export function isStaff(user: User | null): boolean {
  return user?.role === 'staff';
}

export function isMember(user: User | null): boolean {
  return user?.role === 'member';
} 