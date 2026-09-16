import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/utils/cn';

const containerVariants = cva('mx-auto w-full px-4 sm:px-6 lg:px-8', {
  variants: {
    size: {
      sm: 'max-w-xl',
      md: 'max-w-3xl',
      lg: 'max-w-5xl',
      xl: 'max-w-7xl',
      '2xl': 'max-w-[1320px]',
      full: 'max-w-full',
    },
  },
  defaultVariants: {
    size: '2xl',
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  as?: React.ElementType;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, as: Component = 'div', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(containerVariants({ size, className }))}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Container.displayName = 'Container';

export { Container, containerVariants };
