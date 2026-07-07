import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Donor' | 'Volunteer' | 'Receiver';
  address: string;
}

export interface RegisteredUser {
  name: string;
  email: string;
  password: string;
  role: 'Donor' | 'Volunteer' | 'Receiver';
  address: string;
}

export interface FoodItem {
  id: string;
  foodName: string;
  hotelName: string;
  quantity: string;
  expiryTime: string;
  address: string;
  image?: string;
  status: 'Active' | 'Accepted' | 'Picked Up' | 'Live' | 'Requested' | 'Completed';
  currentVolunteerId: string | null;
  assignedReceiverId: string | null;
  generatedOtp: string | null;
}

interface AppContextType {
  user: User | null;
  foodList: FoodItem[];
  register: () => { success: boolean; message: string };
  login: () => { success: boolean; message: string };
  logout: () => void;
  addFoodItem: (foodName: string, quantity: string, expiryTime: string, image?: string) => void;
  updateFoodStatus: (
    foodId: string,
    status: FoodItem['status'],
    volunteerId?: string | null,
    receiverId?: string | null,
    otp?: string | null
  ) => void;
  updateProfile: (name: string, address: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialFoodItems: FoodItem[] = [];

export const getExpiryDisplay = (isoString: string) => {
  try {
    if (!isoString || typeof isoString !== 'string') return String(isoString);

    // Manually parse ISO 8601 string to bypass any JS Engine Date parsing inconsistencies
    // Format: "YYYY-MM-DDTHH:MM:SS.mmmZ"
    const match = isoString.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
    
    if (!match) {
      return isoString; // fallback if it's not our expected format
    }

    const [_, year, month, day, hours, minutes, seconds] = match;
    
    // Create Date object using UTC constructor (100% reliable across all JS engines)
    const expiryDate = new Date(Date.UTC(+year, +month - 1, +day, +hours, +minutes, +seconds));
    
    if (isNaN(expiryDate.getTime())) return isoString;
    
    const diffMs = expiryDate.getTime() - Date.now();
    if (diffMs <= 0) return 'Expired';
    
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    return `In ${diffHours} ${diffHours === 1 ? 'Hour' : 'Hours'}`;
  } catch (e) {
    return isoString;
  }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [foodList, setFoodList] = useState<FoodItem[]>(initialFoodItems);
  const register = () => {
    return { success: true, message: 'Account created successfully!' };
  };

  const login = () => {
    setUser({
      id: `mock_donor_id`,
      name: 'Mock Donor',
      email: 'donor@test.com',
      role: 'Donor',
      address: '123 Donor St',
    });

    return { success: true, message: 'Login successful!' };
  };

  const logout = () => {
    setUser(null);
  };

  const addFoodItem = (foodName: string, quantity: string, expiryTime: string, image?: string) => {
    const newItem: FoodItem = {
      id: Date.now().toString(),
      foodName,
      hotelName: user?.name || 'Partner Hotel',
      quantity,
      expiryTime,
      address: user?.address || 'Unknown Address',
      image: image || undefined,
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

  const updateProfile = (name: string, address: string) => {
    if (user) {
      setUser({ ...user, name, address });
    }
  };

  return (
    <AppContext.Provider value={{ user, foodList, register, login, logout, addFoodItem, updateFoodStatus, updateProfile }}>
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