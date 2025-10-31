'use client'

// Legacy CompareContext - MIGRATED TO REDUX
// This file is kept for backwards compatibility
// All components should now use Redux from src/redux/slices/compareSlice

import { useReduxCompare } from '@/hooks/useReduxCompare';

export const useCompare = () => {
    // Return Redux hook for backwards compatibility
    return useReduxCompare();
};

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <>{children}</>;
};
