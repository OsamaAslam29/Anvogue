"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Footer from "@/components/Footer/Footer";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useRouter, useSearchParams } from "next/navigation";
import AuthService from "@/services/auth.service";

const ResetPassword = () => {
  const searchParams = useSearchParams();

  const navigate = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
  });

  const email = searchParams.get("email");
  console.log("Email from params:", email);
  useEffect(() => {
    if (email) {
      setFormData((prev) => ({ ...prev, email: email }));
    }
    console.log("Email inside useEffect:", email);
    console.log("Email inside useEffect:", formData);
  }, []);

  const [errors, setErrors] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required.";
    }

    if (!formData.code) {
      newErrors.code = "Code is required.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const payload = {
        email: formData.email,
        code: formData.code,
        password: formData.password,
      };
      await AuthService.newPassword(payload, navigate);
    }
  };
  return (
    <>
      <TopNavOne
        props="style-one bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div id="header" className="relative w-full">
        <MenuOne props="bg-transparent" />
        <Breadcrumb
          heading="Reset your password"
          subHeading="Reset your password"
        />
      </div>
      <div className="forgot-pass md:py-20 py-10">
        <div className="container">
          <div className="content-main flex gap-y-8 max-md:flex-col">
            <div className="left md:w-1/2 w-full lg:pr-[60px] md:pr-[40px] md:border-r border-line">
              <div className="heading4">Reset your password</div>
              <form onSubmit={handleSubmit} className="md:mt-7 mt-4">
                <div className="email ">
                  <input
                    readOnly
                    disabled
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                    id="email"
                    type="email"
                    placeholder="Email address *"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors?.email && (
                    <p className="text-red-900 text-sm mt-1 !text-red-900">
                      {errors?.email}
                    </p>
                  )}
                </div>
                <div className="code mt-5">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                    id="code"
                    type="number"
                    placeholder="Code *"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                  />
                  {errors?.code && (
                    <p className="text-red-900 text-sm mt-1 !text-red-900">
                      {errors?.code}
                    </p>
                  )}
                </div>
                <div className="password mt-5">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                    id="password"
                    type="password"
                    placeholder="Password *"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  {errors?.password && (
                    <p className="text-red-900 text-sm mt-1 !text-red-900">
                      {errors?.password}
                    </p>
                  )}
                </div>
                <div className="confirmPassword mt-5">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm Password *"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  {errors?.confirmPassword && (
                    <p className="text-red-900 text-sm mt-1 !text-red-900">
                      {errors?.confirmPassword}
                    </p>
                  )}
                </div>
                <div className="block-button md:mt-7 mt-4">
                  <button className="button-main">Submit</button>
                </div>
              </form>
            </div>
            <div className="right md:w-1/2 w-full lg:pl-[60px] md:pl-[40px] flex items-center">
              <div className="text-content">
                <div className="heading4">New Customer</div>
                <div className="mt-2 text-secondary">
                  Be part of our growing family of new customers! Join us today
                  and unlock a world of exclusive benefits, offers, and
                  personalized experiences.
                </div>
                <div className="block-button md:mt-7 mt-4">
                  <Link href={"/login"} className="button-main">
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ResetPassword;
