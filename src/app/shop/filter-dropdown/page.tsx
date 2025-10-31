'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import ShopFilterDropdown from '@/components/Shop/ShopFilterDropdown'
import productData from '@/data/Product.json'

export default function FilterDropdown() {
    const searchParams = useSearchParams()
    const type = searchParams.get('type')
    const category = searchParams.get('category')

    return (
        <>
            <ShopFilterDropdown data={productData} productPerPage={12} dataType={type} />
        </>
    )
}
