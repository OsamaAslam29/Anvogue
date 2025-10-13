interface ProductImage {
    Location: string;
    Key: string;
    index: number;
    _id: string;
}

interface Category {
    _id: string;
    name: string;
    image?: {
        Location: string;
        Key: string;
        _id: string;
    };
}

interface Type {
    _id: string;
    name: string;
    image?: {
        Location: string;
        Key: string;
        _id: string;
    };
}

interface Brand {
    _id: string;
    name: string;
    image?: {
        Location: string;
        Key: string;
        _id: string;
    };
}

interface Material {
    _id: string;
    name: string;
}

interface EMIDetail {
    noOfEMIs: number;
    convenienceFeeInPercentage: number;
    pricePerMonth: number;
    price: number;
    convenienceFeeInPrice: number;
    totalPrice: number;
    _id: string;
}

interface EMI {
    bankName: string;
    EMIDetails: EMIDetail[];
    _id: string;
}

interface Specification {
    name: string;
    detail: any[];
    _id: string;
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
  images: any; // updated to use proper interface
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
  type?: string; // legacy field
  typeId?: Type; // new backend field
  productId?: string;
  userId?: string;
  brand?: string; // legacy field
  brandId?: Brand; // new backend field
  material?: string; // legacy field
  materialId?: Material; // new backend field
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
  ratings?: any[];
  totalRatings?: number;
  meanRating?: number;
  avgRating?: number;
  rate?: number; // added from sample data
  starCounts?: {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
  };
  action?: string; // added from sample data
  slug?: string; // added from sample data
  EMIs?: EMI[]; // new backend field
  specifications?: Specification[]; // new backend field
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