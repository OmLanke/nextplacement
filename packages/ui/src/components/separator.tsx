"use client"

import type * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@workspace/ui/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-gradient-to-r from-transparent via-border to-transparent shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px data-[orientation=vertical]:bg-gradient-to-b",
        className,
      )}
      {...props}
    />
  )
}

export { Separator }
