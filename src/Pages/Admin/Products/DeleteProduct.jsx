import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function DeleteProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5001/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/products/${id}`);
      navigate("/admin/products");
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Delete Product</h2>
      <p>Are you sure you want to delete <strong>{product.name}</strong>?</p>
      <div className="mt-4 flex gap-2">
        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Yes, Delete</button>
        <button onClick={() => navigate("/admin/products")} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
      </div>
    </div>
  );
}
