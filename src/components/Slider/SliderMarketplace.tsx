'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';

import ProductService from '@/services/product.service';
import { ProductType } from '@/type/ProductType';

interface SlideData {
    id: string;
    title: string;
    heading: string;
    image: string;
    link: string;
    product?: ProductType;
}

const SliderMarketplace = () => {
    const { products, isLoading, error } = useSelector((state: any) => state.products)
    const [featuredProducts, setFeaturedProducts] = useState<SlideData[]>([])
    const dispatch = useDispatch()

    useEffect(() => {
        ProductService.getAll(dispatch)
    }, [dispatch]);

    useEffect(() => {
        if (products && products.length > 0) {
            // Filter products for different categories
            const bestSellers = products.filter((product: ProductType) => product.bestSeller).slice(0, 3)
            const newArrivals = products.filter((product: ProductType) => product.newArrival).slice(0, 3)
            const trending = products.slice(0, 3) // First 3 products as trending

            // Combine and create slides
            const slides: SlideData[] = [
                ...bestSellers.map((product: ProductType) => ({
                    id: `best-${product._id}`,
                    title: "BEST SELLING",
                    heading: product.title,
                    image: product.images[0]?.Location || '/images/slider/marketplace.png',
                    link: `/product/${product._id}`,
                    product: product
                })),
                ...newArrivals.map((product: ProductType) => ({
                    id: `new-${product._id}`,
                    title: "NEW ARRIVALS",
                    heading: product.title,
                    image: product.images[0]?.Location || '/images/slider/marketplace.png',
                    link: `/product/${product._id}`,
                    product: product
                })),
                ...trending.map((product: ProductType) => ({
                    id: `trending-${product._id}`,
                    title: "TRENDING NOW",
                    heading: product.title,
                    image: product.images[0]?.Location || '/images/slider/marketplace.png',
                    link: `/product/${product._id}`,
                    product: product
                }))
            ]

            setFeaturedProducts(slides)
        }
    }, [products]);

    // Fallback slides if no products are available
    const fallbackSlides: SlideData[] = [
        {
            id: "1",
            title: "BEST SELLING",
            heading: "Step Into New Worlds",
            image: '/images/slider/marketplace.png',
            link: '/shop/breadcrumb-img'
        },
        {
            id: "2",
            title: "NEW ARRIVALS",
            heading: "Discover Amazing Products",
            image: '/images/slider/marketplace.png',
            link: '/shop/breadcrumb-img'
        },
        {
            id: "3",
            title: "TRENDING NOW",
            heading: "Shop the Latest Trends",
            image: '/images/slider/marketplace.png',
            link: '/shop/breadcrumb-img'
        }
    ];

    const marketplaceSlides = featuredProducts.length > 0 ? featuredProducts : fallbackSlides;

    if (isLoading) {
        return (
            <div className="slider-block style-marketplace lg:h-[500px] md:h-[400px] sm:h-[320px] h-[280px] w-full">
                <div className="container pt-10 flex justify-center items-center h-full w-full">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading products...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="slider-block style-marketplace lg:h-[500px] md:h-[400px] sm:h-[320px] h-[280px] w-full">
                <div className="container pt-10 flex justify-center items-center h-full w-full">
                    <div className="text-center">
                        <p className="text-red-600">Error loading products: {error}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="slider-block style-marketplace lg:h-[500px] md:h-[400px] sm:h-[320px] h-[280px] w-full">
                <div className="container pt-10 flex justify-end h-full w-full">
                    <div className="slider-main lg:pl-5 h-full w-full">
                        <div className="h-full relative rounded-2xl overflow-hidden">
                            <Swiper
                                spaceBetween={0}
                                slidesPerView={1}
                                loop={marketplaceSlides.length > 1}
                                pagination={{
                                    clickable: true,
                                    bulletClass: 'swiper-pagination-bullet-marketplace',
                                    bulletActiveClass: 'swiper-pagination-bullet-active-marketplace'
                                }}
                                modules={[Pagination, Autoplay]}
                                className='marketplace-swiper h-full'
                                autoplay={{
                                    delay: 4000,
                                }}
                            >
                                {marketplaceSlides.map((slide) => (
                                    <SwiperSlide key={slide.id}>
                                        <div className="slider-item h-full w-full flex items-center bg-surface relative">
                                            <div className="text-content md:pl-16 pl-5 basis-1/2 relative z-[1]">
                                                <div className="text-sub-display text-white">{slide.title}</div>
                                                <div className="heading2 text-white md:mt-5 mt-2">{slide.heading}</div>
                                                {slide.product && (
                                                    <div className="product-details text-white md:mt-3 mt-2">
                                                        <p className="text-sm opacity-90">Brand: {slide.product.brand}</p>
                                                        <p className="text-sm opacity-90">Type: {slide.product.type}</p>
                                                        <div className="price-info md:mt-2 mt-1">
                                                            <span className="text-lg font-semibold">${slide.product.discountPrice}</span>
                                                            {slide.product.actualPrice > slide.product.discountPrice && (
                                                                <span className="text-sm line-through opacity-75 ml-2">${slide.product.actualPrice}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                <a href={slide.link}
                                                    className="button-main bg-white text-black hover:bg-green md:mt-8 mt-3 inline-block">Shop Now
                                                </a>
                                            </div>
                                            <div className="sub-img absolute top-0 left-0 w-full h-full">
                                                <Image
                                                    src={slide.image}
                                                    width={5000}
                                                    height={4000}
                                                    alt={slide.heading || 'marketplace'}
                                                    className='w-full h-full object-cover'
                                                    priority={false}
                                                    placeholder="blur"
                                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=" />
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .marketplace-swiper .swiper-pagination {
                    bottom: 20px;
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                }
                
                .marketplace-swiper .swiper-pagination-bullet-marketplace {
                    width: 10px;
                    height: 10px;
                    background: rgba(255, 255, 255, 0.5);
                    border-radius: 50%;
                    opacity: 1;
                    transition: all 0.3s ease;
                }
                
                .marketplace-swiper .swiper-pagination-bullet-active-marketplace {
                    background: #10B981;
                    transform: scale(1.2);
                }
            `}</style>
        </>
    )
}

export default SliderMarketplace