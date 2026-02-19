import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropDownMenu';
import { useTheme } from '@/lib/Theme';

export function ToggleMode() {
  const { setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
           className="bg-yellow-500 dark:bg-dark-background
             hover:bg-yellow-500 hover:bg-opacity-80
             dark:hover:bg-dark-muted
             rounded-full h-10 w-10 flex items-center justify-center relative
             outline-none ring-0 ring-offset-0
             focus:ring-0 focus:ring-offset-0 focus:outline-none
             focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none
             active:ring-0 active:ring-offset-0
             shadow-none border-gray-900
             border-2 dark:border-gray-100 text-gray-100">
          <Sun className="  rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
          <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-dark-foreground"/>
          <span className="sr-only">Toggle Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border border-gray-900 dark:border-gray-100 bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground">
        <DropdownMenuItem
          className="cursor-pointer
             text-gray-900 dark:text-gray-100
             hover:bg-red-600 hover:text-white
             dark:hover:bg-red-600 dark:hover:text-white
             focus:bg-red-600 focus:text-white
             dark:focus:bg-red-600 dark:focus:text-white"
          onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer
             text-gray-900 dark:text-gray-100
             hover:bg-red-600 hover:text-white
             dark:hover:bg-red-600 dark:hover:text-white
             focus:bg-red-600 focus:text-white
             dark:focus:bg-red-600 dark:focus:text-white"
          onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer
             text-gray-900 dark:text-gray-100
             hover:bg-red-600 hover:text-white
             dark:hover:bg-red-600 dark:hover:text-white
             focus:bg-red-600 focus:text-white
             dark:focus:bg-red-600 dark:focus:text-white"
          onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}