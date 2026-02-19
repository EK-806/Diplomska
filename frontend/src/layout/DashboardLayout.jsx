import { Outlet } from "react-router";
import DashboardSideBar from "@/components/DashboardSideBar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/SideBar";

export default function DashboardLayout() {
  return (
    <div className="bg-background dark:bg-dark-background">
      <div className=" prose !max-w-none mx-auto w-full bg-background dark:bg-dark-background">
        <SidebarProvider>
          <div className="relative">
            <DashboardSideBar/>
          </div>
          <SidebarInset className="bg-background dark:bg-dark-background w-full max-w-screen-2xl">
            <div className="flex items-center justify-end px-4 py-2">
              <SidebarTrigger
                className="
                scale-125
              bg-red-600 hover:bg-red-700
              dark:bg-red-600 dark:hover:bg-red-700
              text-white dark:text-white
              p-2 rounded-lg
              shadow-md hover:shadow-lg
              transition-all"/>
            </div>
            <div className="w-full">
              <Outlet/>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}