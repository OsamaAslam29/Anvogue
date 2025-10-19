"use client";
import React, { useState } from "react";
import Link from "next/link";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import useMenuMobile from "@/store/useMenuMobile";
import { useModalCartContext } from "@/context/ModalCartContext";
import { useModalWishlistContext } from "@/context/ModalWishlistContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import useLoginPopup from "@/store/useLoginPopup";
import Image from "next/image";
import logo from '../../../../public/logo.png'

const TopBar = () => {
  const router = useRouter();

  const [searchKeyword, setSearchKeyword] = useState("");
  const { handleMenuMobile } = useMenuMobile();
  const { openModalCart } = useModalCartContext();
  const { openModalWishlist } = useModalWishlistContext();
  const { openLoginPopup, handleLoginPopup } = useLoginPopup();
  const { cartState } = useCart();

  const handleSearch = (value: string) => {
    router.push(`/search-result?query=${value}`);
    setSearchKeyword("");
  };

  return (
    <div
      className={`header-menu-main style-marketplace relative bg-[#263587] w-full md:h-[74px] h-[56px]`}
    >
      <div className="container mx-auto h-full">
        <div className="header-main flex items-center justify-between h-full">
          <div
            className="menu-mobile-icon lg:hidden flex items-center"
            onClick={handleMenuMobile}
          >
            <Icon.List className="text-white text-2xl" />
          </div>
          <Link href={"/"} className="flex items-center">
            <div className="heading4 text-white">
              <Image
                src={logo}
                alt="logo"
                width={100}
                height={100}
                className="w-30 h-30"
              />
            </div>
          </Link>
          <div className="form-search w-2/3 pl-8 flex items-center h-[44px] max-lg:hidden">
            <div className="w-full flex items-center h-full">
              <input
                className="search-input h-full px-4 w-full border border-line rounded-l"
                placeholder="What are you looking for today?"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSearch(searchKeyword)
                }
              />
              <button
                className="search-button button-main bg-red text-white h-full flex items-center px-7 rounded-none rounded-r"
                onClick={() => {
                  handleSearch(searchKeyword);
                }}
              >
                Search
              </button>
            </div>
          </div>
          <div className="right flex gap-12">
            <div className="list-action flex items-center gap-4">
              <div className="user-icon flex items-center justify-center cursor-pointer">
                <Icon.User
                  weight="bold"
                  size={24}
                  color="white"
                  onClick={handleLoginPopup}
                />
                <div
                  className={`login-popup absolute top-[74px] w-[320px] p-7 rounded-xl bg-white box-shadow-sm 
                                                ${
                                                  openLoginPopup ? "open" : ""
                                                }`}
                >
                  <Link
                    href={"/login"}
                    className="button-main w-full text-center"
                  >
                    Login
                  </Link>
                  <div className="text-secondary text-center mt-3 pb-4">
                    Don’t have an account?
                    <Link
                      href={"/register"}
                      className="text-black pl-1 hover:underline"
                    >
                      Register
                    </Link>
                  </div>
                  <Link
                    href={"/my-account"}
                    className="button-main bg-white text-black border border-black w-full text-center"
                  >
                    Dashboard
                  </Link>
                  <div className="bottom mt-4 pt-4 border-t border-line"></div>
                  <Link href={"#!"} className="body1 hover:underline">
                    Support
                  </Link>
                </div>
              </div>
              <div
                className="wishlist-icon flex items-center cursor-pointer"
                onClick={openModalWishlist}
              >
                <Icon.Heart weight="bold" size={24} color="white" />
              </div>
              <div 
                className="cart-icon flex items-center relative cursor-pointer"
                onClick={openModalCart}
              >
                <Icon.Handbag weight="bold" size={24} color="white" />
                <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 text-xs text-white bg-red w-4 h-4 flex items-center justify-center rounded-full">
                  {cartState.cartArray.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
