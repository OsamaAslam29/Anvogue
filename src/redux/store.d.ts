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
  emi: {
    emiBanks: any[];
    selectedBank: any | null;
    selectedEMI: any | null;
    isLoading: boolean;
    error: string | null;
  };
  footer: {
    footerInfo: {
      _id?: string;
      email?: string;
      phone?: string;
      location?: string;
      createdAt?: string;
      updatedAt?: string;
      __v?: number;
    } | null;
    isLoading: boolean;
    error: string | null;
  };
}

