interface ProductImage {
    Location: string;
    Key: string;
    index: number;
    _id: string;
}

interface Category {
    _id: string;
    name: string;
}

// export interface ProductType {
//     _id: string;
//     title: string;
//     detail: string;
//     actualPrice: number;
//     discountPrice: number;
//     images: ProductImage[];
//     colors: string[];
//     size: string[];
//     type: string;
//     brand: string;
//     material: string;
//     categoryId: Category;
//     createdAt: string;
//     updatedAt: string;
//     __v: number;
//     bestSeller: boolean;
//     newArrival: boolean;
//     stock: number;
//     ratings: any[];
//     totalRatings: number;
//     meanRating: number;
//     avgRating: number;
//     starCounts: {
//         "1": number;
//         "2": number;
//         "3": number;
//         "4": number;
//         "5": number;
//     };
//     // Legacy properties for backward compatibility
//     category?: string;
//     gender?: string;
// }

// Legacy interface for backward compatibility



export interface ProductType {
  _id: string;
  id?: string; // added for compatibility with sample data
  title: string;
  name?: string; // for products using "name" instead of "title"
  detail: string;
  description?: string; // added from sample data
  actualPrice: number;
  discountPrice: number;
  price?: number; // added for compatibility
  originPrice?: number; // added from sample data
  images: any; // support both object-based and string array
  thumbImage?: string[]; // added from sample data
  variation?: {
    color: string;
    colorCode: string;
    colorImage: string;
    image: string;
  }[]; // added from sample data
  colors: string[];
  size: string[];
  sizes?: string[]; // alias for size
  type: string;
  productId?: string;
  userId?: string;
  brand: string;
  material: string;
  categoryId?: Category | string;
  category?: string; // for legacy and sample data compatibility
  gender?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  bestSeller: boolean;
  newArrival: boolean;
  new?: boolean; // added from sample data
  sale?: boolean; // added from sample data
  stock: number;
  quantity?: number; // added from sample data
  quantityPurchase?: number; // added from sample data
  sold?: number; // added from sample data
  ratings: any[];
  totalRatings: number;
  meanRating: number;
  avgRating: number;
  rate?: number; // added from sample data
  starCounts: {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
  };
  action?: string; // added from sample data
  slug?: string; // added from sample data
}

interface Variation {
    color: string;
    colorCode: string;
    colorImage: string;
    image: string;
}

export interface LegacyProductType {
    id: string,
    category: string,
    type: string,
    name: string,
    gender: string,
    new: boolean,
    sale: boolean,
    rate: number,
    price: number,
    originPrice: number,
    brand: string,
    sold: number,
    quantity: number,
    quantityPurchase: number,
    sizes: Array<string>,
    variation: Variation[],
    thumbImage: Array<string>,
    images: Array<string>,
    description: string,
    action: string,
    slug: string
}