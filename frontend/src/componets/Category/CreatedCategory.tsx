import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form"; 

import Inputs from "../Inputs"; 


interface CategoryFormData {
  category_name: string;
}

const CreatedCategory = () => {
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormData>();

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  
  const onSubmit = async (data: CategoryFormData) => {
    setSuccessMsg("");
    setErrorMsg("");
    setLoading(true); 

    try {
      const res = await fetch("/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category_name: data.category_name }), 
      });

      const result = await res.json();

      if (!res.ok) {
        const errorText = Array.isArray(result?.detail)
          ? result.detail.map((e: any) => e.msg).join(", ")
          : result?.detail || "Error inesperado";
        throw new Error(errorText);
      }

      setSuccessMsg(`Categoría creada: ${result.category_name}`);
      reset(); 
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <motion.div
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg shadow-purple-600"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-purple-700 text-center">Crear Categoría</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Inputs
          type="text"
          name="category_name"
          register={register} 
          validationRules={{
            required: "El nombre de la categoría es requerido.",
            minLength: {
              value: 3,
              message: "El nombre debe tener al menos 3 caracteres.",
            },
          }}
        />
       
        {errors.category_name && (
          <p className="text-red-500 text-xs mt-1">{errors.category_name.message}</p>
        )}

        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          className="w-full bg-purple-700 text-white py-2 rounded-md hover:bg-purple-800 transition"
          disabled={loading} 
        >
          {loading ? "Creando..." : "Crear"}
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

export default CreatedCategory;