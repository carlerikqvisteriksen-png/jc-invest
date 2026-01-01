import React from 'react';
import { cn } from "../../lib/utils";

const Card = React.forwardRef(({ className, variant = "glass", ...props }, ref) => {
    const variants = {
        glass: "bg-obsidian/70 backdrop-blur-md border border-white/10 shadow-xl",
        velvet: "bg-stone-dark/90 backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden",
        cathedral: "bg-obsidian/80 backdrop-blur-md border-x border-t border-brass/20 rounded-t-[60px] rounded-b-lg shadow-[0_0_30px_rgba(0,0,0,0.5)]",
        elevated: "bg-stone-900 border border-brass/30 shadow-[0_0_20px_rgba(212,175,55,0.1)]",
    };

    return (
        <div
            ref={ref}
            className={cn(
                "rounded-lg text-ink-primary p-6",
                variants[variant],
                className
            )}
            {...props}
        />
    );
});
Card.displayName = "Card";

export { Card };
