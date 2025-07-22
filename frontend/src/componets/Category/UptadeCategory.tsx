import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import Inputs from "../Inputs";

interface CategoryFormData {
  category_name: string;
}

const UptadeCategory = ({ categoryIdToUpdate = null }: { categoryIdToUpdate?: string | null }) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CategoryFormData>();

  const [categoryId, setCategoryId] = useState(categoryIdToUpdate || "");
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!categoryId) {
        reset({
          category_name: "",
        });
        return;
      }

      setLoading(true);
      setFetchError(null);
      try {
        const res = await fetch(`/category/${categoryId}`);
        if (!res.ok) {
          throw new Error(`Error al cargar la categoría: ${res.statusText}`);
        }
        const data = await res.json();
        setValue("category_name", data.category_name);
      } catch (err: any) {
        console.error("Error fetching category:", err);
        setFetchError(err.message);
        alert(`Error al cargar la categoría: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryId, setValue, reset]);


  const handleCategoryIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryId(e.target.value);
  };


  const onSubmit = async (data: CategoryFormData) => {
    setSubmitError(null);

    if (!categoryId) {
      alert("Por favor, ingresa el ID de la categoría que deseas actualizar.");
      return;
    }

    const bodyData = {
      category_name: data.category_name,
    };

    setLoading(true);
    try {
      const res = await fetch(`/category/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        alert("Categoría actualizada exitosamente.");
        reset(); 
        setCategoryId(""); 
      } else {
        const result = await res.json();
        const errorText = Array.isArray(result?.detail)
          ? result.detail.map((e: any) => e.msg).join(", ")
          : result?.detail || "Error inesperado.";
        throw new Error("Error al actualizar la categoría: " + errorText);
      }
    } catch (err: any) {
      console.error("Error updating category:", err);
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
      <h2 className="text-xl font-bold mb-3 text-center">Actualizar Categoría</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="mb-2">
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
            ID de la Categoría
          </label>
          <input
            id="categoryId"
            type="text"
            name="categoryId"
            placeholder="ID de la categoría a actualizar"
            className="w-full px-3 py-1.5 text-sm border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={categoryId}
            onChange={handleCategoryIdChange}
            required
          />
        </div>


        <Inputs
          type="text"
          name="category_name"

          register={register}
          validationRules={{ required: "El nombre de la categoría es requerido." }}
        />
        {errors.category_name && (
          <p className="text-red-500 text-xs mt-0.5">{errors.category_name.message}</p>
        )}

        <motion.button
          type="submit"
          className="w-full bg-purple-700 hover:bg-purple-900 text-white font-bold py-2 px-4 rounded"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          {loading ? "Actualizando..." : "Actualizar Categoría"}
        </motion.button>
        {fetchError && <p className="text-red-500 text-center text-sm mt-2">{fetchError}</p>}
        {submitError && <p className="text-red-500 text-center text-sm mt-2">{submitError}</p>}
      </form>
    </motion.div>
  );
};

export default UptadeCategory;