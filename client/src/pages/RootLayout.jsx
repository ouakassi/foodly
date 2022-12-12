import { useEffect } from "react";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Footer/Footer";

import Header from "../components/Navigation/Header";

export default function RootLayout() {
  const [showFooter, setShowFooter] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [addPadding, setAddPadding] = useState(false);

  const pathName = useLocation().pathname.slice(1);

  const mainStyle = {
    paddingTop: addPadding && "var(--header-height)",
    maxWidth: "1920px",
    minHeight: "calc(80vh - var(--header-height) )",
    margin: "0 auto",
  };

  const locations = ["login", "register"];

  useEffect(() => {
    if (locations.includes(pathName)) {
      setShowFooter(false);
      setShowHeader(false);
      setAddPadding(false);
    } else {
      setShowFooter(true);
      setShowHeader(true);
      setAddPadding(true);
    }
  }, [pathName]);

  return (
    <>
      {showHeader && <Header />}
      <main style={mainStyle}>
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </>
  );
}
