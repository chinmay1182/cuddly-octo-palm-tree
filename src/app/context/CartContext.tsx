// context/CartContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string | null;  // Allow null for image
  quantity: number;
  type: 'product' | 'combo';
  weight?: string;
}

// context/CartContext.tsx
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeFromCart: (id: number, type: 'product' | 'combo') => Promise<void>;
  updateQuantity: (id: number, type: 'product' | 'combo', quantity: number) => Promise<void>;
  isCartOpen: boolean;
  toggleCart: () => void;
  cartTotal: number;
  itemCount: number;
  syncCartWithServer: (userId: number) => Promise<any>;
  clearCart: () => Promise<void>;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;  // Add this line
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // context/CartContext.tsx
  const syncCartWithServer = async (userId: number) => {
    try {
      const response = await fetch('/api/cart/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          cartItems
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data; // Return the parsed JSON data
    } catch (error) {
      console.error('Cart sync error:', error);
      throw error; // Re-throw to allow components to handle the error
    }
  };



  const clearCart = async () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const addToCart = async (item: Omit<CartItem, 'quantity'>) => {
    const newItems = [...cartItems];
    const existingItem = newItems.find(
      cartItem => cartItem.id === item.id && cartItem.type === item.type
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      newItems.push({ ...item, quantity: 1 });
    }

    setCartItems(newItems);
  };

  const removeFromCart = async (id: number, type: 'product' | 'combo') => {
    setCartItems(prevItems =>
      prevItems.filter(item => !(item.id === id && item.type === type))
    );
  };

  const updateQuantity = async (id: number, type: 'product' | 'combo', quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(id, type);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.type === type
          ? { ...item, quantity }
          : item
      )
    );
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const itemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  const toggleCart = () => setIsCartOpen(prev => !prev);

  return (
    <CartContext.Provider
      value={{
        setCartItems,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        isCartOpen,
        toggleCart,
        cartTotal,
        itemCount,
        syncCartWithServer,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};