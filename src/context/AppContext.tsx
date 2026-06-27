import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface FoodItem {
  id: string;
  foodName: string;
  quantity: string;
  hotelName: string;
  status: 'Active' | 'Accepted' | 'Picked Up' | 'Completed';
  expiryTime: string;
  image?: string;
  latitude: number;
  longitude: number;
}

export interface UserProfile {
  name: string;
  email: string;
  role: 'Donor' | 'Volunteer' | 'Receiver';
}

interface AppContextType {
  foodList: FoodItem[];
  user: UserProfile | null;
  addFoodItem: (item: Omit<FoodItem, 'id' | 'status'>) => void;
  updateFoodStatus: (id: string, status: FoodItem['status']) => void;
  loginUser: (profile: UserProfile) => void;
  logoutUser: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialFoodItems: FoodItem[] = [
  {
    id: '1',
    foodName: 'Rice & Curry Packets',
    quantity: '15 Packets',
    hotelName: 'Hilton Colombo',
    status: 'Active',
    expiryTime: '10:30 PM',
    latitude: 6.9344, 
    longitude: 79.8428,
  },
  {
    id: '2',
    foodName: 'Assorted Pastries & Breads',
    quantity: '30 Pcs',
    hotelName: 'Perera & Sons',
    status: 'Accepted',
    expiryTime: '09:00 PM',
    latitude: 6.9271,
    longitude: 79.8612,
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [foodList, setFoodList] = useState<FoodItem[]>(initialFoodItems);
  const [user, setUser] = useState<UserProfile | null>({
    name: 'Nipun Bhanuka',
    email: 'nipun@dalecodelabs.com',
    role: 'Donor', 
  });

  const addFoodItem = (item: Omit<FoodItem, 'id' | 'status'>) => {
    const newItem: FoodItem = {
      ...item,
      id: Date.now().toString(),
      status: 'Active',
    };
    setFoodList((prevList) => [newItem, ...prevList]);
  };

  const updateFoodStatus = (id: string, status: FoodItem['status']) => {
    setFoodList((prevList) =>
      prevList.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const loginUser = (profile: UserProfile) => setUser(profile);
  const logoutUser = () => setUser(null);

  return (
    <AppContext.Provider
      value={{
        foodList,
        user,
        addFoodItem,
        updateFoodStatus,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}