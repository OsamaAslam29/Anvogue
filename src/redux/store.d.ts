export interface RootState {
  products: {
    products: any[];
    filteredProducts: any[];
    selectedProduct: any | null;
    isLoading: boolean;
    error: string | null;
  };
  categories: {
    categories: any[];
    isLoading: boolean;
    error: string | null;
  };
  cart: {
    cartArray: any[];
  };
  wishlist: {
    wishlistArray: any[];
  };
  compare: {
    compareArray: any[];
  };
}

