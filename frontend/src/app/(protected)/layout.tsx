"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner className="text-gray-500" variant={"infinite"} size={64} />
      </div>
    );
  }

  if (!user) {
    return null; // O un spinner, mientras redirige
  }

  // Si el usuario está autenticado, muestra el layout principal con el contenido de la página
  return <AppLayout>{children}</AppLayout>;
}
