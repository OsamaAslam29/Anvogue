"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import SubscriptionService from "@/services/subscription";

const Footer = () => {
  const navigate = useRouter();
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required.";
    }

    await SubscriptionService.add({ email: formData.email }, navigate);
  };

  return (
    <>
      <div id="footer" className="footer">
        <div className="footer-main bg-surface">
          <div className="container">
            <div className="content-footer py-[60px] flex justify-between flex-wrap gap-y-8">
              <div className="company-info basis-1/4 max-lg:basis-full pr-7">
                <Link href={"/"} className="logo">
                  <div className="heading4 ">Anvogue</div>
                </Link>
                <div className="mt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <Icon.Envelope size={14} color="#1F1F1F" />
                    </div>
                    <span className="">mtayyabmalik99@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <Icon.Phone size={14} color="#1F1F1F" />
                    </div>
                    <span className="">+923407119300</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <Icon.MapPin size={14} color="#1F1F1F" />
                    </div>
                    <span className="">Madina Town Kasur, Pakistan</span>
                  </div>
                </div>
                <div className="list-social flex items-center gap-4 mt-4">
                  <Link href={"https://www.facebook.com/"} target="_blank">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <Icon.FacebookLogo size={16} color="#000000" />
                    </div>
                  </Link>
                  <Link href={"https://www.instagram.com/"} target="_blank">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <Icon.InstagramLogo size={16} color="#000000" />
                    </div>
                  </Link>
                  <Link href={"https://www.linkedin.com/"} target="_blank">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <Icon.LinkedinLogo size={16} color="#000000" />
                    </div>
                  </Link>
                  <Link href={"https://www.twitter.com/"} target="_blank">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <Icon.TwitterLogo size={16} color="#000000" />
                    </div>
                  </Link>
                  <Link href={"https://www.youtube.com/"} target="_blank">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <Icon.YoutubeLogo size={16} color="#000000" />
                    </div>
                  </Link>
                </div>
              </div>

              <div className="right-content flex flex-wrap gap-y-8 basis-[69%] max-lg:basis-full">
                <div className="list-nav flex  basis-2/3 max-md:basis-full gap-4">
                  <div className="item flex flex-col basis-1/2 ">
                    <div className="text-button-uppercase pb-3 ">About</div>
                    <Link
                      className="caption1 has-line-before duration-300 w-fit  hover:text-gray-300"
                      href={"/about-us"}
                    >
                      About Us
                    </Link>
                    {/* <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'#!'}>Career</Link> */}
                    <Link
                      className="caption1 has-line-before duration-300 w-fit pt-2  hover:text-gray-300"
                      href={"/privacy-policy"}
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      className="caption1 has-line-before duration-300 w-fit pt-2  hover:text-gray-300"
                      href={"/cookie-policy"}
                    >
                      Cookie Policy
                    </Link>
                    <Link
                      className="caption1 has-line-before duration-300 w-fit pt-2  hover:text-gray-300"
                      href={"/terms-and-conditions"}
                    >
                      Terms and Conditions
                    </Link>
                    <Link
                      className="caption1 has-line-before duration-300 w-fit  hover:text-gray-300"
                      href={"/why-shop-with-us"}
                    >
                      Why Shop With Us
                    </Link>
                  </div>
                  <div className="item flex flex-col basis-1/2 ">
                    <div className="text-button-uppercase pb-3 ">
                      Help
                    </div>
                    <Link
                      className="caption1 has-line-before duration-300 w-fit  hover:text-gray-300"
                      href={"/payment"}
                    >
                      Payment
                    </Link>
                    <Link
                      className="caption1 has-line-before duration-300 w-fit pt-2  hover:text-gray-300"
                      href={"/shipping"}
                    >
                      Shipping
                    </Link>
                    <Link
                      className="caption1 has-line-before duration-300 w-fit pt-2  hover:text-gray-300"
                      href={"/Return-and-Replacement"}
                    >
                      Return and Replacement
                    </Link>
                    <Link
                      className="caption1 has-line-before duration-300 w-fit pt-2  hover:text-gray-300"
                      href={"/chat-with-us"}
                    >
                      Chat with Us
                    </Link>
                    <Link
                      className="caption1 has-line-before duration-300 w-fit pt-2  hover:text-gray-300"
                      href={"/support"}
                    >
                      Support
                    </Link>
                  </div>
                </div>
                <div className="newsletter basis-1/3 pl-7 max-md:basis-full max-md:pl-0">
                  <div className="text-button-uppercase ">Newletter</div>
                  <div className="caption1 mt-3 ">
                    Sign up for our newsletter and get 10% off your first
                    purchase
                  </div>
                  <div className="input-block w-full h-[52px] mt-4">
                    <form
                      onSubmit={handleSubmit}
                      className="w-full h-full relative"
                      action="post"
                    >
                      <input
                        type="email"
                        placeholder="Enter your e-mail"
                        className="caption1 w-full h-full pl-4 pr-14 rounded-xl border border-line"
                        onChange={handleChange}
                        name="email"
                        value={formData.email}
                        required
                      />
                      <button className="w-[44px] h-[44px] bg-black flex items-center justify-center rounded-xl absolute top-1 right-1">
                        <Icon.ArrowRight size={24} color="#fff" />
                      </button>
                    </form>
                  </div>

                </div>
              </div>
            </div>
            <div className="footer-bottom py-3 flex items-center justify-between gap-5 max-lg:justify-center max-lg:flex-col border-t border-line">
              <div className="left flex items-center gap-8">
                <div className="copyright caption1 text-secondary">
                  ©2025 Anvogue. All Rights Reserved.
                </div>
                <div className="select-block flex items-center gap-5 max-md:hidden">
                  {/* <div className="choose-language flex items-center gap-1.5">
                    <select
                      name="language"
                      id="chooseLanguageFooter"
                      className="caption2 bg-transparent"
                    >
                      <option value="English">English</option>
                      <option value="Espana">Espana</option>
                                            <option value="France">France</option>
                </select>
                <Icon.CaretDown size={12} color="#1F1F1F" />
              </div> */}
                  {/* <div className="choose-currency flex items-center gap-1.5">
                    <select
                      name="currency"
                      id="chooseCurrencyFooter"
                      className="caption2 bg-transparent"
                    >
                      <option value="USD">Pkr</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                    <Icon.CaretDown size={12} color="#1F1F1F" />
                  </div> */}
                </div>
              </div>
              <div className="right flex items-center gap-2">
                <div className="caption1 text-secondary">Payment Methods:</div>
                <div className="payment-img">
                  <Image
                    src={"https://www.pickaboo.com/_next/static/images/payment-one-2e8773dc92684e5198a1dcf36c1aa6cb.svg"}
                    width={500}
                    height={500}
                    alt={"payment"}
                    className="w-9"
                  />
                </div>
                <div className="payment-img">
                  <Image
                    src={"https://www.pickaboo.com/_next/static/images/payment-two-c20a337c77c62894a976fb408a2fa824.svg"}
                    width={500}
                    height={500}
                    alt={"payment"}
                    className="w-9"
                  />
                </div>
                <div className="payment-img">
                  <Image
                    src={"https://www.pickaboo.com/_next/static/images/payment-three-df6fd7212b390a3c3b4d7b8e9277bddf.svg"}
                    width={500}
                    height={500}
                    alt={"payment"}
                    className="w-9"
                  />
                </div>
                <div className="payment-img">
                  <Image
                    src={"https://www.pickaboo.com/_next/static/images/payment-four-53216205610941b83b5017625ce2878e.svg"}
                    width={500}
                    height={500}
                    alt={"payment"}
                    className="w-9"
                  />
                </div>
                <div className="payment-img">
                  <Image
                    src={"https://www.pickaboo.com/_next/static/images/payment-five-a54fb86ef0189aa04ec25bba3b22351c.svg"}
                    width={500}
                    height={500}
                    alt={"payment"}
                    className="w-9"
                  />
                </div>
                <div className="payment-img">
                  <Image
                    src={"https://www.pickaboo.com/_next/static/images/payment-six-1e3800be1f46e9a71f562c1587aa9fba.svg"}
                    width={500}
                    height={500}
                    alt={"payment"}
                    className="w-9"
                  />
                </div>
              </div>
            </div>
          </div>
        </div >
      </div >
    </>
  );
};

export default Footer;
