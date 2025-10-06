'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { countdownTime } from '@/store/countdownTime'
import { useRouter } from 'next/navigation'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import productData from '@/data/Product.json'
import Product from '../Product/Product'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import { ProductType, LegacyProductType } from '@/type/ProductType'
import ErrorBoundary from '../ErrorBoundary'

interface Category {
    _id: string;
    name: string;
    image: {
        Location: string;
        Key: string;
        _id: string;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface DealProps {
    categories: Category[];
    products: any[];
}

const convertToLegacyProduct = (product: any): LegacyProductType => {
    return {
        id: product._id,
        category: product?.categoryId?.name?.toLowerCase().replace(/\s+/g, '-') || 'general',
        type: 'product',
        name: product.title || 'Untitled Product',
        gender: 'unisex',
        new: product.newArrival || false,
        sale: product.discountPrice < product.actualPrice,
        rate: 5, // Default rating
        price: product.discountPrice || 0,
        originPrice: product.actualPrice || 0,
        brand: 'Brand', // Default brand
        sold: Math.floor(Math.random() * 100), // Random sold count
        quantity: product.stock || 0,
        quantityPurchase: 1,
        sizes: product.size || [],
        variation: (product.colors || []).map((color, index) => ({
            color: color.replace(/[\[\]"]/g, ''),
            colorCode: '#000000',
            colorImage: product.images?.[0]?.Location || '',
            image: product.images?.[0]?.Location || ''
        })),
        thumbImage: (product.images || []).map(img => img.Location),
        images: (product.images || []).map(img => img.Location),
        description: product.detail || '',
        action: 'add',
        slug: (product.title || 'untitled').toLowerCase().replace(/\s+/g, '-')
    };
};

const Deal = ({ categories, products }: DealProps) => {
    const router = useRouter()
    const [swiperKey, setSwiperKey] = useState(0)

    // Force re-render of Swiper components to prevent DOM errors
    useEffect(() => {
        setSwiperKey(prev => prev + 1)
    }, [categories, products])

    const handleDetailProduct = (productId: string) => {
        router.push(`/product/default?id=${productId}`);
    };

    // Function to get products for a specific category
    const getProductsByCategory = (categoryId: string) => {
        return products.filter(product => product.categoryId?._id === categoryId);
    };

    // Function to get new arrival products
    const getNewArrivalProducts = () => {
        return products.filter(product => product.newArrival === true);
    };

    // Function to get best seller products
    const getBestSellerProducts = () => {
        return products.filter(product => product.bestSeller === true);
    };


    return (
        <ErrorBoundary>
            <div className="md:pt-[60px] pt-10">
                <div className="container">
                    {/* New Arrival Section */}
                    {(() => {
                        const newArrivalProducts = getNewArrivalProducts();
                        if (newArrivalProducts.length === 0) return null;

                        return (
                            <div className="md:pb-[60px] pb-10">
                                <div className="heading flex items-center justify-between gap-5 flex-wrap">
                                    <div className="left flex items-center gap-6 gap-y-3 flex-wrap">
                                        <div className="heading3">New Arrival</div>
                                    </div>
                                    <a href="/shop/breadcrumb-img?category=New%20Arrival" className='text-button pb-1 border-b-2 border-black'>
                                        View All New Arrivals
                                    </a>
                                </div>
                                <div className="list-product section-swiper-navigation style-outline deal-carousel md:mt-10 mt-6">
                                    {newArrivalProducts.length > 0 && (
                                        <Swiper
                                            key={`new-arrival-${swiperKey}`}
                                            spaceBetween={20}
                                            slidesPerView={2}
                                            navigation
                                            loop={newArrivalProducts.length > 5}
                                            modules={[Navigation, Autoplay]}
                                            breakpoints={{
                                                576: {
                                                    slidesPerView: 2,
                                                    spaceBetween: 20,
                                                },
                                                768: {
                                                    slidesPerView: 3,
                                                    spaceBetween: 20,
                                                },
                                                992: {
                                                    slidesPerView: 4,
                                                    spaceBetween: 20,
                                                },
                                                1200: {
                                                    slidesPerView: 5,
                                                    spaceBetween: 30,
                                                },
                                            }}
                                            className='h-full'
                                        >
                                            {newArrivalProducts.map((item, index) => (
                                                <SwiperSlide key={`${item._id}-${index}`}>
                                                    <Product data={convertToLegacyProduct(item)} type='marketplace' />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    )}
                                </div>
                            </div>
                        );
                    })()}

                    {/* Category Sections */}
                    {categories.map((category, categoryIndex) => {
                        const categoryProducts = getProductsByCategory(category._id);

                        if (categoryProducts.length === 0) return null;

                        return (
                            <div key={category._id} className={categoryIndex > 0 ? "md:pt-[60px] pt-10" : ""}>
                                <div className="heading flex items-center justify-between gap-5 flex-wrap">
                                    <div className="left flex items-center gap-6 gap-y-3 flex-wrap">
                                        <div className="heading3">{category.name}</div>
                                    </div>
                                    <a href={`/shop/breadcrumb-img?category=${encodeURIComponent(category.name)}`} className='text-button pb-1 border-b-2 border-black'>
                                        View All {category.name}
                                    </a>
                                </div>
                                <div className="list-product section-swiper-navigation style-outline deal-carousel md:mt-10 mt-6">
                                    <Swiper
                                        key={`category-${category._id}-${swiperKey}`}
                                        spaceBetween={20}
                                        slidesPerView={2}
                                        navigation
                                        loop={categoryProducts.length > 5}
                                        modules={[Navigation, Autoplay]}
                                        breakpoints={{
                                            576: {
                                                slidesPerView: 2,
                                                spaceBetween: 20,
                                            },
                                            768: {
                                                slidesPerView: 3,
                                                spaceBetween: 20,
                                            },
                                            992: {
                                                slidesPerView: 4,
                                                spaceBetween: 20,
                                            },
                                            1200: {
                                                slidesPerView: 5,
                                                spaceBetween: 30,
                                            },
                                        }}
                                        className='h-full'
                                    >
                                        {categoryProducts.map((item, index) => (
                                            <SwiperSlide key={index}>
                                                <Product data={convertToLegacyProduct(item)} type='marketplace' />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>
                        );
                    })}

                    {/* Best Seller Section */}
                    {(() => {
                        const bestSellerProducts = getBestSellerProducts();
                        if (bestSellerProducts.length === 0) return null;

                        return (
                            <div className="md:pb-[60px] py-10">
                                <div className="heading flex items-center justify-between gap-5 flex-wrap">
                                    <div className="left flex items-center gap-6 gap-y-3 flex-wrap">
                                        <div className="heading3">Best Seller</div>
                                    </div>
                                    <a href="/shop/breadcrumb-img?category=Best%20Seller" className='text-button pb-1 border-b-2 border-black'>
                                        View All Best Sellers
                                    </a>
                                </div>
                                <div className="list-product section-swiper-navigation style-outline deal-carousel md:mt-10 mt-6">
                                    <Swiper
                                        key={`best-seller-${swiperKey}`}
                                        spaceBetween={20}
                                        slidesPerView={2}
                                        navigation
                                        loop={bestSellerProducts.length > 5}
                                        modules={[Navigation, Autoplay]}
                                        breakpoints={{
                                            576: {
                                                slidesPerView: 2,
                                                spaceBetween: 20,
                                            },
                                            768: {
                                                slidesPerView: 3,
                                                spaceBetween: 20,
                                            },
                                            992: {
                                                slidesPerView: 4,
                                                spaceBetween: 20,
                                            },
                                            1200: {
                                                slidesPerView: 5,
                                                spaceBetween: 30,
                                            },
                                        }}
                                        className='h-full'
                                    >
                                        {bestSellerProducts.map((item, index) => (
                                            <SwiperSlide key={index}>
                                                <Product data={convertToLegacyProduct(item)} type='marketplace' />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>
                        );
                    })()}

                </div>
            </div>
        </ErrorBoundary>
    )
}

export default Deal
