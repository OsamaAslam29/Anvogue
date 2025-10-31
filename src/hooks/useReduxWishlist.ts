import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store.d';
import { wishlistActions } from '@/redux/slices/wishlistSlice';

export const useReduxWishlist = () => {
    const dispatch = useDispatch();
    const wishlistArray = useSelector((state: RootState) => state.wishlist.wishlistArray);

    const addToWishlist = (item: any) => {
        dispatch(wishlistActions.addToWishlist(item));
    };

    const removeFromWishlist = (itemId: string) => {
        dispatch(wishlistActions.removeFromWishlist(itemId));
    };

    return {
        wishlistArray,
        addToWishlist,
        removeFromWishlist,
        wishlistState: { wishlistArray }, // For backwards compatibility
    };
};

