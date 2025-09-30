"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getCategories } from "@/services/api";
import { CategoryHeader } from "@/components/categories/CategoryHeader";
import { CategoryCardView } from "@/components/categories/CategoryCardView";
import { CategoryTableView } from "@/components/categories/CategoryTableView";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Category } from "@/types";

export default function CategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while fetching categories.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "manager") {
      fetchCategories();
    }
  }, [user]);

  if (user?.role !== "manager") {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">
          Access Denied. Only managers can view this page.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner className="text-gray-500" variant={"infinite"} size={64} />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full p-4 md:p-8">
      <CategoryHeader onCategoryCreated={fetchCategories} />
      <CategoryCardView categories={categories} />
      <CategoryTableView categories={categories} />
    </div>
  );
}
