"use client";
import { useEffect, useState } from "react"
import { CheckCircle2, Info, Loader2, TriangleAlert } from "lucide-react"
import { Toaster as Sonner } from "sonner"

const Toaster = ({
  ...props
}) => {
  const [theme, setTheme] = useState("light")
  const { toastOptions, ...toasterProps } = props

  useEffect(() => {
    const root = document.documentElement
    const syncTheme = () => setTheme(root.classList.contains("dark") ? "dark" : "light")
    syncTheme()
    const observer = new MutationObserver(syncTheme)
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  const baseClassNames = {
    toast: "group toast !rounded-2xl !border !border-border !bg-card !text-foreground !shadow-lift",
    title: "!font-bold !text-navy",
    description: "!text-muted-foreground",
    content: "!gap-1",
    success: "!border-[#00B59E]/45 !bg-[#D0F2EE] dark:!bg-[#142A44]",
    error: "!border-[#EF4444]/45 !bg-card",
    warning: "!border-[#FFB638]/55 !bg-[#FFB638]/10",
    info: "!border-[#152B54]/30 !bg-card",
    loading: "!border-[#00B59E]/35 !bg-card",
    actionButton: "!h-11 !rounded-xl !bg-[#152B54] !px-4 !text-white",
    cancelButton: "!h-11 !rounded-xl !border !border-border !bg-card !px-4 !text-navy",
  }

  return (
    <Sonner
      {...toasterProps}
      theme={theme}
      richColors={false}
      position="top-center"
      visibleToasts={3}
      duration={3500}
      gap={8}
      offset={{ top: 76 }}
      mobileOffset={{ top: 72, left: 12, right: 12 }}
      dir="auto"
      className="toaster group"
      icons={{
        success: <CheckCircle2 className="h-5 w-5 text-[#152B54] dark:text-[#00B59E]" />,
        error: <TriangleAlert className="h-5 w-5 text-[#EF4444]" />,
        warning: <TriangleAlert className="h-5 w-5 text-[#FFB638]" />,
        info: <Info className="h-5 w-5 text-[#152B54] dark:text-[#00B59E]" />,
        loading: <Loader2 className="h-5 w-5 animate-spin text-[#00B59E]" />,
      }}
      toastOptions={{
        ...toastOptions,
        classNames: {
          ...baseClassNames,
          ...toastOptions?.classNames,
        },
      }} />
  );
}

export { Toaster }
