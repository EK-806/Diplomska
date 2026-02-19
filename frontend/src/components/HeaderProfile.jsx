import { useMemo, useState } from "react";
import { ProfilePicture, ProfilePictureImage, ProfilePictureFallback } from "@/components/ui/ProfilePicture";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/DropDownMenu";
import useAuth from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import ProfilePopUp from "@/layout/ProfilePopUp";

export default function HeaderProfile() {
  const { user, LogOut } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const u = useMemo(() => user?.user ?? user ?? null, [user]);

  const dashboardRoute = useMemo(() => {
    return u?.role === "Delivery Driver"
      ? "/dashboard/deliveries"
      : u?.role === "User"
      ? "/dashboard/appointed-packages"
      : u?.role === "Agent"
      ? "/dashboard/package-stats"
      : "/dashboard";
  }, [u?.role]);

  const handleLogout = async () => {
    try {
      await LogOut();
    } finally {
      navigate("/signin-signup", { replace: true });
    }
  };

  const initials =
    `${u?.firstName?.[0] || ""}${u?.lastName?.[0] || ""}`.trim() || "U";

  return (
    <div>
      <ProfilePopUp open={profileOpen} onClose={() => setProfileOpen(false)}/>

      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <ProfilePicture className="outline outline-[2px] outline-red-600 outline-offset-[-2px] rounded-full">
            <ProfilePictureImage src={u?.profilePicture || ""}/>
            <ProfilePictureFallback>{initials}</ProfilePictureFallback>
          </ProfilePicture>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="dark:bg-foreground bg-background border border-gray-900 dark:border-gray-100">
          <DropdownMenuLabel className="text-foreground dark:text-dark-foreground">
            {u?.firstName ? `${u.firstName} ${u.lastName || ""}` : "Account"}
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-gray-900 dark:bg-gray-100 h-px"/>

          <DropdownMenuItem
            onClick={() => setProfileOpen(true)}
            className="cursor-pointer hover:bg-red-600 hover:text-white
      dark:hover:bg-red-600 dark:hover:text-white
      focus:bg-red-600 focus:text-white
      dark:focus:bg-red-600 dark:focus:text-white">
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="cursor-pointer hover:bg-red-600 hover:text-white
      dark:hover:bg-red-600 dark:hover:text-white
      focus:bg-red-600 focus:text-white
      dark:focus:bg-red-600 dark:focus:text-white">
            <Link to={dashboardRoute}>Dashboard</Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-gray-900 dark:bg-gray-100 h-[0.5px]"/>

          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer hover:bg-red-600 hover:text-white
      dark:hover:bg-red-600 dark:hover:text-white
      focus:bg-red-600 focus:text-white
      dark:focus:bg-red-600 dark:focus:text-white">
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}