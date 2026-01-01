import React from 'react';
import { cn } from "../../lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-10 w-full bg-transparent border-0 border-b-2 border-stone-600 px-3 py-2 text-sm text-white ring-offset-background placeholder:text-stone-400 focus:outline-none focus:border-brass focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-300",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = "Input";

export { Input };
