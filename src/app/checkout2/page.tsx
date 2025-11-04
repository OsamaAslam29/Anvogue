'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useCart } from '@/context/CartContext'
import { useModalCartContext } from '@/context/ModalCartContext'

const Checkout = () => {
    const { openModalCart } = useModalCartContext()
    const { cartState } = useCart();
    let [totalCart, setTotalCart] = useState<number>(0)

    cartState.cartArray.map(item => totalCart += item.discountPrice * item.quantity)

    return (
        <>
            <div id="header" className='relative w-full'>
                <div className={`header-menu style-one fixed top-0 left-0 right-0 w-full md:h-[74px] h-[56px]`}>
                    <div className="container mx-auto h-full">
                        <div className="header-main flex items-center justify-between h-full">
                            <Link href={'/'} className='flex items-center'>
                                <div className="heading4">Anvogue</div>
                            </Link>
                            <button className="max-md:hidden cart-icon flex items-center relative h-fit cursor-pointer" onClick={openModalCart}>
                                <Icon.Handbag size={24} color='black' />
                                <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 text-xs text-white bg-black w-4 h-4 flex items-center justify-center rounded-full">{cartState.cartArray.length}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="checkout-block relative md:pt-[74px] pt-[56px]">
                <div className="content-main flex max-lg:flex-col-reverse justify-between gap-4 lg:gap-6">
                    <div className="left flex lg:justify-end w-full">
                        <div className="lg:max-w-[716px] flex-shrink-0 w-full lg:pt-20 pt-12 lg:pr-[70px] px-4 sm:px-6 lg:pl-[16px] max-lg:pr-4">
                            <form>
                                <div className="login flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-4">
                                    <h4 className="heading4 text-base sm:text-lg">Contact</h4>
                                    <Link href={"/login"} className="text-button underline text-sm sm:text-base">Login here</Link>
                                </div>
                                <div>
                                    <input type="text" className="border-line mt-5 px-4 py-3 w-full rounded-lg" placeholder="Email or mobile phone number" required />
                                    <div className="flex items-center mt-5">
                                        <div className="block-input">
                                            <input type="checkbox" name="remember" id="remember" />
                                            <Icon.CheckSquare weight='fill' className="icon-checkbox text-2xl" />
                                        </div>
                                        <label htmlFor="remember" className="pl-2 cursor-pointer">Email me with news and offers</label>
                                    </div>
                                </div>
                                <div className="information md:mt-10 mt-6">
                                    <div className="heading5 text-base sm:text-lg">Delivery</div>
                                    <div className="deli_type mt-5">
                                        <div className="item flex items-center gap-2 relative px-4 sm:px-5 border border-line rounded-t-lg">
                                            <input type="radio" name="deli_type" id="ship_type" className="cursor-pointer" defaultChecked />
                                            <label htmlFor="ship_type" className="w-full py-3 sm:py-4 cursor-pointer text-sm sm:text-base">Ship</label>
                                            <Icon.Truck className="text-lg sm:text-xl absolute top-1/2 right-3 sm:right-5 -translate-y-1/2 flex-shrink-0" />
                                        </div>
                                        <div className="item flex items-center gap-2 relative px-4 sm:px-5 border border-line rounded-b-lg">
                                            <input type="radio" name="deli_type" id="store_type" className="cursor-pointer" />
                                            <label htmlFor="store_type" className="w-full py-3 sm:py-4 cursor-pointer text-sm sm:text-base">Pickup in store</label>
                                            <Icon.Storefront className="text-lg sm:text-xl absolute top-1/2 right-3 sm:right-5 -translate-y-1/2 flex-shrink-0" />
                                        </div>
                                    </div>
                                    <div className="form-checkout mt-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 gap-y-5">
                                            <div className="col-span-full select-block">
                                                <select className="border border-line px-4 py-3 w-full rounded-lg" id="region" name="region">
                                                    <option value="default">Choose Country/Region</option>
                                                    <option value="United State">United State</option>
                                                    <option value="France">France</option>
                                                    <option value="Singapore">Singapore</option>
                                                </select>
                                                <Icon.CaretDown className="arrow-down" />
                                            </div>
                                            <div className="sm:col-span-1">
                                                <input className="border-line px-4 py-3 w-full rounded-lg" id="firstName" type="text" placeholder="First Name (optional)" required />
                                            </div>
                                            <div className="sm:col-span-1">
                                                <input className="border-line px-4 py-3 w-full rounded-lg" id="lastName" type="text" placeholder="Last Name" required />
                                            </div>
                                            <div className="col-span-full relative">
                                                <input className="border-line pl-4 pr-12 py-3 w-full rounded-lg" id="address" type="text" placeholder="Address" required />
                                                <Icon.MagnifyingGlass className="text-xl absolute top-1/2 -translate-y-1/2 right-5" />
                                            </div>
                                            <div className="sm:col-span-1">
                                                <input className="border-line px-4 py-3 w-full rounded-lg" id="apartment" type="text" placeholder="Apartment, suite,etc.(optional)" required />
                                            </div>
                                            <div className="sm:col-span-1">
                                                <input className="border-line px-4 py-3 w-full rounded-lg" id="city" type="text" placeholder="City" required />
                                            </div>
                                            <div className="sm:col-span-1 select-block">
                                                <select className="border border-line px-4 py-3 w-full rounded-lg" id="state" name="state">
                                                    <option value="default">State</option>
                                                    <option value="Nevada">Nevada</option>
                                                    <option value="California">California</option>
                                                    <option value="Los Angeles">Los Angeles</option>
                                                </select>
                                                <Icon.CaretDown className="arrow-down" />
                                            </div>
                                            <div className="sm:col-span-1">
                                                <input className="border-line px-4 py-3 w-full rounded-lg" id="zipcode" type="text" placeholder="Zip Code" required />
                                            </div>
                                        </div>
                                        <h4 className="heading4 md:mt-10 mt-6 text-base sm:text-lg">Shipping method</h4>
                                        <div className="body1 text-secondary2 py-4 sm:py-6 px-4 sm:px-5 border border-line rounded-lg bg-surface mt-5 text-xs sm:text-sm">Enter your shipping address to view available shipping methods</div>
                                        <div className="payment-block md:mt-10 mt-6">
                                            <h4 className="heading4 text-base sm:text-lg">Payment</h4>
                                            <p className="body1 text-secondary2 mt-3 text-xs sm:text-sm">All transactions are secure and encrypted.</p>
                                            <div className="list-payment mt-5">
                                                <div className="item">
                                                    <div className="type flex items-center justify-between bg-linear p-4 sm:p-5 border border-black rounded-t-lg">
                                                        <strong className="text-title text-sm sm:text-base">Credit Card</strong>
                                                        <Icon.CreditCard className="text-xl sm:text-2xl flex-shrink-0" />
                                                    </div>
                                                    <div className="form_payment grid grid-cols-1 sm:grid-cols-2 gap-4 gap-y-5 p-4 sm:p-5 rounded-b-lg bg-surface">
                                                        <div className="col-span-full relative">
                                                            <input className="border-line pl-4 pr-12 py-3 w-full rounded-lg" id="cardNumbers" type="text" placeholder="Card Numbers" required />
                                                            <Icon.LockSimple className="text-xl text-secondary absolute top-1/2 -translate-y-1/2 right-5" />
                                                        </div>
                                                        <div className="sm:col-span-1 relative">
                                                            <input className="border-line px-4 py-3 w-full rounded-lg" id="expirationDate" type="text" placeholder="Expiration date (MM /YY)" required />
                                                        </div>
                                                        <div className="sm:col-span-1 relative">
                                                            <input className="border-line pl-4 pr-12 py-3 w-full rounded-lg" id="securityCode" type="text" placeholder="Security code" required />
                                                            <Icon.Question className="text-xl text-secondary absolute top-1/2 -translate-y-1/2 right-5" />
                                                        </div>
                                                        <div className="col-span-full relative">
                                                            <input className="border-line px-4 py-3 w-full rounded-lg" id="cardName" type="text" placeholder="Name On Card" required />
                                                        </div>
                                                        <div className="col-span-full flex items-center">
                                                            <div className="block-input">
                                                                <input type="checkbox" name="useAddress" id="useAddress" />
                                                                <Icon.CheckSquare weight='fill' className="icon-checkbox text-2xl" />
                                                            </div>
                                                            <label htmlFor="useAddress" className="text-title pl-2 cursor-pointer">Use shipping address as billing address</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="block-button md:mt-10 mt-6">
                                            <button className="button-main w-full tracking-widest">Paynow</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className="copyright caption1 md:mt-20 mt-12 py-3 border-t border-line text-xs sm:text-sm text-center sm:text-left">©2024 Anvogue. All Rights Reserved.</div>
                        </div>
                    </div>
                    <div className="right justify-start flex-shrink-0 lg:w-[47%] bg-surface lg:py-20 py-12">
                        <div className="lg:sticky lg:top-24 h-fit lg:max-w-[606px] w-full flex-shrink-0 lg:pl-[80px] px-4 sm:px-6 lg:pr-[16px] max-lg:px-4">
                            <div className="list_prd flex flex-col gap-5 sm:gap-7">
                                <div className="item flex items-center justify-between gap-3 sm:gap-6">
                                    <div className="flex items-center gap-3 sm:gap-6 min-w-0 flex-1">
                                        <div className="bg_img relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px]">
                                            <img src="/images/product/1000x1000.png" alt="product/1000x1000" className="w-full h-full object-cover rounded-lg" />
                                            <span className="quantity flex items-center justify-center absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black text-white text-xs sm:text-sm">1</span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <strong className="name text-title text-sm sm:text-base block truncate">Contrasting sheepskin sweatshirt</strong>
                                            <div className="flex items-center gap-2 mt-1 sm:mt-2">
                                                <Icon.Tag className="text-secondary flex-shrink-0" />
                                                <span className="code text-secondary text-xs sm:text-sm truncate">AN6810 <span className="discount">(-$14.20)</span></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 flex-shrink-0">
                                        <del className="caption1 text-secondary text-end org_price text-xs sm:text-sm">$99.00</del>
                                        <strong className="text-title price text-sm sm:text-base">$60.00</strong>
                                    </div>
                                </div>
                                <div className="item flex items-center justify-between gap-3 sm:gap-6">
                                    <div className="flex items-center gap-3 sm:gap-6 min-w-0 flex-1">
                                        <div className="bg_img relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px]">
                                            <img src="/images/product/1000x1000.png" alt="product/1000x1000" className="w-full h-full object-cover rounded-lg" />
                                            <span className="quantity flex items-center justify-center absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black text-white text-xs sm:text-sm">1</span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <strong className="name text-title text-sm sm:text-base block truncate">Contrasting sheepskin sweatshirt</strong>
                                            <div className="flex items-center gap-2 mt-1 sm:mt-2">
                                                <Icon.Tag className="text-secondary flex-shrink-0" />
                                                <span className="code text-secondary text-xs sm:text-sm truncate">AN6810 <span className="discount">(-$14.20)</span></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 flex-shrink-0">
                                        <del className="caption1 text-secondary text-end org_price text-xs sm:text-sm">$99.00</del>
                                        <strong className="text-title price text-sm sm:text-base">$60.00</strong>
                                    </div>
                                </div>
                            </div>
                            <form className="form_discount flex flex-col sm:flex-row gap-3 mt-8">
                                <input type="text" placeholder="Discount code" className="w-full border border-line rounded-lg px-4 py-3" required />
                                <button className="flex-shrink-0 button-main bg-black whitespace-nowrap px-6">applied</button>
                            </form>
                            <div className="subtotal flex items-center justify-between mt-6 sm:mt-8">
                                <strong className="heading6 text-sm sm:text-base">Subtotal</strong>
                                <strong className="heading6 text-sm sm:text-base">$86,99</strong>
                            </div>
                            <div className="ship-block flex items-center justify-between mt-4">
                                <strong className="heading6 text-sm sm:text-base">Shipping</strong>
                                <span className="body1 text-secondary text-xs sm:text-sm">Enter shipping address</span>
                            </div>
                            <div className="total-cart-block flex items-center justify-between mt-4">
                                <strong className="heading4 text-base sm:text-lg">Total</strong>
                                <div className="flex items-end gap-2">
                                    <span className="body1 text-secondary text-xs sm:text-sm">USD</span>
                                    <strong className="heading4 text-base sm:text-lg">$186,99</strong>
                                </div>
                            </div>
                            <div className="total-saving-block flex items-center gap-2 mt-4">
                                <Icon.Tag weight='bold' className="text-lg sm:text-xl flex-shrink-0" />
                                <strong className="heading5 text-sm sm:text-base">TOTAL SAVINGS</strong>
                                <strong className="heading5 text-sm sm:text-base">$14.85</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Checkout