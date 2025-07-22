import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form"; 
import Inputs from "../Inputs"; 
interface ProductFormData {
  product_name: string;
  description: string;
  price: number;
  category_id: number;
}

const CreatedProduct = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>();

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");


  const onSubmit = async (data: ProductFormData) => {
    setSuccessMsg("");
    setErrorMsg("");
    setLoading(true);

    const bodyData = {
      product_name: data.product_name,
      description: data.description,
      price: data.price, 
      category_id: data.category_id, 
      created_product: new Date().toISOString().split("T")[0],
      updated_product: new Date().toISOString().split("T")[0],
    };

    try {
      const res = await fetch("/products", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        setSuccessMsg("Producto creado exitosamente!");
        reset(); // Limpia el formulario después del éxito
      } else {
        const result = await res.json();
        const errorText = Array.isArray(result?.detail)
          ? result.detail.map((e: any) => e.msg).join(", ")
          : result?.detail || "Error inesperado.";
        throw new Error("Error al crear el producto: " + errorText);
      }
    } catch (err: any) {
      console.error("Error creating product:", err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false); // Desactiva el estado de carga
    }
  };

  return (
    <motion.div
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg shadow-purple-600 "
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-center ">Crear Producto</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Inputs
          type="text"
          name="product_name"
          register={register}
          validationRules={{
            required: "El nombre del producto es requerido.",
            minLength: { value: 3, message: "El nombre debe tener al menos 3 caracteres." }
          }}
        />
        {errors.product_name && (
          <p className="text-red-500 text-xs mt-1">{errors.product_name.message}</p>
        )}

       
        <Inputs
          type="textarea"
          name="description"
          
          register={register}
          validationRules={{ required: "La descripción es requerida." }}
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
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
          <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
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
          <p className="text-red-500 text-xs mt-1">{errors.category_id.message}</p>
        )}

        <motion.button
          type="submit"
          className="w-full bg-purple-700 hover:bg-purple-900 text-white font-bold py-2 px-4 rounded"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading} 
        >
          {loading ? "Creando..." : "Crear Producto"}
        </motion.button>
      </form>

      {successMsg && (
        <motion.p
          className="mt-4 text-green-600 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          ✅ {successMsg}
        </motion.p>
      )}
      {errorMsg && (
        <motion.p
          className="mt-4 text-red-600 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          ❌ {errorMsg}
        </motion.p>
      )}
    </motion.div>
  );
};

export default CreatedProduct;