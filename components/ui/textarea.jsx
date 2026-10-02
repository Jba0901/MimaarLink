import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-24 w-full resize-y rounded-xl border border-input bg-card px-3.5 py-2.5 text-base leading-6 transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground/55 hover:border-[#009F91]/45 focus-visible:border-[#009F91]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009F91]/25 disabled:cursor-not-allowed disabled:bg-muted/60 disabled:opacity-60 aria-[invalid=true]:border-[#B5462B] aria-[invalid=true]:hover:border-[#B5462B] aria-[invalid=true]:focus-visible:border-[#B5462B] aria-[invalid=true]:focus-visible:ring-[#B5462B]/25 md:text-sm [@media(pointer:coarse)]:!text-base",
        className
      )}
      ref={ref}
      {...props} />
  );
})
Textarea.displayName = "Textarea"

export { Textarea }
