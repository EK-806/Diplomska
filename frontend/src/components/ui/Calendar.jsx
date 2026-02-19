import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { ButtonVariants } from "@/components/ui/Button";

function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      fromDate={new Date()}
      disabled={[{ before: new Date() }]}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",

        nav_button: cn(
          ButtonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 border-2 border-gray-900 dark:border-gray-100 hover:bg-red-600 hover:text-white dark:hover:bg-red-600"
        ),

        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "rounded-md w-9 font-semibold text-[0.8rem] text-gray-900 dark:text-gray-100",
        row: "flex w-full mt-2",

        cell:
        "h-9 w-9 text-center text-sm p-0 relative " +
        "[&:has([aria-selected])]:bg-red-600 [&:has([aria-selected])]:rounded-full " +
        "focus-within:relative focus-within:z-20",

        day: cn(
          ButtonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal hover:bg-red-600 hover:text-white dark:hover:bg-red-600 aria-selected:opacity-100"
        ),

        day_range_end: "day-range-end",
        day_selected:
        "bg-red-600 text-white hover:bg-red-700 focus:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 " +
        "border-2 border-gray-900 dark:border-gray-100",
        day_today: "border border-red-600 text-black dark:text-white",
        day_outside: "day-outside text-muted-foreground aria-selected:bg-red-600/50 aria-selected:text-white",
        day_disabled: "text-red-500 dark:text-red-400 opacity-75 font-medium",
        day_range_middle: "aria-selected:bg-red-600 aria-selected:text-white",
        day_hidden: "invisible",
        ...classNames,
      }}

      components={{
        IconLeft: ({ className, ...iconProps }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...iconProps}/>
        ),
        IconRight: ({ className, ...iconProps }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...iconProps}/>
        ),
      }}
      {...props}/>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };