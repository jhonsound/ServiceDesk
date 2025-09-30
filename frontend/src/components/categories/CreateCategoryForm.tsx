"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { createCategory } from "@/services/api";
import { CreateCategoryFormProps, CreateCategoryPayload, CustomFieldState } from "@/types";
import { CustomFields } from "./CustomFields";
import { MainFields } from "./MainFields";

export function CreateCategoryForm({
  onSuccess,
  setOpen,
}: CreateCategoryFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [slaFirstResponse, setSlaFirstResponse] = useState(24);
  const [slaResolution, setSlaResolution] = useState(72);
  const [customFields, setCustomFields] = useState<CustomFieldState[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCustomField = () => {
    setCustomFields([
      ...customFields,
      { label: "", type: "text", is_required: false },
    ]);
  };

  const handleRemoveCustomField = (index: number) => {
    const newFields = customFields.filter((_, i) => i !== index);
    setCustomFields(newFields);
  };

  const handleCustomFieldChange = (
    index: number,
    updates: Partial<CustomFieldState>
  ) => {
    const newFields = customFields.map((item, i) => {
      if (i === index) {
        return { ...item, ...updates };
      }
      return item;
    });
    setCustomFields(newFields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload: CreateCategoryPayload = {
      name,
      description,
      sla_first_response_hours: Number(slaFirstResponse),
      sla_resolution_hours: Number(slaResolution),
      customFields,
    };

    try {
      await createCategory(payload);
      onSuccess(); // Llama al callback (ej: refetch de datos)
      setOpen(false); // Cierra el modal
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error al crear la categoría.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="">

      {/* Campos Principales */}
      <MainFields
        name={name}
        description={description}
        slaFirstResponse={slaFirstResponse}
        slaResolution={slaResolution}
        setName={setName}
        setDescription={setDescription}
        setSlaFirstResponse={setSlaFirstResponse}
        setSlaResolution={setSlaResolution}
      />

      {/* Campos Personalizados */}
      <CustomFields
        customFields={customFields}
        handleAddCustomField={handleAddCustomField}
        handleRemoveCustomField={handleRemoveCustomField}
        handleCustomFieldChange={handleCustomFieldChange}
      />

      {error && <p className="text-red-500 text-sm col-span-4">{error}</p>}

      {/* Botón de Envío */}
      <div className="flex justify-end col-span-4 mt-4">
        <Button type="submit" disabled={isSubmitting} className="bg-gray-800">
          {isSubmitting ? "Creando..." : "Crear Categoría"}
        </Button>
      </div>
    </form>
  );
}
