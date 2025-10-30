'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import BreadcrumbProduct from '@/components/Breadcrumb/BreadcrumbProduct'
import CountdownTimer from '@/components/Product/Detail/CountdownTimer';
import Footer from '@/components/Footer/Footer'
import productData from '@/data/Product.json'

const ProductCountdownTimer = () => {
    const searchParams = useSearchParams()
    let productId = searchParams.get('id')

    if (productId === null) {
        productId = '1'
    }

    return (
        <>
            <div id="header" className='relative w-full'>
                <BreadcrumbProduct data={productData} productPage='countdown-timer' productId={productId} />
            </div>
            <CountdownTimer data={productData} productId={productId} />
            <Footer />
        </>
    )
}

export default ProductCountdownTimer