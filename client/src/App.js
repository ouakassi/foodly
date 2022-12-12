import "./styles/base.css";
import "./styles/global.css";
import "./styles/layout.css";

import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import RootLayout from "./pages/RootLayout";
import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Authentication/LoginPage";
import RegisterPage from "./pages/Authentication/RegisterPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<HomePage />} />
      <Route path="/store" element={<div>STORE</div>}></Route>
      <Route path="/cart" element={<div>cart</div>} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/register"
        element={
          <div>
            <RegisterPage />
          </div>
        }
      />
      <Route path="/oils" element={<div>oils</div>} />
      <Route path="/nuts" element={<div>nuts</div>} />
      <Route path="/herbs" element={<div>herbs</div>} />
      <Route path="/sale" element={<div>sale</div>} />
      <Route path="/recipes" element={<div>recipes</div>} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
