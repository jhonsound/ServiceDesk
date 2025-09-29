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
import { LogOut, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { getStatusVariant } from "@/lib/utils";

// El título del header puede cambiar según la página, así que lo pasamos como prop
export default function Header({ title }: { title: string }) {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between h-16 px-8 py-10 shadow-2xl bg-[#242424] ">

      <div className="flex items-center space-x-4 justify-center">
        <h1 className="text-2xl font-bold text-white">ServiceDesk Pro</h1>
        <Badge variant={'default'} style={{fontSize: '0.8rem'}}>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
                  alt={user?.name}
                />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </header>
  );
}
