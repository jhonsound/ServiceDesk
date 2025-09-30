"use client"; // Directiva para indicar que es un Componente de Cliente

import { useEffect, useState } from "react";
import { getCategories, createTicket } from "../../services/api";
import { Category, CreateTicketPayload } from "@/types";

export default function CreateTicketForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await getCategories();
        setCategories(data);
        setError(null);
      } catch {
        setError(
          "No se pudieron cargar las categorías. Inténtalo de nuevo más tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

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
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    const customFieldValues =
      selectedCategory?.customFields.map((field) => ({
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
      setSuccessMessage("¡Ticket creado exitosamente!");
      e.currentTarget.reset();
      setSelectedCategory(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error al crear el ticket.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start py-10 w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[60%] max-w-2xl max-h-[85vh] bg-[#242424] rounded-lg shadow-md"
      >
        <div className="p-8 pb-4">
          <h2 className="text-2xl font-bold text-white mb-4">
            Crear Nuevo Ticket de Soporte
          </h2>
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="p-3 bg-green-100 text-green-700 rounded-md">
              {successMessage}
            </div>
          )}
        </div>

        {/* CAMBIO 2: Creamos un contenedor para los campos que tendrá el scroll */}
        <div className="flex-grow p-8 pt-0 overflow-y-auto space-y-6">
          {/* Campos estándar */}
          <div className="flex flex-col">
            <label htmlFor="title" className="mb-2 font-semibold text-white">
              Título
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className="p-2 bg-[#1a1a1a] border text-white border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="mb-2 font-semibold text-white"
            >
              Descripción
            </label>
            <textarea
              name="description"
              id="description"
              rows={4}
              required
              className="p-2 bg-[#1a1a1a] border text-white border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            ></textarea>
          </div>

          <div className="flex flex-col">
            <label htmlFor="category" className="mb-2 font-semibold text-white">
              Categoría
            </label>
            <select
              name="category"
              id="category"
              onChange={handleCategoryChange}
              required
              className="p-2 bg-[#1a1a1a] border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              defaultValue=""
            >
              <option value="" disabled>
                Selecciona una categoría...
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Campos dinámicos */}
          {selectedCategory && selectedCategory.customFields.length > 0 && (
            <div className="p-4 border-t border-gray-700 space-y-4">
              <h3 className="font-semibold text-white">
                Información Adicional para &quot;{selectedCategory.name}&quot;
              </h3>
              {selectedCategory.customFields.map((field) => (
                <div key={field.id} className="flex flex-col">
                  <label
                    htmlFor={`custom_${field.id}`}
                    className="mb-2 text-white"
                  >
                    {field.label}{" "}
                    {field.is_required && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <input
                    type="text"
                    name={`custom_${field.id}`}
                    id={`custom_${field.id}`}
                    required={field.is_required}
                    className="p-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sección del Pie de Página (Fija) */}
        <div className="p-8 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-700 text-white font-bold py-3 rounded-md hover:bg-gray-600 disabled:bg-gray-500 transition-colors"
          >
            {isLoading ? "Creando Ticket..." : "Crear Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
}
