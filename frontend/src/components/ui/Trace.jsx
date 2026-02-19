import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

const Trace = React.forwardRef(
  ({ ...props }, ref) => <nav ref={ref} aria-label="trace" {...props}/>
)

Trace.displayName = "Trace"

const TraceList = React.forwardRef(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    )}
    {...props}/>
))

TraceList.displayName = "TraceList"

const TraceItem = React.forwardRef(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}/>
))

TraceItem.displayName = "TraceItem"

const TraceLink = React.forwardRef(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    (<Comp
      ref={ref}
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}/>)
  );
})

TraceLink.displayName = "TraceLink"

const TracePage = React.forwardRef(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props}/>
))

TracePage.displayName = "TracePage"

const TraceSeparator = ({
  children,
  className,
  ...props
}) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className)}
    {...props}>
    {children ?? <ChevronRight/>}
  </li>
)

TraceSeparator.displayName = "TraceSeparator"

const TraceEllipsis = ({
  className,
  ...props
}) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}>
    <MoreHorizontal className="h-4 w-4"/>
    <span className="sr-only">More</span>
  </span>
)

TraceEllipsis.displayName = "TraceEllipsis"

export { Trace, TraceList, TraceItem, TraceLink, TracePage, TraceSeparator, TraceEllipsis }