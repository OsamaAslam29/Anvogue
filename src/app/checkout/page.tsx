"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Footer from "@/components/Footer/Footer";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store.d";
import { useSearchParams } from "next/navigation";
import OrderService from "@/services/order.service";
import { cartActions } from "@/redux/slices/cartSlice";

const Checkout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  let discount = searchParams.get("discount");
  let ship = searchParams.get("ship");

  const cartArray = useSelector((state: RootState) => state.cart.cartArray);
  const [activePayment] = useState<string>("cash-delivery"); // COD is default

  // Form state for shipping address
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    country: "",
    city: "",
    address: "",
    postalCode: "",
    note: "",
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate total cart
  const totalCart = cartArray.reduce((total, item) => {
    return total + item.discountPrice * item.quantity;
  }, 0);

  // Calculate subtotal
  const subtotal = totalCart - Number(discount || 0);

  // Calculate tax (10% of subtotal, or you can adjust this)
  const tax = Math.round(subtotal * 0.0 * 100) / 100;

  // Calculate total price
  const totalPrice = subtotal + tax + Number(ship || 0);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null); // Clear error on input change
  };

  // Handle place order
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.country ||
      !formData.city ||
      !formData.address ||
      !formData.postalCode
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Build products array from cart
    const products = cartArray.map((item) => ({
      productId: item._id || item.id,
      price: item.discountPrice,
      quantity: item.quantity,
      totalPrice: item.discountPrice * item.quantity,
      selectedColor: item.selectedColor || (item.colors && item.colors.length > 0 ? item.colors[0] : null),
      selectedSize: item.selectedSize || (item.size && item.size.length > 0 ? item.size[0] : null),
    }));

    // Build order payload
    const orderPayload = {
      products,
      subtotal,
      discount: Number(discount || 0),
      tax,
      totalPrice,
      shippingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      },
    };

    try {
      const [result, error] = await OrderService.create(orderPayload);

      if (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to place order. Please try again.";
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      if (result) {
        // Clear cart on success
        dispatch(cartActions.clearCart());
        
        // Redirect to order success page or my account
        router.push("/my-account");
      } else {
        setError("Failed to place order. Please try again.");
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setIsLoading(false);
    }
  };

  // Check if cart is empty
  if (!cartArray || cartArray.length === 0) {
    return (
      <>
        <div id="header" className="relative w-full">
          <Breadcrumb heading="Shopping cart" subHeading="Shopping cart" />
        </div>
        <div className="cart-block md:py-20 py-10">
          <div className="container">
            <div className="text-center py-20">
              <div className="heading3 mb-4">Your cart is empty</div>
              <div className="text-secondary mb-6">
                Please add products to your cart before checkout.
              </div>
              <Link href="/" className="button-main">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div id="header" className="relative w-full">
        <Breadcrumb heading="Shopping cart" subHeading="Shopping cart" />
      </div>
      <div className="cart-block md:py-20 py-10">
        <div className="container">
          <div className="content-main flex flex-col lg:flex-row lg:justify-between gap-8 lg:gap-6">
            <div className="left w-full lg:w-1/2">
              <div className="login bg-surface py-3 px-4 flex justify-between rounded-lg">
                {/* <div className="left flex items-center">
                  <span className="text-on-surface-variant1 pr-4">
                    Already have an account?{" "}
                  </span>
                  <span className="text-button text-on-surface hover-underline cursor-pointer">
                    Login
                  </span>
                </div> */}
                <div className="right">
                  <i className="ph ph-caret-down fs-20 d-block cursor-pointer"></i>
                </div>
              </div>
              {/* <div className="form-login-block mt-3">
                <form className="p-5 border border-line rounded-lg">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="email ">
                      <input
                        className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                        id="username"
                        type="email"
                        placeholder="Username or email"
                        required
                      />
                    </div>
                    <div className="pass ">
                      <input
                        className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                        id="password"
                        type="password"
                        placeholder="Password"
                        required
                      />
                    </div>
                  </div>
                  <div className="block-button mt-3">
                    <button className="button-main button-blue-hover">
                      Login
                    </button>
                  </div>
                </form>
              </div> */}
              <div className="information mt-5">
                <div className="heading5 text-base sm:text-lg">Information</div>
                <div className="form-checkout mt-5">
                  <form onSubmit={handlePlaceOrder}>
                    {error && (
                      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                        {error}
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 gap-y-5">
                      <div className="">
                        <input
                          className="border-line px-4 py-3 w-full rounded-lg"
                          id="firstName"
                          name="firstName"
                          type="text"
                          placeholder="First Name *"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="">
                        <input
                          className="border-line px-4 py-3 w-full rounded-lg"
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="Last Name *"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          className="border-line px-4 py-3 w-full rounded-lg"
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Email Address *"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          className="border-line px-4 py-3 w-full rounded-lg"
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          placeholder="Phone Numbers *"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-span-full select-block">
                        <select
                          className="border border-line px-4 py-3 w-full rounded-lg"
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Choose Country/Region *</option>
                          <option value="Bangladash">Bangladash</option>
                        </select>
                        <Icon.CaretDown className="arrow-down" />
                      </div>
                      <div className="">
                        <input
                          className="border-line px-4 py-3 w-full rounded-lg"
                          id="city"
                          name="city"
                          type="text"
                          placeholder="Town/City *"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="">
                        <input
                          className="border-line px-4 py-3 w-full rounded-lg"
                          id="address"
                          name="address"
                          type="text"
                          placeholder="Street Address *"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          className="border-line px-4 py-3 w-full rounded-lg"
                          id="postalCode"
                          name="postalCode"
                          type="text"
                          placeholder="Postal Code *"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-span-full">
                        <textarea
                          className="border border-line px-4 py-3 w-full rounded-lg"
                          id="note"
                          name="note"
                          placeholder="Write note (optional)..."
                          value={formData.note}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                    <div className="payment-block md:mt-10 mt-6">
                      <div className="heading5 text-base sm:text-lg">Payment Method</div>
                      <div className="list-payment mt-5">
                        <div className="type bg-surface p-4 sm:p-5 border border-line rounded-lg open">
                          <div className="flex items-center">
                            <input
                              className="cursor-pointer"
                              type="radio"
                              id="delivery"
                              name="payment"
                              checked={true}
                              readOnly
                            />
                            <label
                              className="text-button pl-2 cursor-pointer text-sm sm:text-base"
                              htmlFor="delivery"
                            >
                              Cash on Delivery (COD)
                            </label>
                          </div>
                          <div className="infor">
                            <div className="text-on-surface-variant1 pt-3 sm:pt-4 text-xs sm:text-sm">
                              Pay with cash when your order is delivered. Your order will be processed and shipped after confirmation.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="block-button md:mt-10 mt-6">
                      <button
                        type="submit"
                        className="button-main w-full uppercase"
                        disabled={isLoading}
                        style={{
                          backgroundColor: 'var(--black)',
                          color: 'var(--white)',
                          border: 'none',
                          width: '100%',
                          display: 'block',
                          opacity: isLoading ? 0.7 : 1,
                          cursor: isLoading ? 'not-allowed' : 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          if (!isLoading) {
                            e.currentTarget.style.backgroundColor = 'var(--green)';
                            e.currentTarget.style.color = 'var(--black)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isLoading) {
                            e.currentTarget.style.backgroundColor = 'var(--black)';
                            e.currentTarget.style.color = 'var(--white)';
                          }
                        }}
                      >
                        {isLoading ? "Placing Order..." : "Place Order"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="right w-full lg:w-5/12 lg:sticky lg:top-24 h-fit">
              <div className="checkout-block">
                <div className="heading5 pb-3">Your Order</div>
                <div className="list-product-checkout">
                  {cartArray.map((product) => (
                    <div
                      key={product._id}
                      className="item flex items-center justify-between w-full pb-5 border-b border-line gap-3 sm:gap-6 mt-5"
                    >
                      <div className="bg-img w-16 sm:w-20 md:w-[100px] aspect-square flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={
                            product.images[0]?.Location ||
                            "/images/product/1.png"
                          }
                          width={500}
                          height={500}
                          alt={product.title || "product"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-between w-full min-w-0">
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="name text-title text-sm sm:text-base truncate">{product.title}</div>
                          <div className="caption1 text-secondary mt-2">
                            <span className="size capitalize">
                              {product.selectedSize ||
                                (product.size && product.size.length > 0
                                  ? product.size[0]
                                  : "N/A")}
                            </span>
                            <span>/</span>
                            <span className="color capitalize">
                              {product.selectedColor ||
                                (product.colors && product.colors.length > 0
                                  ? product.colors[0]
                                  : "N/A")}
                            </span>
                          </div>
                        </div>
                        <div className="text-title text-sm sm:text-base whitespace-nowrap flex-shrink-0">
                          <span className="quantity">{product.quantity}</span>
                          <span className="px-1">x</span>
                          <span>
                            <span className="currency-symbol">৳</span>{product.discountPrice?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="subtotal-block py-4 sm:py-5 flex justify-between border-b border-line">
                  <div className="text-title text-sm sm:text-base">Subtotal</div>
                  <div className="text-title text-sm sm:text-base">
                    <span className="currency-symbol">৳</span>{subtotal.toLocaleString()}
                  </div>
                </div>
                <div className="discount-block py-4 sm:py-5 flex justify-between border-b border-line">
                  <div className="text-title text-sm sm:text-base">Discount</div>
                  <div className="text-title text-sm sm:text-base">
                    -<span className="currency-symbol">৳</span><span className="discount">{Number(discount || 0).toLocaleString()}</span>
                  </div>
                </div>
                <div className="tax-block py-4 sm:py-5 flex justify-between border-b border-line">
                  <div className="text-title text-sm sm:text-base">Tax</div>
                  <div className="text-title text-sm sm:text-base">
                    <span className="currency-symbol">৳</span>{tax.toLocaleString()}
                  </div>
                </div>
                <div className="ship-block py-4 sm:py-5 flex justify-between border-b border-line">
                  <div className="text-title text-sm sm:text-base">Shipping</div>
                  <div className="text-title text-sm sm:text-base">
                    {Number(ship) === 0
                      ? "Free"
                      : <><span className="currency-symbol">৳</span>{Number(ship)?.toLocaleString()}</>}
                  </div>
                </div>
                <div className="total-cart-block pt-4 sm:pt-5 flex justify-between">
                  <div className="heading5 text-base sm:text-lg">Total</div>
                  <div className="heading5 total-cart text-base sm:text-lg">
                    <span className="currency-symbol">৳</span>{totalPrice.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
