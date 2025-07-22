import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import Inputs from "../Inputs";

interface ProductFormData {
  product_name: string;
  description: string;
  price: number;
  category_id: number;
}

const UptadeProduct = ({ productIdToUpdate = null }: { productIdToUpdate?: string | null }) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProductFormData>();

  const [productId, setProductId] = useState(productIdToUpdate || "");
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) {
        reset({
          product_name: "",
          description: "",
          price: undefined,
          category_id: undefined,
        });
        return;
      }

      setLoading(true);
      setFetchError(null);
      try {
        const res = await fetch(`/products/${productId}`);
        if (!res.ok) {
          throw new Error(`Error al cargar el producto: ${res.statusText}`);
        }
        const data = await res.json();
        setValue("product_name", data.product_name);
        setValue("description", data.description);
        setValue("price", data.price);
        setValue("category_id", data.category_id);
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setFetchError(err.message);
        alert(`Error al cargar el producto: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId, setValue, reset]);

  const handleProductIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductId(e.target.value);
  };

  const onSubmit = async (data: ProductFormData) => {
    setSubmitError(null);

    if (!productId) {
      alert("Por favor, ingresa el ID del producto que deseas actualizar.");
      return;
    }

    const bodyData = {
      product_name: data.product_name,
      description: data.description,
      price: data.price,
      category_id: data.category_id,
      updated_product: new Date().toISOString().split("T")[0],
    };

    setLoading(true);
    try {
      const res = await fetch(`/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        alert("Producto actualizado exitosamente.");
        reset();
        setProductId("");
      } else {
        const result = await res.json();
        const errorText = Array.isArray(result?.detail)
          ? result.detail.map((e: any) => e.msg).join(", ")
          : result?.detail || "Error inesperado.";
        throw new Error("Error al actualizar el producto: " + errorText);
      }
    } catch (err: any) {
      console.error("Error updating product:", err);
      setSubmitError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-md mx-auto p-4 bg-white rounded-xl shadow-lg shadow-purple-600"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-xl font-bold mb-3 text-center">Actualizar Producto</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

        <div className="mb-2">
          <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">
            ID del Producto
          </label>
          <input
            id="productId"
            type="text"
            name="productId"
            placeholder="ID del producto a actualizar"
            className="w-full px-3 py-1.5 text-sm border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={productId}
            onChange={handleProductIdChange}
            required
          />
        </div>

        <Inputs
          type="text"
          name="product_name"
          register={register}
          validationRules={{ required: "El nombre del producto es requerido." }}
        />
        {errors.product_name && (
          <p className="text-red-500 text-xs mt-0.5">{errors.product_name.message}</p>
        )}

        <Inputs
          type="textarea"
          name="description"
          register={register}
          validationRules={{ required: "La descripción es requerida." }}
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-0.5">{errors.description.message}</p>
        )}

        <Inputs
          type="number"
          name="price"
          register={register}
          validationRules={{
            required: "El precio es requerido.",
            min: { value: 0, message: "El precio no puede ser negativo." },
            valueAsNumber: true,
          }}
        />
        {errors.price && (
          <p className="text-red-500 text-xs mt-0.5">{errors.price.message}</p>
        )}

        <Inputs
          type="number"
          name="category_id"
          register={register}
          validationRules={{
            required: "El ID de la categoría es requerido.",
            min: { value: 1, message: "El ID de la categoría debe ser un número positivo." },
            valueAsNumber: true,
          }}
        />
        {errors.category_id && (
          <p className="text-red-500 text-xs mt-0.5">{errors.category_id.message}</p>
        )}

        <motion.button
          type="submit"
          className="w-full bg-purple-700 hover:bg-purple-900 text-white font-bold py-2 px-4 rounded"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          {loading ? "Actualizando..." : "Actualizar Producto"}
        </motion.button>
        {fetchError && <p className="text-red-500 text-center text-sm mt-2">{fetchError}</p>}
        {submitError && <p className="text-red-500 text-center text-sm mt-2">{submitError}</p>}
      </form>
    </motion.div>
  );
};

export default UptadeProduct;