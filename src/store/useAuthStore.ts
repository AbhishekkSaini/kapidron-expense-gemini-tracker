
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useStore } from './useStore';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

type AuthStore = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  clearError: () => void;
};

// Mock user database for local authentication
const mockUsers = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
  }
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      signIn: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Find user with matching email and password
          const user = mockUsers.find(
            u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
          );

          if (!user) {
            throw new Error('Invalid email or password');
          }

          const { password: _, ...userWithoutPassword } = user;
          
          // Set the authenticated user
          set({
            user: userWithoutPassword,
            isAuthenticated: true,
            isLoading: false
          });

          // Update the main store's currentUser
          useStore.getState().setCurrentUser(userWithoutPassword);

        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
        }
      },

      signUp: async (name, email, password) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Check if user already exists
          if (mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            throw new Error('Email already in use');
          }

          // Create new user
          const newUser = {
            id: `user-${Date.now()}`,
            name,
            email,
            password,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
          };

          // Add to mock database (would be an API call in a real app)
          mockUsers.push(newUser);

          // Remove password from user object for state
          const { password: _, ...userWithoutPassword } = newUser;
          
          // Set the authenticated user
          set({
            user: userWithoutPassword,
            isAuthenticated: true,
            isLoading: false
          });

          // Update the main store's currentUser
          useStore.getState().setCurrentUser(userWithoutPassword);
          
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
        }
      },

      signOut: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
        
        // Update the main store's currentUser
        useStore.getState().setCurrentUser(null);
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
