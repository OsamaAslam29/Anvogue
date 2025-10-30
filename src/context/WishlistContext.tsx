'use client'

// Legacy WishlistContext - MIGRATED TO REDUX
// This file is kept for backwards compatibility
// All components should now use Redux from src/redux/slices/wishlistSlice

import { useReduxWishlist } from '@/hooks/useReduxWishlist';

export const useWishlist = () => {
    // Return Redux hook for backwards compatibility
    return useReduxWishlist();
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <>{children}</>;
};
