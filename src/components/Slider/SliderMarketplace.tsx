'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';


interface SlideData {
    id: string;
    title: string;
    heading: string;
    image: string;
    link: string;
    category?: any;
}

const SliderMarketplace = () => {
    const { categories, isLoading, error: errorCategories } = useSelector((state: any) => state.categories)
    const [featuredCategories, setFeaturedCategories] = useState<SlideData[]>([])
    const [swiperKey, setSwiperKey] = useState(0)

    useEffect(() => {
        if (categories && categories.length > 0) {
            const slides: SlideData[] = categories.slice(0, 6).map((category: any, index: number) => {
                let title = "CATEGORY";
                if (index < 2) title = "FEATURED";
                else if (index < 4) title = "POPULAR";
                else title = "TRENDING";

                return {
                    id: `category-${category._id}`,
                    title: title,
                    heading: category.name,
                    image: category.image?.Location || '/images/slider/marketplace.png',
                    link: `/shop?category=${category._id}`,
                    category: category
                };
            });

            setFeaturedCategories(slides)
            setSwiperKey(prev => prev + 1)
        }
    }, []);

    const fallbackSlides: SlideData[] = [
        {
            id: "1",
            title: "FEATURED",
            heading: "Explore Categories",
            image: '/images/slider/marketplace.png',
            link: '/'
        },
        {
            id: "2",
            title: "POPULAR",
            heading: "Shop by Category",
            image: '/images/slider/marketplace.png',
            link: '/'
        },
        {
            id: "3",
            title: "TRENDING",
            heading: "Browse Collections",
            image: '/images/slider/marketplace.png',
            link: '/'
        }
    ];

    const marketplaceSlides = featuredCategories.length > 0 ? featuredCategories : fallbackSlides;

    if (isLoading) {
        return (
            <div className="slider-block style-marketplace lg:h-[500px] md:h-[400px] sm:h-[320px] h-[280px] w-full">
                <div className="container pt-10 flex justify-center items-center h-full w-full">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading categories...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (errorCategories) {
        return (
            <div className="slider-block style-marketplace lg:h-[500px] md:h-[400px] sm:h-[320px] h-[280px] w-full">
                <div className="container pt-10 flex justify-center items-center h-full w-full">
                    <div className="text-center">
                        <p className="text-red-600">Error loading categories: {errorCategories}</p>
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
                                key={`marketplace-swiper-${swiperKey}`}
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
                                                {/* <div className="text-sub-display text-white">{slide.title}</div> */}
                                                {/* <div className="heading2 text-white md:mt-5 mt-2">{slide.heading}</div> */}
                                                {/* {slide.category && (
                                                    <div className="category-details text-white md:mt-3 mt-2">
                                                        <p className="text-sm opacity-90">Category: {slide.category.name}</p>
                                                        <p className="text-sm opacity-90">Explore our collection</p>
                                                    </div>
                                                )} */}
                                                {/* <a href={slide.link}
                                                    className="button-main bg-white text-black hover:bg-green md:mt-8 mt-3 inline-block">Shop Now
                                                </a> */}
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