"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CheckIcon, OctagonXIcon, Loader2Icon, InfoIcon, TriangleAlertIcon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="bottom-right"
      icons={{
        success: <CheckIcon className="size-3 text-[#00ff9d]" />,
        error: <OctagonXIcon className="size-3 text-[#ff4545]" />,
        info: <InfoIcon className="size-3 text-[#00d4ff]" />,
        warning: <TriangleAlertIcon className="size-3 text-[#ffb800]" />,
        loading: <Loader2Icon className="size-3 animate-spin text-[#3d4f60]" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: [
            "flex items-center gap-2.5 w-full",
            "border border-[#1c2232] bg-[#0c0e18]",
            "px-3.5 py-2.5",
            "font-mono text-[11px] text-[#c9d5e0] tracking-wide",
            "shadow-[0_0_24px_rgba(0,0,0,0.6)]",
          ].join(" "),
          title: "font-mono text-[11px] text-[#c9d5e0]",
          description: "font-mono text-[10px] text-[#3d4f60] mt-0.5",
          success: "border-[#00ff9d]/20",
          error: "border-[#ff4545]/20",
          info: "border-[#00d4ff]/20",
          warning: "border-[#ffb800]/20",
          icon: "shrink-0",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
