import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import CreateProductPage from "./CreateProductPage";

export default function EditProductPage() {
  const { productId } = useParams(); // Get product ID from URL

  const {
    data: product,
    fetchError,
    isLoading,
  } = useAxiosFetch(`http://localhost:8000/api/products/${productId}`);

  const navigate = useNavigate();

  useEffect(() => {
    if (fetchError) {
      console.error("Error fetching product:", fetchError);
      navigate("/dashboard/products");
    }
  }, [product, fetchError, navigate]); // Include product and navigate in dependency array

  return (
    <div className="edit-product">
      {product && <CreateProductPage defaultValues={product} />}
    </div>
  );
}
