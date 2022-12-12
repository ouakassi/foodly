import "./Promo.css";

export default function Promo() {
  const data = Array(9).fill(<h1>Sale</h1>);

  return (
    <section className="promo">
      <div className="promo__box">
        <div className="promo__box-sale">
          {data.map((item) => {
            return item;
          })}
        </div>
      </div>
    </section>
  );
}
