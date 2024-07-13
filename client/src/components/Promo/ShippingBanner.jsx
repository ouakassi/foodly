import "./ShippingBanner.css";

import { FaShippingFast } from "react-icons/fa";
import { GiReturnArrow } from "react-icons/gi";

import ShippingBannerBox from "./ShippingBannerBox";
import Banner from "./Banner";

export default function ShippingBanner() {
  return (
    <Banner isRemovable={false}>
      <div className="shipping-banner-container">
        <ShippingBannerBox icon={<FaShippingFast />} text="free shipping " />
        <ShippingBannerBox icon={<GiReturnArrow />} text="30 days return" />
      </div>
    </Banner>
  );
}
