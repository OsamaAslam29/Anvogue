'use client'
import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import http from '@/services/http.service'
import AuthService from '@/services/auth.service'
import { useRouter } from 'next/navigation'
import OrderService from '@/services/order.service'
import { setOrders, setOrdersLoading, setOrdersError } from '@/redux/slices/ordersSlice'

const stepsConfig = [
    { key: 'createdAt', label: 'Order Placed' },
    { key: 'processingAt', label: 'Processing' },
    { key: 'confirmedAt', label: 'Confirmed' },
    { key: 'paymentAt', label: 'Payment' },
    { key: 'packingAt', label: 'Packing' },
    { key: 'packedAt', label: 'Packed' },
    { key: 'deliveringAt', label: 'Delivering' },
    { key: 'deliveredAt', label: 'Delivered' },
]

const statusToIndex: Record<string, number> = {
    pending: 0,
    processing: 1,
    confirmed: 2,
    payment: 3,
    packing: 4,
    packed: 5,
    delivering: 6,
    delivered: 7,
}

const OrderTimeline: React.FC<{ order: any }> = ({ order }) => {
    const activeIdx = statusToIndex[(order?.orderStatus || 'pending').toLowerCase()] ?? 0
    const fmt = (d?: string) => {
        if (!d) return ''
        try {
            const date = new Date(d)
            const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: '2-digit' })
            const timeStr = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
            return `${dateStr} ${timeStr}`
        } catch {
            return d
        }
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {stepsConfig.map((s, i) => {
                const isDone = i <= activeIdx
                const date = order?.[s.key]
                return (
                    <div key={s.key} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                            <span className={`rounded-full ${isDone ? 'text-success' : 'text-secondary'}`}>
                                {isDone ? <Icon.CheckCircle size={24} weight="fill" /> : <Icon.Circle size={24} />}
                            </span>
                            {i < stepsConfig.length - 1 && (
                                <span className={`block w-[2px] h-8 ${i < activeIdx ? 'bg-success' : 'bg-line'}`}></span>
                            )}
                        </div>
                        <div>
                            <div className="heading6">{s.label}</div>
                            {date ? (
                                <div className="caption1 text-secondary">{fmt(date)}</div>
                            ) : (
                                <div className="caption1 text-secondary">&nbsp;</div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

const MyAccount = () => {
    const [activeTab, setActiveTab] = useState<string | undefined>('orders')
    const [activeOrders, setActiveOrders] = useState<string | undefined>('all')
    const [openDetail, setOpenDetail] = useState<boolean | undefined>(false)
    const userFromStore = useSelector((state: any) => state?.auth?.user)
    const router = useRouter()
    const dispatch = useDispatch()
    const orders = useSelector((state: any) => state?.orders?.items) as any[]

    const user = useMemo(() => {
        if (userFromStore) return userFromStore
        try {
            const stored = localStorage.getItem('user')
            return stored ? JSON.parse(stored) : null
        } catch {
            return null
        }
    }, [userFromStore])

    useEffect(() => {
        let mounted = true
        ;(async () => {
            dispatch(setOrdersLoading(true))
            const [data, error] = await OrderService.list()
            if (!mounted) return
            if (error) {
                dispatch(setOrdersError(error?.message || 'Failed to load orders'))
                dispatch(setOrders([]))
            } else {
                dispatch(setOrders(data))
            }
            dispatch(setOrdersLoading(false))
        })()
        return () => { mounted = false }
    }, [dispatch])

    const handleActiveOrders = (order: string) => {
        setActiveOrders(order)
    }

    return (
        <>
            <div id="header" className='relative w-full'>
                <Breadcrumb heading='My Account' subHeading='My Account' />
            </div>
            <div className="profile-block md:py-20 py-10">
                <div className="container">
                    <div className="content-main flex gap-y-8 max-md:flex-col w-full">
                        <div className="left md:w-1/3 w-full xl:pr-[3.125rem] lg:pr-[28px] md:pr-[16px]">
                            <div className="user-infor bg-surface lg:px-7 px-4 lg:py-10 py-5 md:rounded-[20px] rounded-xl">
                                <div className="heading flex flex-col items-center justify-center">
                                    {/* <div className="avatar">
                                        <Image
                                            src={'/images/avatar/1.png'}
                                            width={300}
                                            height={300}
                                            alt='avatar'
                                            className='md:w-[140px] w-[120px] md:h-[140px] h-[120px] rounded-full'
                                        />
                                    </div> */}
                                    <div className="name heading6 mt-4 text-center">{user?.firstName ? `${user.firstName} ${user?.lastName || ''}`.trim() : (user?.name || 'Guest')}</div>
                                    <div className="mail heading6 font-normal normal-case text-secondary text-center mt-1">{user?.email || '-'}</div>
                                </div>
                                <div className="menu-tab w-full max-w-none lg:mt-10 mt-6">
                                    <Link href={'#!'} scroll={false} className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5 ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                                        <Icon.Package size={20} />
                                        <strong className="heading6">History Orders</strong>
                                    </Link>
                                    <button onClick={() => AuthService.logout(dispatch as any, router)} className="item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5 text-left">
                                        <Icon.SignOut size={20} />
                                        <strong className="heading6">Logout</strong>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="right md:w-2/3 w-full pl-2.5">
                            {/* Dashboard removed */}
                            <div className={`tab text-content overflow-hidden w-full p-7 border border-line rounded-xl ${activeTab === 'orders' ? 'block' : 'hidden'}`}>
                                <h6 className="heading6">Your Orders</h6>
                                <div className="w-full overflow-x-auto">
                                    <div className="menu-tab grid grid-cols-5 max-lg:w-[500px] border-b border-line mt-3">
                                        {['all', 'pending', 'processing', 'delivering', 'delivered', 'canceled'].map((item, index) => (
                                            <button
                                                key={index}
                                                className={`item relative px-3 py-2.5 text-secondary text-center duration-300 hover:text-black border-b-2 ${activeOrders === item ? 'active border-black' : 'border-transparent'}`}
                                                onClick={() => handleActiveOrders(item)}
                                            >
                                                {/* {activeOrders === item && (
                                                <motion.span layoutId='active-pill' className='absolute inset-0 border-black border-b-2'></motion.span>
                                                )} */}
                                                <span className='relative text-button z-[1]'>
                                                    {item}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="list_order">
                                    {orders
                                        .filter((o) =>
                                            activeOrders === 'all' ? true : (o?.orderStatus || '').toLowerCase() === activeOrders
                                        )
                                        .map((order, idx) => (
                                            <div key={order?._id || idx} className="order_item mt-5 border border-line rounded-lg box-shadow-xs">
                                                <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-line">
                                                    <div className="flex items-center gap-2">
                                                        <strong className="text-title">Order Id:</strong>
                                                        <strong className="order_number text-button">{order?._id}</strong>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <strong className="text-title">Order status:</strong>
                                                        <span className={`tag px-4 py-1.5 rounded-full bg-opacity-10 caption1 font-semibold ${
                                                            order?.orderStatus === 'delivered'
                                                                ? 'bg-success text-success'
                                                                : order?.orderStatus === 'canceled'
                                                                    ? 'bg-red text-red'
                                                                    : order?.orderStatus === 'delivering'
                                                                        ? 'bg-purple text-purple'
                                                                        : 'bg-yellow text-yellow'
                                                        }`}>
                                                            {order?.orderStatus || 'pending'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="list_prd px-5">
                                                    {Array.isArray(order?.products) && order.products.map((p: any) => (
                                                        <div key={p?._id} className="prd_item flex flex-wrap items-center justify-between gap-3 py-5 border-b border-line">
                                                            <div className="flex items-center gap-5">
                                                                <div className="bg-img flex-shrink-0 md:w-[100px] w-20 aspect-square rounded-lg overflow-hidden">
                                                                    <Image
                                                                        src={p?.productId?.images?.[0]?.Location || '/images/product/1000x1000.png'}
                                                                        width={1000}
                                                                        height={1000}
                                                                        alt={p?.productId?.title || 'product'}
                                                                        className='w-full h-full object-cover'
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <div className="prd_name text-title">{p?.productId?.title}</div>
                                                                </div>
                                                            </div>
                                                            <div className='text-title'>
                                                                <span className="prd_quantity">{p?.quantity}</span>
                                                                <span> X </span>
                                                                <span className="prd_price">${p?.price}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="px-5 pb-5">
                                                    <OrderTimeline order={order} />
                                                </div>
                                            </div>
                                        ))}
                                    {!orders?.length && (
                                        <div className="py-10 text-center text-secondary">No orders yet.</div>
                                    )}
                                </div>
                            </div>
                            {/* Address and Setting tabs removed */}
                        </div>
                    </div>
                </div>
            </div>
            <div className={`modal-order-detail-block flex items-center justify-center`} onClick={() => setOpenDetail(false)}>
                <div className={`modal-order-detail-main grid grid-cols-2 w-[1160px] bg-white rounded-2xl ${openDetail ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                    <div className="info p-10 border-r border-line">
                        <h5 className="heading5">Order Details</h5>
                        <div className="list_info grid grid-cols-2 gap-10 gap-y-8 mt-5">
                            <div className="info_item">
                                <strong className="text-button-uppercase text-secondary">Contact Information</strong>
                                <h6 className="heading6 order_name mt-2">Tony nguyen</h6>
                                <h6 className="heading6 order_phone mt-2">(+12) 345 - 678910</h6>
                                <h6 className="heading6 normal-case order_email mt-2">hi.avitex@gmail.com</h6>
                            </div>
                            <div className="info_item">
                                <strong className="text-button-uppercase text-secondary">Payment method</strong>
                                <h6 className="heading6 order_payment mt-2">cash delivery</h6>
                            </div>
                            <div className="info_item">
                                <strong className="text-button-uppercase text-secondary">Shipping address</strong>
                                <h6 className="heading6 order_shipping_address mt-2">2163 Phillips Gap Rd, West Jefferson, North Carolina, US</h6>
                            </div>
                            <div className="info_item">
                                <strong className="text-button-uppercase text-secondary">Billing address</strong>
                                <h6 className="heading6 order_billing_address mt-2">2163 Phillips Gap Rd, West Jefferson, North Carolina, US</h6>
                            </div>
                            <div className="info_item">
                                <strong className="text-button-uppercase text-secondary">Company</strong>
                                <h6 className="heading6 order_company mt-2">Avitex Technology</h6>
                            </div>
                        </div>
                    </div>
                    <div className="list p-10">
                        <h5 className="heading5">Items</h5>
                        <div className="list_prd">
                            <div className="prd_item flex flex-wrap items-center justify-between gap-3 py-5 border-b border-line">
                                <Link href={'/product/default'} className="flex items-center gap-5">
                                    <div className="bg-img flex-shrink-0 md:w-[100px] w-20 aspect-square rounded-lg overflow-hidden">
                                        <Image
                                            src={'/images/product/1000x1000.png'}
                                            width={1000}
                                            height={1000}
                                            alt={'Contrasting sheepskin sweatshirt'}
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                    <div>
                                        <div className="prd_name text-title">Contrasting sheepskin sweatshirt</div>
                                        <div className="caption1 text-secondary mt-2">
                                            <span className="prd_size uppercase">XL</span>
                                            <span>/</span>
                                            <span className="prd_color capitalize">Yellow</span>
                                        </div>
                                    </div>
                                </Link>
                                <div className='text-title'>
                                    <span className="prd_quantity">1</span>
                                    <span> X </span>
                                    <span className="prd_price">$45.00</span>
                                </div>
                            </div>
                            <div className="prd_item flex flex-wrap items-center justify-between gap-3 py-5 border-b border-line">
                                <Link href={'/product/default'} className="flex items-center gap-5">
                                    <div className="bg-img flex-shrink-0 md:w-[100px] w-20 aspect-square rounded-lg overflow-hidden">
                                        <Image
                                            src={'/images/product/1000x1000.png'}
                                            width={1000}
                                            height={1000}
                                            alt={'Contrasting sheepskin sweatshirt'}
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                    <div>
                                        <div className="prd_name text-title">Contrasting sheepskin sweatshirt</div>
                                        <div className="caption1 text-secondary mt-2">
                                            <span className="prd_size uppercase">XL</span>
                                            <span>/</span>
                                            <span className="prd_color capitalize">White</span>
                                        </div>
                                    </div>
                                </Link>
                                <div className='text-title'>
                                    <span className="prd_quantity">2</span>
                                    <span> X </span>
                                    <span className="prd_price">$70.00</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-5">
                            <strong className="text-title">Shipping</strong>
                            <strong className="order_ship text-title">Free</strong>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <strong className="text-title">Discounts</strong>
                            <strong className="order_discounts text-title">-$80.00</strong>
                        </div>
                        <div className="flex items-center justify-between mt-5 pt-5 border-t border-line">
                            <h5 className="heading5">Subtotal</h5>
                            <h5 className="order_total heading5">$105.00</h5>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyAccount