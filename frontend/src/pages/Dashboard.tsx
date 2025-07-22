
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// Importa tus componentes
import CreatedCategory from "../componets/Category/CreatedCategory";
import UptadeCategory from "../componets/Category/UptadeCategory";
import DeleteCategory from "../componets/Category/DeleteCategory";
import CreatedProduct from "../componets/Products/CreatedProduct";
import UptadeProduct from "../componets/Products/UptadeProduct";
import DeleteProduct from "../componets/Products/DeleteProduct";


const tabs = [
  { label: "Crear Categoría", component: <CreatedCategory /> },
  { label: "Actualizar Categoría", component: <UptadeCategory /> },
  { label: "Eliminar Categoría", component: <DeleteCategory /> },
  { label: "Crear Producto", component: <CreatedProduct /> },
  { label: "Actualizar Producto", component: <UptadeProduct /> },
  { label: "Eliminar Producto", component: <DeleteProduct /> },
];

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden p-4">
      <motion.img
        src="src/assets/fondo-pc.jpg"
        alt="Imagen de fondo"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-20"
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 2 }}
      />

      <div className="relative z-10 w-full max-w-4xl bg-white rounded-lg shadow-2xl flex flex-col min-h-[60vh]">
        <nav className="bg-gray-50 p-1.5 rounded-t-lg border-b border-gray-200 h-11">
          <ul className="flex list-none p-0 m-0 font-medium text-sm h-full">
            {tabs.map((item) => (
              <motion.li
                key={item.label}
                className={`relative flex-1 px-4 py-2 rounded-md cursor-pointer text-gray-800 flex items-center justify-center min-w-0 select-none  ${
                  item === selectedTab ? "bg-white" : "bg-transparent"
                }`}
                initial={false}
                animate={{
                  backgroundColor: item === selectedTab ? "#ffffff" : "#f9fafb",
                  color: item === selectedTab ? "#1f2937" : "#4b5563",
                }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedTab(item)}
              >
                {item.label}
                {item === selectedTab ? (
                  <motion.div
                    className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-blue-500"
                    layoutId="underline"
                  />
                ) : null}
              </motion.li>
            ))}
          </ul>
        </nav>

        <main className="flex-1 flex items-center justify-center p-4 ">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab ? selectedTab.label : "empty"}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full flex items-center justify-center"
            >
              {selectedTab ? selectedTab.component : <div>Selecciona una opción</div>}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </section>
  );
};

export default Dashboard;