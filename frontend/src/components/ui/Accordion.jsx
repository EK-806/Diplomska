import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("border-b-[3px] border-black/80 dark:border-white/80", className)} {...props}/>
))

AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header className="w-full">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "group w-full transition-all hover:no-underline",
          className
        )}
        {...props}>

        <div className="max-w-4xl mx-auto w-full flex items-center justify-between py-5">
          <span className="text-left">{children}</span>

          <div className="p-2 border-2 dark:border-gray-100 border-gray-900 rounded-md transition-all duration-200 bg-red-600 hover:shadow-md hover:bg-red-700">
            <ChevronDown
              className="h-5 w-5 shrink-0 text-gray-100 dark:text-gray-100 transition-transform duration-200 group-data-[state=open]:rotate-180"/>
          </div>
        </div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
);

AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}>
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }