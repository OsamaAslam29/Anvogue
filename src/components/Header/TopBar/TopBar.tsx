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
import logo from "../../../../public/logo.png";
import { useSelector } from "react-redux";

const TopBar = () => {
  const router = useRouter();
  const { categories } = useSelector((state: any) => state.categories);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { handleMenuMobile, openMenuMobile } = useMenuMobile();
  const { openModalCart } = useModalCartContext();
  const { openModalWishlist } = useModalWishlistContext();
  const { openLoginPopup, handleLoginPopup } = useLoginPopup();
  const { cartState } = useCart();

  const handleSearch = (value: string) => {
    router.push(`/search-result?query=${value}`);
    setSearchKeyword("");
    setShowMobileSearch(false);
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/shop/breadcrumb-img?category=${encodeURIComponent(category)}`);
  };

  return (
    <>
      <div
        className={`header-menu-main style-marketplace relative bg-[#263587] w-full md:h-[74px] h-[56px]`}
      >
        <div className="container mx-auto h-full">
          <div className="header-main flex items-center justify-between h-full">
            <div
              className="menu-mobile-icon lg:hidden flex items-center cursor-pointer"
              onClick={handleMenuMobile}
            >
              <Icon.List className="text-white text-2xl" />
            </div>
            <Link href={"/"} className="flex items-center">
              <div className="heading4 text-white">
                <Image
                  src={logo}
                  alt="logo"
                  className="w-[4rem] h-[4rem] rounded-[50%]"
                />
              </div>
            </Link>
            
            {/* Desktop Search */}
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

            {/* Mobile Search Icon */}
            <div className="lg:hidden flex items-center gap-4">
              <div
                className="search-icon cursor-pointer"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
              >
                <Icon.MagnifyingGlass weight="bold" size={24} color="white" />
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
                      Don't have an account?
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

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="lg:hidden bg-[#263587] px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              className="flex-1 h-10 px-3 rounded-lg border border-line"
              placeholder="What are you looking for?"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSearch(searchKeyword)
              }
            />
            <button
              className="button-main bg-red text-white h-10 px-4 rounded-lg"
              onClick={() => handleSearch(searchKeyword)}
            >
              Search
            </button>
            <button
              className="text-white p-2"
              onClick={() => setShowMobileSearch(false)}
            >
              <Icon.X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div id="menu-mobile" className={`${openMenuMobile ? 'open' : ''}`}>
        <div className="menu-container bg-white h-full">
          <div className="container h-full">
            <div className="menu-main h-full overflow-hidden">
              <div className="heading py-2 relative flex items-center justify-center">
                <div
                  className="close-menu-mobile-btn absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface flex items-center justify-center cursor-pointer"
                  onClick={handleMenuMobile}
                >
                  <Icon.X size={14} />
                </div>
                <Link href={'/'} className='logo text-3xl font-semibold text-center'>Anvogue</Link>
              </div>
              
              {/* Mobile Search */}
              <div className="form-search relative mt-2">
                <Icon.MagnifyingGlass size={20} className='absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer' />
                <input 
                  placeholder='What are you looking for?' 
                  className='h-12 rounded-lg border border-line text-sm w-full pl-10 pr-4'
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSearch(searchKeyword)
                  }
                />
              </div>

              {/* Categories */}
              <div className="list-nav mt-6">
                <div className="text-xl font-semibold mb-4">Categories</div>
                <ul>
                  {categories && categories.length > 0 ? (
                    categories.map((category: any, index: number) => (
                      <li key={category._id || index} className="mb-2">
                        <div
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            handleCategoryClick(category.name);
                            handleMenuMobile();
                          }}
                        >
                          {category.image?.Location ? (
                            <img
                              src={category.image.Location}
                              alt={category.name}
                              className="w-8 h-8 rounded object-cover"
                            />
                          ) : (
                            <Icon.DesktopTower className="text-xl text-gray-500" />
                          )}
                          <span className="text-lg">{category.name}</span>
                          <Icon.CaretRight className="ml-auto" />
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-center text-gray-500 py-4">
                      Loading categories...
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        #menu-mobile {
          position: fixed;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9999;
          transition: left 0.3s ease;
        }

        #menu-mobile.open {
          left: 0;
        }

        #menu-mobile .menu-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 80%;
          max-width: 400px;
          height: 100vh;
          background: white;
          overflow-y: auto;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }

        #menu-mobile.open .menu-container {
          transform: translateX(0);
        }

        .login-popup {
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.3s ease;
        }

        .login-popup.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
      `}</style>
    </>
  );
};

export default TopBar;
