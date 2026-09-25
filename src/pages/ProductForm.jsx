import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css";
import { fetchProductById, } from "../controllers/productController";
import { createProduct, editProduct, } from "../controllers/crudController"

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    brand: "",
    category: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;

    const controller = new AbortController();

    const loadProduct = async () => {
      try {
        const product = await fetchProductById(id, controller.signal);

        if (!product) return;

        setFormData({
          title: product.title || "",
          description: product.description || "",
          price: product.price ?? "",
          stock: product.stock ?? "",
          brand: product.brand || "",
          category: product.category || "",
        });
      } catch (error) {
        if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
          return;
        }

        console.error("Failed to load product:", error);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => controller.abort();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.price === "" || Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (formData.stock === "" || Number(formData.stock) < 0) {
      newErrors.stock = "Stock cannot be negative";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const controller = new AbortController();

    setSaving(true);

    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      if (isEditMode) {
        await editProduct(id, productData, controller.signal);
      } else {
        await createProduct(productData, controller.signal);
      }

      navigate("/products");
    } catch (error) {
      if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
        return;
      }

      console.error("Failed to save product:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading product...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5">
      <button className="btn-primary mb-5"
        onClick={() => navigate("/products")}>
        ← Back to Products
      </button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          {isEditMode ? "Edit Product" : "Add Product"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label>Title</label>

            <input name="title" value={formData.title} onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />

            {errors.title && <p className="text-red-500">{errors.title}</p>}
          </div>

          <div>
            <label>Description</label>

            <textarea name="description" value={formData.description} onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />

            {errors.description && ( <p className="text-red-500">{errors.description}</p> )}
          </div>

          <div>
            <label>Price</label>

            <input type="number" name="price" value={formData.price} onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />

            {errors.price && <p className="text-red-500">{errors.price}</p>}
          </div>

          <div>
            <label>Stock</label>

            <input type="number" name="stock" value={formData.stock} onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />

            {errors.stock && <p className="text-red-500">{errors.stock}</p>}
          </div>

          <div>
            <label>Brand</label>

            <input name="brand" value={formData.brand} onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label>Category</label>

            <input name="category" value={formData.category} onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />

            {errors.category && ( <p className="text-red-500">{errors.category}</p> )}
          </div>

          <button type="submit" disabled={saving} className="btn-primary">
            {saving? "Saving..." : isEditMode ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
