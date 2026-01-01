import React from 'react';
import { cn } from "../../lib/utils";

const Button = React.forwardRef(({ className, variant = "primary", size = "default", ...props }, ref) => {
    const variants = {
        primary: "bg-brass hover:bg-brass-glow text-obsidian font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] border border-brass-light",
        secondary: "bg-stone-dark hover:bg-stone text-ink-primary border border-stone-light/30 hover:border-brass/50",
        danger: "bg-blood/80 hover:bg-blood text-white border border-blood hover:border-red-500 shadow-[0_0_15px_rgba(136,8,8,0.3)]",
        ghost: "bg-transparent hover:bg-white/5 text-brass hover:text-brass-glow border border-transparent hover:border-brass/20",
        cathedral: "bg-black/80 border-2 border-brass/60 text-brass font-serif font-semibold uppercase tracking-widest hover:bg-brass hover:text-black hover:border-brass shadow-[0_0_20px_rgba(0,0,0,0.8)]"
    };

    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-lg",
        icon: "h-10 w-10 p-0 flex items-center justify-center",
    };

    return (
        <button
            ref={ref}
            className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass disabled:pointer-events-none disabled:opacity-50",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
});

Button.displayName = "Button";

export { Button };
