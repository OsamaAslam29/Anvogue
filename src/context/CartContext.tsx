'use client'

// Legacy CartContext - MIGRATED TO REDUX
// This file is kept for backwards compatibility
// All components should now use Redux from src/redux/slices/cartSlice

import { useReduxCart } from '@/hooks/useReduxCart';

export const useCart = () => {
    // Return Redux hook for backwards compatibility
    return useReduxCart();
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <>{children}</>;
};
