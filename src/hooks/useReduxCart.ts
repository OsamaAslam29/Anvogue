import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store.d';
import { cartActions } from '@/redux/slices/cartSlice';

export const useReduxCart = () => {
    const dispatch = useDispatch();
    const cartArray = useSelector((state: RootState) => state.cart.cartArray);

    const addToCart = (item: any) => {
        dispatch(cartActions.addToCart(item));
    };

    const updateCart = (itemId: string, quantity: number, selectedSize: string, selectedColor: string) => {
        dispatch(cartActions.updateCart({ itemId, quantity, selectedSize, selectedColor }));
    };

    const removeFromCart = (itemId: string) => {
        dispatch(cartActions.removeFromCart(itemId));
    };

    return {
        cartArray,
        addToCart,
        updateCart,
        removeFromCart,
        cartState: { cartArray }, // For backwards compatibility
    };
};

