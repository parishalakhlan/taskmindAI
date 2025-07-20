// src/context/types.ts
export interface User {
  _id: string;
  email: string;
  name: string;
  // Add other user properties as needed
  __v?: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
