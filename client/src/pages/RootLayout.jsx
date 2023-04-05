import { useEffect } from "react";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Footer from "../components/Footer/Footer";
import Header from "../components/Navigation/Header";

import ScrollToTop from "../hooks/useScrollToTop";

export default function RootLayout() {
  const [show, setShow] = useState(false);

  const pathName = useLocation().pathname.slice(1);

  const mainStyle = {
    paddingTop: show && "var(--header-height)",
    maxWidth: "1920px",
    minHeight: "calc(80vh - var(--header-height) )",
    margin: "0 auto",
  };

  useEffect(() => {
    const locations = [
      "auth/login",
      "auth/register",
      "auth/forgot-password",
      "auth/reset-password",
      "auth/email-sent",
      "dashboard",
    ];
    if (locations.includes(pathName)) {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [pathName]);

  return (
    <>
      {show && <Header />}
      <ScrollToTop />
      <main style={mainStyle}>
        <Outlet />
      </main>
      {show && <Footer />}
    </>
  );
}
