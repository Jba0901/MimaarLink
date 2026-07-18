import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-[#EF4444] text-white shadow-sm hover:bg-[#EF4444]/90 focus-visible:ring-[#EF4444]/35",
        destructiveOutline:
          "border border-[#EF4444]/35 bg-card text-[#EF4444] shadow-sm hover:border-[#EF4444]/55 hover:bg-[#EF4444]/10 hover:text-[#EF4444] focus-visible:ring-[#EF4444]/35",
        destructiveGhost:
          "text-[#EF4444] hover:bg-[#EF4444]/10 hover:text-[#EF4444] focus-visible:ring-[#EF4444]/35",
        outline:
          "border border-input bg-background text-primary shadow-sm hover:border-primary/25 hover:bg-secondary hover:text-primary",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-11 px-3 text-xs",
        lg: "h-12 px-8",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
