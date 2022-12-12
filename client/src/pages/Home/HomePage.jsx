import "./HomePage.css";
import Promo from "../../components/Promo/Promo";
import Discounted from "../../components/Discounted/Discounted";
import Herbs from "../../components/Herbs/Herbs";

import Recipes from "../../components/Recipes/Recipes";

import NavigationContainer from "../../components/Navigation/NavigationContainer";
import HeroSlider from "../../components/Hero/HeroSlider";
import Banner from "../../components/Promo/Banner";
import SaleBanner from "../../components/Promo/SaleBanner";

import ShippingBanner from "../../components/Promo/ShippingBanner";
import Shipping from "../../components/Shipping/Shipping";

export default function HomePage() {
  return (
    <>
      {/* <Promo /> */}
      <SaleBanner />
      <ShippingBanner />
      <HeroSlider />
      <NavigationContainer />
      <Discounted />
      <Herbs />
      <SaleBanner />
      <Recipes />
      <Shipping />
    </>
  );
}
