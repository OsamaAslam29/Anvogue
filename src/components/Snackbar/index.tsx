"use client";
import React from "react";
import { SnackbarProvider } from "notistack";
import Toaster from "../Toaster";
const Snackbar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SnackbarProvider
      maxSnack={5}
      hideIconVariant
      preventDuplicate
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      iconVariant={{
        success: ":white_check_mark:",
        error: ":heavy_multiplication_x:",
        warning: ":warning:",
        info: ":information_source:",
      }}
    >
      <Toaster />
      {children}
    </SnackbarProvider>
  );
};
export default Snackbar;
