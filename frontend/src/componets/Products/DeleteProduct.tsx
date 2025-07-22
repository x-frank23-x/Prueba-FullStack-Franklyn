import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";


import Inputs from "../Inputs"; 

interface DeleteProductFormData {
  product_id: string; 
}

const DeleteProduct = () => {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeleteProductFormData>();

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (data: DeleteProductFormData) => {
    setSuccessMsg("");
    setErrorMsg("");
    setLoading(true);

    const productIdToDelete = parseInt(data.product_id); 

    if (isNaN(productIdToDelete)) {
      setErrorMsg("Por favor, introduce un ID de producto válido (número).");
      setLoading(false);
      return;
    }

    try {
      // Pedir confirmación al usuario antes de eliminar
      const confirmDelete = window.confirm(
        `¿Estás seguro de que quieres eliminar el producto con ID: ${productIdToDelete}?`
      );

      if (!confirmDelete) {
        setLoading(false);
        return; // El usuario canceló la operación
      }

      const res = await fetch(`/products/${productIdToDelete}`, {
        method: "DELETE", // Método HTTP para eliminar
      });

      if (res.ok) {
        setSuccessMsg(`Producto con ID ${productIdToDelete} eliminado exitosamente.`);
        reset(); // Limpia el formulario después de la eliminación exitosa
      } else {
        const result = await res.json();
        const errorText = Array.isArray(result?.detail)
          ? result.detail.map((e: any) => e.msg).join(", ")
          : result?.detail || "Error inesperado.";
        throw new Error(errorText);
      }
    } catch (err: any) {
      console.error("Error deleting product:", err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg mt-10 shadow-purple-600"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-purple-700 text-center">Eliminar Producto</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Inputs
          type="number" 
          name="product_id" 

          register={register} 
          validationRules={{
            required: "El ID del producto es requerido.",
            min: {
              value: 1,
              message: "El ID debe ser un número positivo.",
            },
            valueAsNumber: true,
          }}
        />
     
        {errors.product_id && (
          <p className="text-red-500 text-xs mt-1">{errors.product_id.message}</p>
        )}

        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
          disabled={loading} 
        >
          {loading ? "Eliminando..." : "Eliminar Producto"}
        </motion.button>
      </form>

      {/* Mensajes de feedback al usuario */}
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

export default DeleteProduct;