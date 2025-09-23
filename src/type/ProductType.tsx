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

export interface ProductType {
    _id: string;
    title: string;
    detail: string;
    actualPrice: number;
    discountPrice: number;
    images: ProductImage[];
    colors: string[];
    size: string[];
    type: string;
    brand: string;
    material: string;
    categoryId: Category;
    createdAt: string;
    updatedAt: string;
    __v: number;
    bestSeller: boolean;
    newArrival: boolean;
    stock: number;
}

// Legacy interface for backward compatibility
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