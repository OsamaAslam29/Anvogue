'use client'

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, useSearchParams } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import ShopBreadCrumbImg from '@/components/Shop/ShopBreadCrumbImg';

export default function BreadcrumbImg() {
    const dispatch = useDispatch()
    const { products } = useSelector((state: any) => state.products)
    const { categories } = useSelector((state: any) => state.categories)
    const searchParams = useSearchParams()
    const type = searchParams.get('type')
    const category = searchParams.get('category')

    const decodedCategory = category ? decodeURIComponent(category) : null
    const categoryData = categories.find((cat: any) => cat.name === decodedCategory)


    return (
        <>
            {/* <div id="header" className='relative w-full'>
            </div> */}
            <ShopBreadCrumbImg data={products} productPerPage={12} dataType={decodedCategory} categoryImage={categoryData?.image?.Location} />
        </>
    )
}
