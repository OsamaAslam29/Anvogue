'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import ShopBreadCrumb2 from '@/components/Shop/ShopBreadCrumb2'
import productData from '@/data/Product.json'

export default function BreadCrumb2() {
    const searchParams = useSearchParams()
    const type = searchParams.get('type')
    const category = searchParams.get('category')

    return (
        <>
            <div id="header" className='relative w-full'>
            </div>
            <ShopBreadCrumb2 data={productData} productPerPage={9} dataType={type} />
        </>
    )
}
