'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import ShopFilterOptions from '@/components/Shop/ShopFilterOptions'
import productData from '@/data/Product.json'

export default function FilterOptions() {
    const searchParams = useSearchParams()
    const type = searchParams.get('type')
    const category = searchParams.get('category')

    return (
        <>
            <ShopFilterOptions data={productData} productPerPage={12} />
        </>
    )
}
