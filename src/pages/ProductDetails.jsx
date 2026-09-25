import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css";
import { fetchProductById } from "../controllers/productController";
import { removeProduct } from "../controllers/crudController";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
      const confirmed = window.confirm(`Are you sure you want to delete "${product.title}"?`)

      if (!confirmed) return

      const controller = new AbortController()

      setDeleting(true)

      try {
          await removeProduct(product.id, controller.signal)
          navigate("/products")
      } catch (error) {
          if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
              return
          }
          console.error("Failed to delete product:", error)
      } finally {
          setDeleting(false)
      }
  }

  useEffect(() => {
    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        const data = await fetchProductById(id, controller.signal);

        if (!data) return;

        setProduct(data);
      } catch (error) {
        if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
          return;
        }
        if (error.response?.status === 404) {
          setNotFound(true);
          return;
        }
        console.error("Failed to fetch product:", error);
      }
    };

    fetchProduct();

    return () => controller.abort();
  }, [id]);

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold">Product Not Found</h1>

        <p>The product with ID {id} does not exist.</p>

        <button className="btn-primary" onClick={() => navigate("/products")}>
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading product...</p>
      </div>
    );
  }

  return (
    <div className="w-screen App font-sans p-5">
      <div className="flex gap-3 mb-5">
        <button className="btn-primary mb-5"
          onClick={() => navigate("/products")}>
          ← Back to Products
        </button>

        <button className="btn-primary mb-5 bg-yellow-500"
          onClick={() => navigate(`/products/${product.id}/edit`)}>
          Edit Product
        </button>

        <button className="btn-primary mb-5 bg-red-700!"
          onClick={handleDelete}
          disabled={deleting}>
          {deleting? "Deleting..." : "Delete Product"}
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{product.title}</h1>

        {/* Product images */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <img src={product.thumbnail} alt={product.title}
              className="w-full h-100 object-contain rounded" />

            <div className="grid grid-cols-4 gap-3 mt-4">
              {product.images?.map((image) => (
                <img key={image} src={image} alt={product.title}
                  className="h-24 w-full object-cover rounded border" /> 
              ))}
            </div>
          </div>

          {/* Product information */}
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-gray-500">Category</span>
              <p className="text-lg">{product.category}</p>
            </div>

            <div>
              <span className="text-gray-500">Brand</span>
              <p className="text-lg">{product.brand || "N/A"}</p>
            </div>

            <div>
              <span className="text-gray-500">Price</span>
              <p className="text-3xl font-bold">${product.price}</p>
            </div>

            <div>
              <span className="text-gray-500">Rating</span>
              <p>{product.rating}</p>
            </div>

            <div>
              <span className="text-gray-500">Stock</span>
              <p>{product.stock}</p>
            </div>

            <div>
              <span className="text-gray-500">Description</span>
              <p className="leading-7">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-5">Reviews</h2>

          {product.reviews?.length > 0 ? (
            <div className="flex flex-col gap-4">
              {product.reviews.map((review, index) => (
                <div key={index} className="p-4 border rounded">
                  <div className="flex justify-between">
                    <strong>{review.reviewerName}</strong>
                    <span>{review.rating}</span>
                  </div>
                  <p className="mt-2">{review.comment}</p>
                  <small className="text-gray-500">{review.date}</small>
                </div>
              ))}
            </div>
          ) : (
            <p>No reviews available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
