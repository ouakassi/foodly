import "./ShippingBanner.css";

import { FaShippingFast } from "react-icons/fa";
import { GiReturnArrow } from "react-icons/gi";

import ShippingBannerBox from "./ShippingBannerBox";
import Banner from "./Banner";

export default function ShippingBanner() {
  return (
    <Banner>
      <div className="shipping__banner__container">
        <ShippingBannerBox
          icon={<FaShippingFast />}
          text="free shipping over 40$"
        />
        <ShippingBannerBox icon={<GiReturnArrow />} text="free return" />
      </div>
    </Banner>
  );
}
