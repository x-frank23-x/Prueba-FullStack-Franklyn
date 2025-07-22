import { useForm } from 'react-hook-form';
import Inputs from '../componets/Inputs';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const SignUp = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = handleSubmit(async (data) => {
    setErrorMsg('');

    try {
      const response = await axios.post("/api/create/users", {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
      });

      const result = response.data;
      if( result)

      navigate('/login');
      alert('¡Cuenta creada exitosamente! Por favor, inicia sesión.');

    } catch (error) {
      console.error('Error en la petición de registro:', error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorResult = error.response.data;
          const errorText = Array.isArray(errorResult?.detail)
            ? errorResult.detail.map((e:any) => e.msg).join(', ')
            : errorResult?.detail || 'Error inesperado en el servidor';
          setErrorMsg(errorText);
        } else if (error.request) {
          setErrorMsg('No se recibió respuesta del servidor. Verifica tu conexión.');
        } else {
          setErrorMsg('Error al configurar la solicitud. Inténtalo de nuevo.');
        }
      } else {
        setErrorMsg('Error desconocido. Inténtalo de nuevo.');
      }
    }
  });

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      <motion.img
        src="src/assets/fondo-pc.jpg"
        alt="Imagen de fondo"
        className="absolute inset-0 w-full h-full object-cover z-0"
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 2 }}
      />

      <motion.div
        className="relative z-10 bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <h2 className="text-3xl font-bold text-purple-800 mb-6 text-center">
          Crear cuenta
        </h2>

        <form onSubmit={onSubmit} className="space-y-5">
          <Inputs name="first_name" type="text" register={register} validationRules={{ required: "El nombre es requerido." }} />
          <Inputs name="last_name" type="text" register={register} validationRules={{ required: "El apellido es requerido." }} />
          <Inputs name="email" type="email" register={register} validationRules={{ required: "El email es requerido.", pattern: { value: /^\S+@\S+\.\S+$/, message: "Formato de email inválido." } }} />
          <Inputs name="password" type="password" register={register} validationRules={{ required: "La contraseña es requerida.", minLength: { value: 6, message: "La contraseña debe tener al menos 6 caracteres." } }} />

         
          {errorMsg && (
            <motion.p
              className="text-red-600 text-sm text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errorMsg}
            </motion.p>
          )}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-purple-600 text-white font-semibold py-2 rounded-md shadow-md hover:bg-purple-700 transition"
          >
            Crear usuario
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
};

export default SignUp;