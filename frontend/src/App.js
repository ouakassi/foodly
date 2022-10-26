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
import Home from "./pages/Home/Home";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="/cart" element={<div>cart</div>} />
      <Route path="/oils" element={<div>oils</div>} />
      <Route path="/dried-food" element={<div>dried food</div>} />
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
