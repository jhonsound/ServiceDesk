import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { MainFieldsProps } from "@/types";

export const MainFields = ({
  name,
  description,
  slaFirstResponse,
  slaResolution,
  setName,
  setDescription,
  setSlaFirstResponse,
  setSlaResolution,
}: MainFieldsProps) => {
  return (
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
  );
};
