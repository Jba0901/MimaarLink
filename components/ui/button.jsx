import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-[color,background-color,border-color,box-shadow,opacity] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-55 disabled:shadow-none disabled:saturate-50 aria-[busy=true]:cursor-wait [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        brand:
          "border border-transparent bg-[var(--ml-accent)] text-[var(--ml-on-accent)] hover:bg-[var(--ml-accent-hover)] focus-visible:ring-[#009F91]/35",
        navy:
          "border border-transparent bg-[#152B54] text-white shadow-sm shadow-[#152B54]/20 hover:bg-[#152B54]/90 focus-visible:ring-[#009F91]/35 dark:border-[#009F91]/25 dark:hover:bg-[#142A44]",
        destructive:
          "bg-[#B5462B] text-white shadow-sm hover:bg-[#B5462B]/90 focus-visible:ring-[#B5462B]/35",
        destructiveOutline:
          "border border-[#B5462B]/35 bg-card text-[#B5462B] shadow-sm hover:border-[#B5462B]/55 hover:bg-[#B5462B]/10 hover:text-[#B5462B] focus-visible:ring-[#B5462B]/35",
        destructiveGhost:
          "text-[#B5462B] hover:bg-[#B5462B]/10 hover:text-[#B5462B] focus-visible:ring-[#B5462B]/35",
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
