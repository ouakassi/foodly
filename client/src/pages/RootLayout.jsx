import { Outlet } from "react-router-dom";

import Footer from "../components/Footer/Footer";
import Header from "../components/Navigation/Header";

import ScrollToTop from "../hooks/useScrollToTop";

export default function RootLayout() {
  const mainStyle = {
    paddingTop: "var(--header-height)",
    maxWidth: "1920px",
    minHeight: "calc(80vh - var(--header-height) )",
    margin: "0 auto",
  };

  return (
    <>
      <Header />
      <ScrollToTop />
      <main style={mainStyle}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
