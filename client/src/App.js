import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import React, { lazy, Suspense } from "react";

import "./styles/base.css";
import "./styles/global.css";
import "./styles/layout.css";

import RootLayout from "./pages/RootLayout";

// auth
import LoginPage from "./pages/Authentication/LoginPage";
import RegisterPage from "./pages/Authentication/RegisterPage";
import ForgotPasswordPage from "./pages/Authentication/ForgotPasswordPage";
import ResetPassword from "./pages/Authentication/ResetPassword";
import EmailSent from "./pages/Authentication/EmailSent";

// other
import HomePage from "./pages/Home/HomePage";
import AboutPage from "./pages/About/AboutPage";
import StorePage from "./pages/Store/StorePage";

// dashboard
import DashboardLayout from "./pages/DashboardLayout";
import OverviewPage from "./pages/Dashboard/OverviewPage";
import CustomersPage from "./pages/Dashboard/CustomersPage";
import OrdersPage from "./pages/Dashboard/OrdersPage";
import ProductsPage from "./pages/Dashboard/ProductsPage";
import ReportsPage from "./pages/Dashboard/ReportsPage";
import SettingsPage from "./pages/Dashboard/SettingsPage";

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
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="about"
          element={
            <Suspense fallback="loading...">
              <LazyAbout />
            </Suspense>
          }
        />
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="sale" element={<div>sale</div>} />
          <Route path="recipes" element={<div>recipes</div>} />
          <Route path="*" element={<div>sorry no page here</div>} />
        </Route>
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index path="overview" element={<OverviewPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="auth">
          {authRoutes.map(({ path, element }, key) => {
            return <Route key={key} path={path} element={element} />;
          })}
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
