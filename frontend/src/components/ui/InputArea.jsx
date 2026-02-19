import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-border dark:border-dark-border bg-background dark:bg-dark-background px-3 py-2 text-base ring-offset-background dark:ring-offset-dark-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground dark:file:text-dark-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 dark:focus-visible:ring-red-00 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className
      )}
      ref={ref}
      {...props}/>
  );
});

Input.displayName = 'Input';

export { Input };