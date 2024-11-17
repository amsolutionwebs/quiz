import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  password: string;
};

type AuthStore = {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => User | null;
  logout: () => void;
  addUser: (user: Omit<User, 'id'>) => void;
};

// Default admin user
const defaultAdmin: User = {
  id: 'admin-1',
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin',
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      users: [defaultAdmin],
      login: (email, password) => {
        const user = get().users.find(
          (u) => u.email === email && u.password === password
        );
        if (user) {
          set({ user });
          return user;
        }
        return null;
      },
      logout: () => set({ user: null }),
      addUser: (newUser) =>
        set((state) => ({
          users: [...state.users, { ...newUser, id: crypto.randomUUID() }],
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);