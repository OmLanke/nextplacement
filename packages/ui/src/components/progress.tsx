'use client';

import type * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@workspace/ui/lib/utils';

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        'bg-primary/20 relative h-3 w-full overflow-hidden rounded-full shadow-inner backdrop-blur-sm border border-primary/10',
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-gradient-to-r from-accent to-primary h-full w-full flex-1 transition-all duration-500 ease-out rounded-full shadow-sm"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
