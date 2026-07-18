import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold leading-tight ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-[#00B59E]/35 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#152B54] text-white hover:bg-[#152B54]/90 dark:border-[#00B59E]/25 dark:bg-[#142A44] dark:text-[#F8FAFC] dark:hover:bg-[#142A44]/90",
        success:
          "border-transparent bg-[#00B59E] text-[#152B54] hover:bg-[#00B59E]/90 dark:border-[#00B59E]/40 dark:bg-[#00B59E]/15 dark:text-[#00B59E] dark:hover:bg-[#00B59E]/20",
        warning:
          "border-transparent bg-[#FFB638] text-[#152B54] hover:bg-[#FFB638]/90 dark:border-[#FFB638]/45 dark:bg-[#FFB638]/15 dark:text-[#FFB638] dark:hover:bg-[#FFB638]/20",
        info:
          "border-transparent bg-[#D0F2EE] text-[#152B54] hover:bg-[#D0F2EE]/80 dark:border-[#00B59E]/35 dark:bg-[#00B59E]/15 dark:text-[#00B59E] dark:hover:bg-[#00B59E]/20",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-[#EF4444] text-white hover:bg-[#EF4444]/90 dark:border-[#EF4444]/45 dark:bg-[#EF4444]/20 dark:text-[#F8FAFC] dark:hover:bg-[#EF4444]/25",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }
