"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { Badge } from "../ui/badge";

// El título del header puede cambiar según la página, así que lo pasamos como prop
export default function Header({ title }: { title: string }) {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between h-16 px-8 py-10 shadow-2xl bg-[#242424] ">
      <div className="flex items-center space-x-4 justify-center">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <Badge variant={"default"} style={{ fontSize: "0.8rem" }}>
          {user?.role}
        </Badge>
      </div>

      <div className="flex items-center space-x-4">
        {/* <Button asChild>
          <Link href="/tickets/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Ticket
          </Link>
        </Button> */}
      </div>
    </header>
  );
}
