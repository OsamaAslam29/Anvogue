'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store.d';
import { compareActions } from '@/redux/slices/compareSlice';
import { cartActions } from '@/redux/slices/cartSlice';
import { useModalCartContext } from '@/context/ModalCartContext'

const Compare = () => {
    const dispatch = useDispatch();
    const compareArray = useSelector((state: RootState) => state.compare.compareArray);
    const cartArray = useSelector((state: RootState) => state.cart.cartArray);
    const { openModalCart } = useModalCartContext();

    const addToCart = (item) => {
        dispatch(cartActions.addToCart(item));
    };
    
    const updateCart = (itemId, quantity, selectedSize, selectedColor) => {
        dispatch(cartActions.updateCart({ itemId, quantity, selectedSize, selectedColor }));
    };

    const handleAddToCart = (productItem: any) => {
        if (!cartArray.find(item => item._id === productItem._id)) {
            addToCart({ ...productItem });
            updateCart(productItem._id, 1, '', '')
        } else {
            updateCart(productItem._id, 1, '', '')
        }
        openModalCart()
    };

    // Check if compare array is empty
    if (!compareArray || compareArray.length === 0) {
        return (
            <>
                <div id="header" className='relative w-full'>
                    <Breadcrumb heading='Compare Products' subHeading='Compare Products' />
                </div>
                <div className="compare-block md:py-20 py-10">
                    <div className="container">
                        <div className="text-center py-20">
                            <div className="heading3 mb-4">No products to compare</div>
                            <div className="text-secondary mb-6">Please add at least 2 products to compare.</div>
                            <Link href="/" className="button-main">Continue Shopping</Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <div id="header" className='relative w-full'>
                <Breadcrumb heading='Compare Products' subHeading='Compare Products' />
            </div>
            <div className="compare-block md:py-20 py-10">
                <div className="container">
                    <div className="content-main">
                        <div>
                            <div className="list-product flex">
                                <div className="left lg:w-[240px] w-[170px] flex-shrink-0"></div>
                                <div className="right flex w-full border border-line rounded-t-2xl border-b-0">
                                    {compareArray.map(item => (
                                        <div className="product-item px-10 pt-6 pb-5 border-r border-line" key={item._id}>
                                            <div className="bg-img w-full aspect-[3/4] rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={item.images[0]?.Location || '/images/product/1.png'}
                                                    width={1000}
                                                    height={1500}
                                                    alt={item.title}
                                                    className='w-full h-full object-cover'
                                                />
                                            </div>
                                            <div className="text-title text-center mt-4">{item.title}</div>
                                            <div className="caption2 font-semibold text-secondary2 uppercase text-center mt-1">{item.brandId?.name || item.brand}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="compare-table flex">
                                <div className="left lg:w-[240px] w-[170px] flex-shrink-0 border border-line border-r-0 rounded-l-2xl">
                                    {/* <div className="item text-button flex items-center h-[60px] px-8 w-full border-b border-line">Rating</div> */}
                                    <div className="item text-button flex items-center h-[60px] px-8 w-full border-b border-line">Price</div>
                                    <div className="item text-button flex items-center h-[60px] px-8 w-full border-b border-line">Type</div>
                                    <div className="item text-button flex items-center h-[60px] px-8 w-full border-b border-line">Brand</div>
                                    <div className="item text-button flex items-center h-[60px] px-8 w-full border-b border-line">Sizes</div>
                                    <div className="item text-button flex items-center h-[60px] px-8 w-full border-b border-line">Colors</div>
                                    <div className="item text-button flex items-center h-[60px] px-8 w-full border-b border-line">Metarial</div>
                                    <div className="item text-button flex items-center h-[60px] px-8 w-full border-b border-line">Add To Cart</div>
                                </div>
                                <table className="right border-collapse w-full border-t border-r border-line">
                                    <tbody>
                                    {/* <tr className={`flex w-full items-center`}>
                                        {compareState.compareArray.map((item, index) => (
                                            <td className="w-full border border-line h-[60px] border-t-0 border-r-0" key={index}>
                                                <div className='h-full flex items-center justify-center'>
                                                    <Rate currentRate={4.5} size={12} />
                                                    <p className='pl-1'>(1.234)</p>
                                                </div>
                                            </td>
                                        ))}
                                    </tr> */}
                                    <tr className={`flex w-full items-center`}>
                                        {compareArray.map((item, index) => (
                                            <td className="w-full border border-line h-[60px] border-t-0 border-r-0" key={index}>
                                                <div className='h-full flex items-center justify-center'>
                                                    <span className="currency-symbol">৳</span>{item.discountPrice?.toLocaleString()}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className={`flex w-full items-center`}>
                                        {compareArray.map((item, index) => (
                                            <td className="w-full border border-line h-[60px] border-t-0 border-r-0" key={index}>
                                                <div className='h-full flex items-center justify-center capitalize'>
                                                    {item.typeId?.name || item.type || 'N/A'}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className={`flex w-full items-center`}>
                                        {compareArray.map((item, index) => (
                                            <td className="w-full border border-line h-[60px] border-t-0 border-r-0" key={index}>
                                                <div className='h-full flex items-center justify-center capitalize'>
                                                    {item.brandId?.name || item.brand || 'N/A'}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className={`flex w-full items-center`}>
                                        {compareArray.map((item, index) => (
                                            <td className="w-full border border-line h-[60px] border-t-0 border-r-0 size" key={index}>
                                                <div className='h-full flex items-center justify-center capitalize gap-1 flex-wrap px-2'>
                                                    {item.size && item.size.length > 0 ? item.size.map((size: string, i: number) => (
                                                        <p key={i}>{size}{i < item.size.length - 1 ? <span>,</span> : null}</p>
                                                    )) : 'N/A'}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className={`flex w-full items-center`}>
                                        {compareArray.map((item, index) => (
                                            <td className="w-full border border-line h-[60px] border-t-0 border-r-0 size" key={index}>
                                                <div className='h-full flex items-center justify-center gap-2 flex-wrap px-2'>
                                                    {item.colors && item.colors.length > 0 ? item.colors.map((colorName: string, i: number) => (
                                                        <span
                                                            key={i}
                                                            className={`w-6 h-6 rounded-full border border-line`}
                                                            style={{ backgroundColor: colorName.toLowerCase() }}
                                                            title={colorName}
                                                        ></span>
                                                    )) : <span className='text-secondary'>N/A</span>}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className={`flex w-full items-center`}>
                                        {compareArray.map((item, index) => (
                                            <td className="w-full border border-line h-[60px] border-t-0 border-r-0" key={index}>
                                                <div className='h-full flex items-center justify-center capitalize'>
                                                    {item.materialId?.name || 'N/A'}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className={`flex w-full items-center`}>
                                        {compareArray.map((item, index) => (
                                            <td className="w-full border border-line h-[60px] border-t-0 border-r-0" key={index}>
                                                <div className='h-full flex items-center justify-center'>
                                                    <div className='button-main py-1.5 px-5' onClick={() => handleAddToCart(item)}>Add To Cart</div>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Compare