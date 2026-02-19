import { Link, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/Sidebar";
import { Package, BarChart, ClipboardList, Users, Truck, Star, Home } from "lucide-react";
import { ProfilePicture, ProfilePictureImage, ProfilePictureFallback } from "@/components/ui/ProfilePicture";
import useAuth from "@/hooks/useAuth";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    roles: ["Agent", "User", "DeliveryDriver"],
  },
  {
    title: "Statistics",
    url: "/dashboard/package-stats",
    icon: BarChart,
    roles: ["Agent"],
  },
  {
    title: "Appoint Package",
    url: "/dashboard/appoint-package",
    icon: Package,
    roles: ["User"],
  },
  {
    title: "Appointed Packages",
    url: "/dashboard/appointed-packages",
    icon: ClipboardList,
    roles: ["User"],
  },
  {
    title: "All Packages",
    url: "/dashboard/all-packages",
    icon: Package,
    roles: ["Agent"],
  },
  {
    title: "All Users",
    url: "/dashboard/all-users",
    icon: Users,
    roles: ["Agent"],
  },
  {
    title: "Deliveries",
    url: "/dashboard/deliveries",
    icon: Truck,
    roles: ["DeliveryDriver"],
  },
  {
    title: "Ratings",
    url: "/dashboard/ratings",
    icon: Star,
    roles: ["DeliveryDriver"],
  },
  {
    title: "All Delivery Drivers",
    url: "/dashboard/all-delivery-drivers",
    icon: Truck,
    roles: ["Agent"],
  },
];

export default function DashboardSideBar() {
  const location = useLocation();
  const { user, loading } = useAuth();

  const u = user?.user ?? user;

  if (loading || !u) return null;

  const userRole = u.role;
  const filteredItems = items.filter((item) => item.roles.includes(userRole));

  const initials =
    `${u?.firstName?.[0] || ""}${u?.lastName?.[0] || ""}`.trim() || "U";

  return (
    <Sidebar>
      <SidebarContent className="min-h-screen">
        <SidebarGroup>
          <SidebarGroupLabel className="!py-7 mb-3">
            <div className="flex gap-3 items-center">
              <ProfilePicture className="h-12 w-12 border-[2.5px] border-red-600">
                <ProfilePictureImage src={u?.profilePicture || ""}/>
                <ProfilePictureFallback>{initials}</ProfilePictureFallback>
              </ProfilePicture>

              <div className="flex flex-col gap-1">
                <h5 className="font-semibold text-lg text-black dark:text-gray-100">
                  {u?.firstName
                    ? `${u.firstName} ${u.lastName || ""}`
                    : "Account"}
                </h5>
                <span className="text-sm font-medium dark:text-gray-100 text-gray-900">
                  {u?.role}
                </span>
              </div>
            </div>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {filteredItems.map((item) => {
                const active = location.pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={`
          flex items-center gap-3 rounded-lg px-4 py-2 font-medium
          transition-all
          ${
            active
              ? "!bg-red-600 !text-white dark:!text-white pointer-events-none border-2 dark:border-gray-100 border-gray-900"
              : "text-red-600 dark:text-red-600 hover:bg-yellow-400 hover:text-white dark:hover:text-white"
          }
        `}>
                        <item.icon
                          className={`w-5 h-5 transition-colors ${
                            active
                              ? "!text-white dark:!text-white"
                              : "text-red-600 dark:text-red-500"
                          }`}/>
                        <span
                          className={`
            ${
              active
                ? "!text-white dark:!text-white"
                : "text-red-600 dark:text-red-500"
            }
          `}>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}