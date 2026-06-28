import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Donor' | 'Volunteer' | 'Receiver';
}

export interface RegisteredUser {
  name: string;
  email: string;
  password: string;
  role: 'Donor' | 'Volunteer' | 'Receiver';
}

export interface FoodItem {
  id: string;
  foodName: string;
  hotelName: string;
  quantity: string;
  expiryTime: string;
  image?: string;
  status: 'Active' | 'Accepted' | 'Picked Up' | 'Live' | 'Requested' | 'Completed';
  currentVolunteerId: string | null;
  assignedReceiverId: string | null;
  generatedOtp: string | null;
}

interface AppContextType {
  user: User | null;
  foodList: FoodItem[];
  register: (name: string, email: string, password: string, role: 'Donor' | 'Volunteer' | 'Receiver') => { success: boolean; message: string };
  login: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  addFoodItem: (foodName: string, quantity: string, expiryTime: string) => void;
  updateFoodStatus: (
    foodId: string,
    status: FoodItem['status'],
    volunteerId?: string | null,
    receiverId?: string | null,
    otp?: string | null
  ) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialFoodItems: FoodItem[] = [];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [foodList, setFoodList] = useState<FoodItem[]>(initialFoodItems);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);

  const register = (name: string, email: string, password: string, role: 'Donor' | 'Volunteer' | 'Receiver') => {
    const existingUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (existingUser) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    setRegisteredUsers((prev) => [...prev, { name, email, password, role }]);
    return { success: true, message: 'Account created successfully!' };
  };

  const login = (email: string, password: string) => {
    const matchedUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!matchedUser) {
      return { success: false, message: 'Invalid email or password. Please try again.' };
    }

    setUser({
      id: `${matchedUser.role.toLowerCase()}_${matchedUser.email.toLowerCase()}`,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
    });

    return { success: true, message: 'Login successful!' };
  };

  const logout = () => {
    setUser(null);
  };

  const addFoodItem = (foodName: string, quantity: string, expiryTime: string) => {
    const newItem: FoodItem = {
      id: Date.now().toString(),
      foodName,
      hotelName: user?.name || 'Partner Hotel',
      quantity,
      expiryTime,
      status: 'Active',
      currentVolunteerId: null,
      assignedReceiverId: null,
      generatedOtp: null,
    };
    setFoodList((prev) => [newItem, ...prev]);
  };

  const updateFoodStatus = (
    foodId: string,
    status: FoodItem['status'],
    volunteerId?: string | null,
    receiverId?: string | null,
    otp?: string | null
  ) => {
    setFoodList((prevList) =>
      prevList.map((item) => {
        if (item.id === foodId) {
          const updatedItem = { ...item, status };

          if (volunteerId !== undefined) updatedItem.currentVolunteerId = volunteerId;
          if (receiverId !== undefined) updatedItem.assignedReceiverId = receiverId;
          if (otp !== undefined) updatedItem.generatedOtp = otp;

          return updatedItem;
        }
        return item;
      })
    );
  };

  return (
    <AppContext.Provider value={{ user, foodList, register, login, logout, addFoodItem, updateFoodStatus }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};