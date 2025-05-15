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
import OrdersPage from "./pages/Dashboard/Orders/OrdersPage";
import ProductsPage from "./pages/Dashboard/Products/ProductsPage";
import ReportsPage from "./pages/Dashboard/ReportsPage";
import CreateProductPage from "./pages/Dashboard/Products/CreateProductPage";
import ProductsLayout from "./pages/ProductsLayout";
import EditProductPage from "./pages/Dashboard/Products/EditProductPage";

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
          <Route path="products" element={<ProductsLayout />}>
            <Route index element={<ProductsPage />} />
            {/* <Route path=":productId" element={<ProductsPage />} /> */}
            <Route path="create" element={<CreateProductPage />} />
            <Route path="edit/:productId" element={<EditProductPage />} />
          </Route>
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings">
            <Route index path="profile" element={<div>profile</div>} />
          </Route>
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
