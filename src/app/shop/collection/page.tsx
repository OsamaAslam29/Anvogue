'use client'

import React, { useState } from 'react'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import productData from '@/data/Product.json'
import ShopCollection from '@/components/Shop/ShopCollection'

export default function Collection() {

    return (
        <>
            <div id="header" className='relative w-full'>
                <Breadcrumb heading='Shop Collection' subHeading='Collection' />
            </div>
            <ShopCollection data={productData} />
        </>
    )
}
