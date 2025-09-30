'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../services/api'; // La importación no cambia
import Link from 'next/link';

export default function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: UserRole.REQUESTER });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    if (formData.password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres.');
        setIsLoading(false);
        return;
    }
    try {
      await register(formData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during registration.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Crear una Cuenta</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label htmlFor="name" className="block mb-2 font-semibold text-gray-700">Nombre Completo</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 font-semibold text-gray-700">Contraseña</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="role" className="block mb-2 font-semibold text-gray-700">Rol</label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {/* Generamos las opciones a partir del enum para que siempre estén sincronizadas */}
              {Object.values(UserRole).map(role => (
                  <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)} {/* Pone la primera letra en mayúscula */}
                  </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors">
            {isLoading ? 'Registrando...' : 'Registrar'}
          </button>
          
          {error && <p className="text-red-500 text-sm text-center pt-2">{error}</p>}
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          ¿Ya tienes una cuenta? <Link href="/login" className="font-semibold text-blue-600 hover:underline">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
}