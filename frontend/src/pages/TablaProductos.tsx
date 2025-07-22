import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type Product = {
  id: number;
  product_id:number
  product_name: string;
  description: string;
  price: number;
  category_name: string;
  
};

const ProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/products');
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const categories = [...new Set(products.map((p) => p.category_name))];

  const filteredProducts = products.filter((product) =>
    product.product_name.toLowerCase().includes(filter.toLowerCase()) &&
    (selectedCategory === '' || product.category_name === selectedCategory) &&
    (!minPrice || product.price >= parseFloat(minPrice)) &&
    (!maxPrice || product.price <= parseFloat(maxPrice))
  );

  return (
    <section className="p-6 min-h-screen bg-gradient-to-br from-purple-100 to-white">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 50 }}
        transition={{ duration: 0.8 }}
        className="bg-white shadow-xl rounded-xl p-6 max-w-6xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-4 text-purple-700">Lista de Productos</h2>

        <input
          type="text"
          placeholder="Filtrar por nombre"
          className="mb-4 p-2 border border-purple-300 rounded-md w-full"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <select
            className="p-2 border border-purple-300 rounded-md w-full"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Precio mínimo"
            className="p-2 border border-purple-300 rounded-md w-full"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />

          <input
            type="number"
            placeholder="Precio máximo"
            className="p-2 border border-purple-300 rounded-md w-full"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="text-center text-purple-500">Cargando productos...</p>
        ) : (
          <motion.table
            className="w-full table-auto border-collapse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <thead>
              <tr className="bg-purple-200">
                <th className="border px-4 py-2">id</th>
                <th className="border px-4 py-2">Nombre</th>
                <th className="border px-4 py-2">Descripción</th>
                <th className="border px-4 py-2">Precio</th>
                <th className="border px-4 py-2">Categoría</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <motion.tr
                  key={product.id}
                  className="hover:bg-purple-50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="border px-4 py-2">{product.product_id}</td>
                  <td className="border px-4 py-2">{product.product_name}</td>
                  <td className="border px-4 py-2">{product.description}</td>
                  <td className="border px-4 py-2">${product.price}</td>
                  <td className="border px-4 py-2">{product.category_name}</td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        )}
      </motion.div>
    </section>
  );
};

export default ProductTable;
