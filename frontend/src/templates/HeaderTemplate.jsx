import { ToggleMode } from "@/components/ToggleMode";
import Template from "@/components/Template";
import NavigationLinks from "../components/NavigationLinks";
import { Link } from "react-router";
import HeaderProfile from "@/components/HeaderProfile";
import useAuth from "@/hooks/useAuth";
import { LoaderCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function HeaderTemplate() {
  const { user, loading } = useAuth();

  return (
    <Template
      className="
        bg-background dark:bg-dark-background
        sticky top-0 z-50 bg-opacity-80
        dark:bg-opacity-80 backdrop-blur-lg border-b
        border-black dark:border-white py-3
        overflow-x-hidden">
      <div className="flex justify-between items-center w-full max-w-full gap-2">
        <div className="basis-1/6 flex justify-start items-center shrink-0">
          <Link to="/">
            <img className="h-10" src="/logo.png" alt="Logo"/>
          </Link>
        </div>

        <div className="basis-4/6 flex justify-center items-center min-w-0">
          <div className="max-w-full overflow-x-auto scrollbar-none">
            <div className="w-max">
              <NavigationLinks/>
            </div>
          </div>
        </div>

        <div className="basis-1/6 flex justify-end items-center shrink-0">
          <div className="flex gap-2 items-center shrink-0">
            <NotificationButton/>

            {loading ? (
              <LoaderCircle className="animate-spin"/>
            ) : user ? (
              <HeaderProfile/>
            ) : (
              <Link to="/signin-signup">
                <Button
                  type="button"
                  className="
                    h-10 px-4
                    border-2 border-black dark:border-white
                    bg-red-600 dark:bg-red-600
                    text-white
                    hover:bg-red-700 dark:hover:bg-red-700
                    font-medium transition
                    shrink-0">
                  Log in
                </Button>
              </Link>
            )}

            <div className="shrink-0">
              <ToggleMode/>
            </div>
          </div>
        </div>
      </div>
    </Template>
  );
}

function NotificationButton() {
  return (
    <button
      className="
        relative p-2 rounded-full shrink-0
        hover:bg-red-600 dark:hover:bg-red-600
        hover:text-white dark:hover:text-white
        transition"
      aria-label="Notifications">
      <Bell className="w-6 h-6"/>

      <span
        className="
          absolute top-0 right-0
          inline-flex items-center justify-center
          px-1.5 py-0.5
          text-xs font-bold
          text-white
          bg-yellow-400
          rounded-full
          transform translate-x-1/2 -translate-y-1/2">
        3
      </span>
    </button>
  );
}