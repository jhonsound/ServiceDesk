
"use client";

import type { Category } from "@/services/api";

interface CategoryCardViewProps {
  categories: Category[];
}

export function CategoryCardView({ categories }: CategoryCardViewProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
      {categories.map((category) => (
        <div key={category.id} className="bg-[#242424] p-6 rounded-lg shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-100">{category.name}</h3>
            <p className="text-sm text-gray-400 mt-1 mb-4">{category.description}</p>
            
            <div className="flex justify-between text-sm text-gray-300">
              <span>SLA 1ª Respuesta:</span>
              <span className="font-medium text-gray-100">{category.sla_first_response_hours}h</span>
            </div>
            <div className="flex justify-between text-sm text-gray-300 mt-2">
              <span>SLA Resolución:</span>
              <span className="font-medium text-gray-100">{category.sla_resolution_hours}h</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700">
             <p className="text-xs text-gray-500">
              {category.customFields.length} campos personalizados
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
