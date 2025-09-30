"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCategory } from "@/services/api";
import { CreateCategoryPayload } from "@/types";

// Definimos el tipo para un campo personalizado en el estado del formulario
type CustomFieldState = Omit<
  CreateCategoryPayload["customFields"][0],
  "is_required"
> & {
  is_required: boolean;
};

interface CreateCategoryFormProps {
  onSuccess: () => void; // Callback para ejecutar en caso de éxito
  setOpen: (open: boolean) => void; // Para cerrar el diálogo
}

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

      <div className="flex flex-col w-full gap-4 p-2">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">
              Nombre
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-800 border-gray-600"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">
              Descripción
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-800 border-gray-600 h-30"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="slaFirstResponse" className="text-gray-300">
              SLA 1ª Respuesta (horas)
            </Label>
            <Input
              id="slaFirstResponse"
              type="number"
              value={slaFirstResponse}
              onChange={(e) => setSlaFirstResponse(Number(e.target.value))}
              className="bg-gray-800 border-gray-600"
              required
              min={1}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slaResolution" className="text-gray-300">
              SLA Resolución (horas)
            </Label>
            <Input
              id="slaResolution"
              type="number"
              value={slaResolution}
              onChange={(e) => setSlaResolution(Number(e.target.value))}
              className="bg-gray-800 border-gray-600"
              required
              min={1}
            />
          </div>
        </div>
      </div>

      {/* Campos Personalizados */}
      <div className="col-span-4 p-2">
        <h4 className="text-md font-semibold mt-4 mb-2 text-gray-100">
          Campos Personalizados
        </h4>
        <div className="space-y-4">
          {customFields.map((field, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-2 items-center p-2 border border-gray-700 rounded-md"
            >
              <Input
                placeholder="Label del campo"
                value={field.label}
                onChange={(e) =>
                  handleCustomFieldChange(index, { label: e.target.value })
                }
                className="col-span-5 bg-gray-800 border-gray-600"
              />
              <Select
                value={field.type}
                onValueChange={(value) =>
                  handleCustomFieldChange(index, { type: value as "text" | "textarea" | "select" })
                }
              >
                <SelectTrigger className="col-span-4 bg-gray-800 border-gray-600">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-600">
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="textarea">Área de Texto</SelectItem>
                  <SelectItem value="select">Selección</SelectItem>
                </SelectContent>
              </Select>
              <div className="col-span-2 flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={field.is_required}
                  onChange={(e) =>
                    handleCustomFieldChange(index, { is_required: e.target.checked })
                  }
                />
                <Label className="text-sm ml-2 text-gray-300">Req.</Label>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveCustomField(index)}
                className="col-span-1"
              >
                X
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddCustomField}
          className="mt-4 bg-gray-800 text-white"
        >
          + Añadir Campo
        </Button>
      </div>

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
