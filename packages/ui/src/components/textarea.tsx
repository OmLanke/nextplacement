import type * as React from 'react';

import { cn } from '@workspace/ui/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/20 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-20 w-full rounded-md border-2 bg-transparent px-4 py-3 text-base shadow-md shadow-black/5 transition-all duration-200 outline-none focus-visible:ring-4 focus-visible:shadow-lg focus-visible:shadow-primary/10 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm backdrop-blur-sm hover:border-border/80 hover:shadow-lg resize-none',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
