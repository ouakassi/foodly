import MainButton from "../../components/Buttons/MainButton";
import "./Promo.css";

import driedFoodPicture from "./../../assets/images/driedFood.png";

export default function Promo() {
  const date = new Date();

  return (
    <section className="promo section">
      <div className="promo__box1">
        <div className="promo__data">
          <h1>organic dried fruits</h1>
          <p>
            Especially suitable for athlets , but also ideal for preventing
            fatigue and loss of productivity
          </p>
          <MainButton text="Shop now" />
        </div>
        <img className="promo__img" src={driedFoodPicture} alt="dried food" />
      </div>
      <div className="promo__box2">
        <h1>Sale</h1>
        <span>up to 70%</span>
        <MainButton
          style={{
            backgroundColor: "var(--color-1)",
            color: "var(--color-2)",
          }}
          text="Shop Now"
        />
        <p>valid until {`${date.getMonth() + 1}/${date.getFullYear()}`}</p>
      </div>
    </section>
  );
}
