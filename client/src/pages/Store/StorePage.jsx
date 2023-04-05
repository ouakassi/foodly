import { useEffect, useState } from "react";
import "./StorePage.css";
import API from "../../api/api";
import ProductCard from "../../components/Product/ProductCard";

export default function StorePage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    //boolean flag that is used to ensure that the state update inside the useEffect hook is only executed when the component is mounted.
    let isMounted = true;
    const controller = new AbortController();
    const getProducts = async () => {
      try {
        const response = await API.get("/api/products/", {
          signal: controller.signal,
        });
        console.log(response.data);
        isMounted && setData(response.data);
      } catch (error) {}
    };

    getProducts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  return (
    <>
      {data.map(({ id, imgUrl, price, status, title }) => {
        return (
          <ProductCard
            key={id}
            productImg={imgUrl}
            productName={title}
            productPrice={price}
          />
        );
      })}
    </>
  );
}
