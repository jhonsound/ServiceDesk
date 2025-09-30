import { cn } from "@/lib/utils";
import Link from "next/link";

const NavLink = ({
  href,
  pathname,
  icon,
  label,
  matchType = "prefix",
}: {
  href: string;
  pathname: string;
  icon: React.ReactNode;
  label: string;
  matchType?: "exact" | "prefix";
}) => {
  const isActive =
    matchType === "exact" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center p-2 rounded-md hover:bg-gray-700 transition-colors",
        isActive ? "bg-gray-700" : ""
      )}
    >
      {icon}
      {label}
    </Link>
  );
};

export default NavLink;