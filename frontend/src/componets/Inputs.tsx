
import type {  UseFormRegister } from 'react-hook-form'; 

type InputProps = {
  type: string;
  name: string;
  register: UseFormRegister<any>; 
  validationRules?: Record<string, any>;
};

const Inputs = ({ type, name, register, validationRules }: InputProps) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </label>
      <input
        {...register(name, validationRules || { required: true })}
        type={type}
        className="w-full px-3 py-1 text-sm border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
    </div>
  );
};

export default Inputs;