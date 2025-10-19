import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "@/styles/styles.scss";
import GlobalProvider from "./GlobalProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import ModalCart from "@/components/Modal/ModalCart";
import ModalWishlist from "@/components/Modal/ModalWishlist";
import ModalSearch from "@/components/Modal/ModalSearch";
import ModalQuickview from "@/components/Modal/ModalQuickview";
import ModalCompare from "@/components/Modal/ModalCompare";
import CountdownTimeType from "@/type/CountdownType";
import { countdownTime } from "@/store/countdownTime";
import "./layout.css";
import Notistack from "@/components/Snackbar";
import Snackbar from "@/components/Snackbar";
import Footer from "@/components/Footer/Footer";
import SliderPromotionalBanner from "@/components/Slider/SliderPromotionalBanner";
import TopBar from "@/components/Header/TopBar/TopBar";
// import Notistack from "@/components/Notistack/Notistack";
// import Notistack from "@/components/Notistack/Notistack";

const serverTimeLeft: CountdownTimeType = countdownTime();

const instrument = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: "Foxybd",
  description: "Foxybd E-commerce Website",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ReduxProvider>
        <GlobalProvider>
          <html lang="en">
            <body className={instrument.className}>
              <Snackbar>
                <SliderPromotionalBanner />
                <TopBar />
                {children}
                <Footer />
              </Snackbar>
              <ModalCart serverTimeLeft={serverTimeLeft} />
              <ModalWishlist />

              <ModalSearch />
              <ModalQuickview />
              <ModalCompare />
            </body>
          </html>
        </GlobalProvider>
      </ReduxProvider>
    </>
  );
}
