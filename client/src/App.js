import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import React, { lazy, Suspense } from "react";

import "./styles/base.css";
import "./styles/global.css";
import "./styles/layout.css";

import RootLayout from "./pages/RootLayout";
import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Authentication/LoginPage";
import RegisterPage from "./pages/Authentication/RegisterPage";
import ForgotPasswordPage from "./pages/Authentication/ForgotPasswordPage";
import ResetPassword from "./pages/Authentication/ResetPassword";
import EmailSent from "./pages/Authentication/EmailSent";
import AboutPage from "./pages/About/AboutPage";
import StorePage from "./pages/Store/StorePage";

const LazyAbout = lazy(() => import("./pages/About/AboutPage"));

const authRoutes = [
  {
    path: "login",
    element: <LoginPage />,
  },
  { path: "register", element: <RegisterPage /> },
  { path: "forgot-password", element: <ForgotPasswordPage /> },
  { path: "email-sent", element: <EmailSent /> },
  { path: "reset-password", element: <ResetPassword /> },
];

function App() {
  // const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   document.addEventListener("load", () => {
  //     console.log("is loading....");

  //     setIsLoading(true);
  //   });
  //   return document.addEventListener("load", () => {
  //     console.log("finish loading");
  //     setIsLoading(false);
  //   });
  // }, [isLoading]);

  // console.log(isLoading);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="store" element={<StorePage />}></Route>
        <Route
          path="about"
          element={
            <Suspense fallback="loading...">
              <LazyAbout />
            </Suspense>
          }
        ></Route>

        {/* <Route path="cart" element={<div>cart</div>} />
        <Route path="oils" element={<div>oils</div>} />
        <Route path="nuts" element={<div>nuts</div>} />
        <Route path="herbs" element={<div>herbs</div>} /> */}
        <Route path="sale" element={<div>sale</div>} />
        <Route path="recipes" element={<div>recipes</div>} />
        <Route path="*" element={<div>sorry no page here</div>} />
        <Route path="auth">
          {authRoutes.map(({ path, element }, key) => {
            return <Route key={key} path={path} element={element} />;
          })}
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
