import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
const Nav = () => {

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full h-16 bg-purple-800 shadow-md fixed top-0 left-0 z-50"
    >
      <nav className="h-full">
        <ul className="flex items-center justify-center h-full space-x-6">
          <motion.li whileHover={{ scale: 1.1 }} className="text-white text-lg font-medium">
            <Link to="/">Home</Link>
          </motion.li>

              <motion.li whileHover={{ scale: 1.1 }} className="text-white text-lg font-medium">
                <Link to="/login">Iniciar sesión</Link>
              </motion.li>
              <motion.li whileHover={{ scale: 1.1 }} className="text-white text-lg font-medium">
                <Link to="/singUp">Crear usuario</Link>
              </motion.li>
              <motion.li whileHover={{ scale: 1.1 }} className="text-white text-lg font-medium">
                <Link to="/dashboard">Admin</Link>
              </motion.li>
          
        </ul>
      </nav>
    </motion.header>
  );
};

export default Nav;