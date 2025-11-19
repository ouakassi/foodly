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
import "./styles/shared.css";

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
import UsersPage from "./pages/Dashboard/Users/UsersPage";
import OrdersPage from "./pages/Dashboard/Orders/OrdersPage";
import ProductsPage from "./pages/Dashboard/Products/ProductsPage";
import ReportsPage from "./pages/Dashboard/ReportsPage";
import CreateProductPage from "./pages/Dashboard/Products/CreateProductPage";
import PageLayout from "./pages/PageLayout";
import EditProductPage from "./pages/Dashboard/Products/EditProductPage";
import CreateUserPage from "./pages/Dashboard/Users/CreateUserPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import { ROLES } from "./constants";
import CreateorderPage from "./pages/Dashboard/Orders/CreateorderPage";

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

        {/* Protected dashboard routes */}

        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MODERATOR]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="orders" element={<PageLayout />}>
            <Route index element={<OrdersPage />} />
            <Route path="create" element={<CreateorderPage />} />
          </Route>

          <Route path="products" element={<PageLayout />}>
            <Route index element={<ProductsPage />} />
            <Route path="create" element={<CreateProductPage />} />
            <Route path="edit" element={<ProductsPage />} />
            <Route path=":productId" element={<EditProductPage />} />
          </Route>

          <Route path="users" element={<PageLayout />}>
            <Route index element={<UsersPage />} />
            <Route
              path="create"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <CreateUserPage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="reports" element={<ReportsPage />} />

          <Route path="settings">
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<div>profile</div>} />
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
