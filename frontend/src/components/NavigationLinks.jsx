import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";

export default function NavigationLinks() {
  const location = useLocation();
  const { user, loading } = useAuth();

  const u = user?.user ?? user;
  const role = u?.role ?? "Guest";

  const navigationItems = [
    { to: "/", label: "Home" },

    ...(role === "User"
      ? [{ to: "/dashboard/appoint-package", label: "Appoint Package" }]
      : role === "Agent"
        ? [{ to: "/dashboard/package-stats", label: "Statistics" }]
        : role === "DeliveryDriver"
          ? [{ to: "/dashboard/ratings", label: "Ratings" }]
          : []),

    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  if (loading) return null;

  return (
    <div className="flex gap-4">
      {navigationItems.map((navigationItem) => {
        const isActive = location.pathname === navigationItem.to;

        return (
          <Link
            key={navigationItem.label}
            to={navigationItem.to}
            className="text-sm font-semibold">
            <Button
              variant="ghost"
              size="sm"
              className={`transition-all duration-200 ${
                isActive
                  ? "bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-700 border-2 border-gray-900 dark:border-gray-100"
                  : "text-foreground dark:text-dark-foreground hover:bg-red-600 hover:text-white dark:hover:bg-red-600"
              }`}>
              {navigationItem.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}