import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CustomFieldsProps } from "@/types";

export const CustomFields = ({
  customFields,
  handleAddCustomField,
  handleRemoveCustomField,
  handleCustomFieldChange,
}: CustomFieldsProps) => {
  return (
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
                handleCustomFieldChange(index, {
                  type: value as "text" | "textarea" | "select",
                })
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
                  handleCustomFieldChange(index, {
                    is_required: e.target.checked,
                  })
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
  );
};
