'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation';
import Link from 'next/link'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import BreadcrumbProduct from '@/components/Breadcrumb/BreadcrumbProduct'
import Default from '@/components/Product/Detail/Default';
import Footer from '@/components/Footer/Footer'
import { ProductType } from '@/type/ProductType'
import productData from '@/data/Product.json'
import ProductService from '@/services/product.service';
import { useDispatch, useSelector } from 'react-redux';

const ProductDefault = () => {
    const dispatch = useDispatch()
    const { selectedProduct, isLoading } = useSelector((state: any) => state.products)
    const searchParams = useSearchParams()
    let productId = searchParams.get('id')

    useEffect(() => {
        if (productId) {
            ProductService.getById(productId, dispatch)
        }
    }, [productId])

    if (productId === null) {
        productId = '1'
    }

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    // Show error state if no product found
    if (!selectedProduct) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
                    <p className="text-gray-600">The product you're looking for doesn't exist.</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div id="header" className='relative w-full'>
                <BreadcrumbProduct data={productData} productPage='default' productId={productId} />
            </div>
            <Default product={selectedProduct} productId={productId} />
            {/* <Footer /> */}
        </>
    )
}

export default ProductDefault