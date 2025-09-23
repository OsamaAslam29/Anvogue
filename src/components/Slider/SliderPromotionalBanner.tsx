'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';

const SliderPromotionalBanner = () => {
	const promotionalBanners = [
		{
			id: 1,
			src: "https://storage.googleapis.com/pickaboo-prod/media/wysiwyg/cmsp/EBL_Top_Banner_2.gif",
			alt: "Exclusive Discount on Credit Card"
		},
		{
			id: 2,
			src: "https://storage.googleapis.com/pickaboo-prod/media/wysiwyg/cmsp/EBL_Top_Banner_2.gif",
			alt: "OnePlus Nord Series Promotion"
		},
		{
			id: 3,
			src: "https://storage.googleapis.com/pickaboo-prod/media/wysiwyg/cmsp/EBL_Top_Banner_2.gif",
			alt: "Special Offers and Deals"
		}
	];

	return (
		<>
			<div className="w-full flex justify-center py-1">
				<div className="max-w-5xl w-full relative">
					<Swiper
						spaceBetween={0}
						slidesPerView={1}
						loop={true}
						pagination={{
							clickable: true,
							bulletClass: 'swiper-pagination-bullet-promo',
							bulletActiveClass: 'swiper-pagination-bullet-active-promo'
						}}
						modules={[Pagination, Autoplay]}
						className='promotional-banner-swiper'
						autoplay={{
							delay: 5000,
						}}
					>
						{promotionalBanners.map((banner) => (
							<SwiperSlide key={banner.id}>
								<div className="w-full">
									<img
										src={banner.src}
										alt={banner.alt}
										className="w-full h-auto rounded-lg"
									/>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>

			<style jsx global>{`
                .promotional-banner-swiper .swiper-pagination {
                    bottom: 10px;
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                }
                
                .promotional-banner-swiper .swiper-pagination-bullet-promo {
                    width: 8px;
                    height: 8px;
                    background: rgba(255, 255, 255, 0.5);
                    border-radius: 50%;
                    opacity: 1;
                    transition: all 0.3s ease;
                }
                
                .promotional-banner-swiper .swiper-pagination-bullet-active-promo {
                    background: #3B82F6;
                    transform: scale(1.2);
                }
            `}</style>
		</>
	)
}

export default SliderPromotionalBanner
