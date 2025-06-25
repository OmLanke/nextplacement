import type * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-12 w-full min-w-0 rounded-xl border-2 bg-transparent px-4 py-3 text-base shadow-md shadow-black/5 transition-all duration-200 outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm backdrop-blur-sm",
        "focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:ring-4 focus-visible:shadow-lg focus-visible:shadow-primary/10",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "hover:border-border/80 hover:shadow-lg",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
