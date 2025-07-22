import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";


import Inputs from "../Inputs";

interface DeleteCategoryFormData {
  category_id: string;
}

const DeleteCategory = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeleteCategoryFormData>();

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (data: DeleteCategoryFormData) => {
    setSuccessMsg("");
    setErrorMsg("");
    setLoading(true);

    const categoryIdToDelete = parseInt(data.category_id); 

    if (isNaN(categoryIdToDelete)) {
      setErrorMsg("Por favor, introduce un ID de categoría válido (número).");
      setLoading(false);
      return;
    }

    try {
      
      const confirmDelete = window.confirm(
        `¿Estás seguro de que quieres eliminar la categoría con ID: ${categoryIdToDelete}?`
      );

      if (!confirmDelete) {
        setLoading(false);
        return;
      }

      const res = await fetch(`/category/${categoryIdToDelete}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSuccessMsg(`Categoría con ID ${categoryIdToDelete} eliminada exitosamente.`);
        reset(); 
      } else {
        const result = await res.json();
        const errorText = Array.isArray(result?.detail)
          ? result.detail.map((e: any) => e.msg).join(", ")
          : result?.detail || "Error inesperado.";
        throw new Error(errorText);
      }
    } catch (err: any) {
      console.error("Error deleting category:", err);
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
      <h2 className="text-2xl font-bold mb-4 text-purple-700 text-center">Eliminar Categoría</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Inputs
          type="number" 
          name="category_id" 
          register={register} 
          validationRules={{
            required: "El ID de la categoría es requerido.",
            min: {
              value: 1,
              message: "El ID debe ser un número positivo.",
            },
            valueAsNumber: true,  
          }}
        />
       
        {errors.category_id && (
          <p className="text-red-500 text-xs mt-1">{errors.category_id.message}</p>
        )}

        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
          disabled={loading}  
        >
          {loading ? "Eliminando..." : "Eliminar"}
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

export default DeleteCategory;