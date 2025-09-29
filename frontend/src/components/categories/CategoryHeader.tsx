
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateCategoryForm } from "@/components/categories/CreateCategoryForm";

interface CategoryHeaderProps {
  onCategoryCreated: () => void;
}

export function CategoryHeader({ onCategoryCreated }: CategoryHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-white">Gestión de Categorías</h1>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="bg-gray-700">Crear Nueva Categoría</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] bg-[#242424] text-gray-100 border-gray-700">
          <DialogHeader>
            <DialogTitle>Nueva Categoría</DialogTitle>
            <DialogDescription className="text-gray-400">
              Completa los detalles para crear una nueva categoría de soporte.
            </DialogDescription>
          </DialogHeader>
          <CreateCategoryForm
            setOpen={setIsModalOpen}
            onSuccess={onCategoryCreated}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
