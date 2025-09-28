'use client'; // Directiva para indicar que es un Componente de Cliente

import { useEffect, useState } from 'react';
import { getCategories, createTicket, Category, CreateTicketPayload, CustomField } from '../../services/api';

export default function CreateTicketForm() {
  // --- ESTADOS ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // --- EFECTOS ---
  // Cargar las categorías cuando el componente se monta
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await getCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError('No se pudieron cargar las categorías. Inténtalo de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // --- MANEJADORES DE EVENTOS ---
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    const category = categories.find((c) => c.id === categoryId) || null;
    setSelectedCategory(category);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    const customFieldValues = selectedCategory?.customFields.map(field => ({
        customFieldId: field.id,
        value: formData.get(`custom_${field.id}`) as string,
    })) || [];

    const payload: CreateTicketPayload = {
        title,
        description,
        categoryId: selectedCategory!.id,
        customFieldValues,
    };

    try {
        await createTicket(payload);
        setSuccessMessage('¡Ticket creado exitosamente!');
        e.currentTarget.reset(); // Limpia el formulario
        setSelectedCategory(null);
    } catch (err: any) {
        setError(err.message || 'Ocurrió un error al crear el ticket.');
    } finally {
        setIsLoading(false);
    }
  };

  // --- RENDERIZADO ---
  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800">Crear Nuevo Ticket de Soporte</h2>

      {/* Mensajes de estado */}
      {error && <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
      {successMessage && <div className="p-3 bg-green-100 text-green-700 rounded-md">{successMessage}</div>}

      {/* Campos estándar */}
      <div className="flex flex-col">
        <label htmlFor="title" className="mb-2 font-semibold text-gray-700">Título</label>
        <input type="text" name="title" id="title" required className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="flex flex-col">
        <label htmlFor="description" className="mb-2 font-semibold text-gray-700">Descripción</label>
        <textarea name="description" id="description" rows={4} required className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
      </div>

      <div className="flex flex-col">
        <label htmlFor="category" className="mb-2 font-semibold text-gray-700">Categoría</label>
        <select name="category" id="category" onChange={handleCategoryChange} required className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="">
          <option value="" disabled>Selecciona una categoría...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Campos dinámicos */}
      {selectedCategory && selectedCategory.customFields.length > 0 && (
        <div className="p-4 border-t border-gray-200 space-y-4">
            <h3 className="font-semibold text-gray-700">Información Adicional para "{selectedCategory.name}"</h3>
            {selectedCategory.customFields.map((field) => (
                <div key={field.id} className="flex flex-col">
                    <label htmlFor={`custom_${field.id}`} className="mb-2 text-gray-600">
                        {field.label} {field.is_required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                        type="text"
                        name={`custom_${field.id}`}
                        id={`custom_${field.id}`}
                        required={field.is_required}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            ))}
        </div>
      )}

      {/* Botón de envío */}
      <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors">
        {isLoading ? 'Creando Ticket...' : 'Crear Ticket'}
      </button>
    </form>
  );
}