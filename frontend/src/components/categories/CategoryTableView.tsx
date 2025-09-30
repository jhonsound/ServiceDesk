
"use client";

import type { Category } from "@/services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CategoryTableViewProps {
  categories: Category[];
}

export function CategoryTableView({ categories }: CategoryTableViewProps) {
  return (
    <div className="bg-[#242424] p-6 rounded-lg shadow-2xl">
      <h2 className="text-xl font-bold mb-4 text-gray-100">Resumen en Tabla</h2>
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700 hover:bg-gray-800">
            <TableHead className="text-gray-300">Nombre</TableHead>
            <TableHead className="text-gray-300">Descripción</TableHead>
            <TableHead className="text-center text-gray-300">SLA 1ª Resp. (h)</TableHead>
            <TableHead className="text-center text-gray-300">SLA Resolución (h)</TableHead>
            <TableHead className="text-center text-gray-300">Campos Custom</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id} className="border-gray-700 hover:bg-gray-800">
              <TableCell className="font-medium text-gray-100">{category.name}</TableCell>
              <TableCell className="text-gray-400">{category.description}</TableCell>
              <TableCell className="text-center text-gray-100">
                {category.sla_first_response_hours}
              </TableCell>
              <TableCell className="text-center text-gray-100">
                {category.sla_resolution_hours}
              </TableCell>
              <TableCell className="text-center text-gray-100">
                {category.customFields.length}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
