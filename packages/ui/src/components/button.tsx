import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@workspace/ui/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring hover:scale-105 active:scale-95 transform-gpu",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/85 hover:shadow-xl hover:shadow-primary/35',
        destructive:
          'bg-destructive text-destructive-foreground shadow-lg shadow-destructive/25 hover:bg-destructive/85 hover:shadow-xl hover:shadow-destructive/35',
        outline:
          'border-2 border-primary/20 bg-background hover:bg-primary/5 hover:text-primary hover:border-primary/40 shadow-md hover:shadow-lg hover:shadow-primary/15',
        secondary:
          'bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/80 hover:shadow-lg',
        ghost: 'hover:bg-primary/10 hover:text-primary hover:shadow-md hover:shadow-primary/10',
        link: 'text-primary underline-offset-4 hover:underline hover:text-accent p-0 h-auto font-normal hover:scale-100 active:scale-100',
        accent:
          'bg-accent text-accent-foreground shadow-lg shadow-accent/25 hover:bg-accent/85 hover:shadow-xl hover:shadow-accent/35',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-lg px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
