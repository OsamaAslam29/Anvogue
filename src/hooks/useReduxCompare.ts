import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store.d';
import { compareActions } from '@/redux/slices/compareSlice';

export const useReduxCompare = () => {
    const dispatch = useDispatch();
    const compareArray = useSelector((state: RootState) => state.compare.compareArray);

    const addToCompare = (item: any) => {
        dispatch(compareActions.addToCompare(item));
    };

    const removeFromCompare = (itemId: string) => {
        dispatch(compareActions.removeFromCompare(itemId));
    };

    return {
        compareArray,
        addToCompare,
        removeFromCompare,
        compareState: { compareArray }, // For backwards compatibility
    };
};

