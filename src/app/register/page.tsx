"use client";
import React, { useState } from "react";
import Link from "next/link";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Footer from "@/components/Footer/Footer";
import * as Icon from "@phosphor-icons/react/dist/ssr";
// import ToasterService from "../../utils/toaster.util";
import AuthService from "@/services/auth.service";
import { useRouter } from "next/navigation";

const Register = () => {
  const navigate = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    remember: false,
  });

  const [errors, setErrors] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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

    // validation
    if (!formData.name) {
      newErrors.name = "Name is required.";
    }
    if (!formData.email) {
      newErrors.email = "Email is required.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.remember) {
      newErrors.remember = "You must agree to the Terms of User.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };
      const register = await AuthService.register(payload,navigate);
    }
  };

  return (
    <>
      <div id="header" className="relative w-full">
        <Breadcrumb
          heading="Create An Account"
          subHeading="Create An Account"
        />
      </div>
      <div className="register-block md:py-20 py-10">
        <div className="container">
          <div className="content-main flex gap-y-8 max-md:flex-col">
            <div className="left md:w-1/2 w-full lg:pr-[60px] md:pr-[40px] md:border-r border-line">
              <div className="heading4">Register</div>
              <form onSubmit={handleSubmit} className="md:mt-7 mt-4">
                <div className="name">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                    id="username"
                    type="name"
                    name="name"
                    onChange={handleChange}
                    value={formData?.name}
                    placeholder="Full Name *"
                    required
                  />
                  {errors?.name && (
                    <p className="text-red-900 text-sm mt-1 !text-red-900">
                      {errors?.name}
                    </p>
                  )}
                </div>
                <div className="email  pass mt-5">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                    id="username"
                    type="email"
                    name="email"
                    onChange={handleChange}
                    value={formData?.email}
                    placeholder="Email address *"
                    required
                  />
                  {errors?.email && (
                    <p className="text-red-900 text-sm mt-1 !text-red-900">
                      {errors?.email}
                    </p>
                  )}
                </div>
                <div className="pass mt-5">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                    id="password"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    value={formData?.password}
                    placeholder="Password *"
                    required
                  />
                  {errors?.password && (
                    <p className="text-sm text-red-900  mt-1 !text-red-900">
                      {errors?.password}
                    </p>
                  )}
                </div>
                <div className="confirm-pass mt-5">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    onChange={handleChange}
                    value={formData?.confirmPassword}
                    placeholder="Confirm Password *"
                    required
                  />
                  {errors?.confirmPassword && (
                    <p className="text-red-900 text-sm mt-1 !text-red-900">
                      {errors?.confirmPassword}
                    </p>
                  )}
                </div>
                <div className="flex items-center mt-5">
                  <div className="block-input">
                    <input
                      type="checkbox"
                      name="remember"
                      id="remember"
                      onChange={handleChange}
                      checked={formData?.remember}
                    />
                    <Icon.CheckSquare
                      size={20}
                      weight="fill"
                      className="icon-checkbox"
                    />
                  </div>
                  <label
                    htmlFor="remember"
                    className="pl-2 cursor-pointer text-secondary2"
                  >
                    I agree to the
                    <Link
                      href={"#!"}
                      className="text-black hover:underline pl-1"
                    >
                      Terms of User
                    </Link>
                  </label>
                </div>
                {errors?.remember && (
                  <p className="!text-red-900 text-sm mt-1">
                    {errors?.remember}
                  </p>
                )}
                <div className="block-button md:mt-7 mt-4">
                  <button className="button-main">Register</button>
                </div>
              </form>
            </div>
            <div className="right md:w-1/2 w-full lg:pl-[60px] md:pl-[40px] flex items-center">
              <div className="text-content">
                <div className="heading4">Already have an account?</div>
                <div className="mt-2 text-secondary">
                  Welcome back. Sign in to access your personalized experience,
                  saved preferences, and more. We{String.raw`'re`} thrilled to
                  have you with us again!
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

export default Register;
