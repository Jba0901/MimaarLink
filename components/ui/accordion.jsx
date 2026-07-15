"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-[border-color,box-shadow] data-[state=open]:border-[#00B59E]/40",
      className
    )}
    {...props} />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "group tap-highlight flex min-h-[68px] flex-1 items-center justify-between gap-3 px-5 py-4 text-start text-[14.5px] font-bold leading-snug text-navy transition-colors hover:bg-secondary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#00B59E]/35 sm:px-6 sm:py-5 [&[data-state=open]_.accordion-chevron]:rotate-180 [&[data-state=open]_.accordion-icon]:bg-[#00B59E] [&[data-state=open]_.accordion-icon]:text-[#152B54]",
        className
      )}
      {...props}>
      {children}
      <span className="accordion-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-navy transition-colors dark:bg-white/[0.08]">
        <ChevronDown
          className="accordion-chevron h-4 w-4 transition-transform duration-200" />
      </span>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}>
    <div className={cn("px-5 pb-5 text-[13.5px] leading-6 text-muted-foreground sm:px-6", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
