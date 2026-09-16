import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/utils/cn';

const sectionHeadingVariants = cva('space-y-3', {
  variants: {
    align: {
      left: 'text-left items-start',
      center: 'text-center items-center mx-auto',
      right: 'text-right items-end ml-auto',
    },
    size: {
      default: 'max-w-2xl',
      wide: 'max-w-4xl',
      full: 'max-w-full',
    },
  },
  defaultVariants: {
    align: 'left',
    size: 'default',
  },
});

export interface SectionHeadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sectionHeadingVariants> {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
}

const SectionHeading = React.forwardRef<HTMLDivElement, SectionHeadingProps>(
  ({ className, align, size, eyebrow, title, highlight, description, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(sectionHeadingVariants({ align, size, className }))}
        {...props}
      >
        {/* Eyebrow Badge */}
        {eyebrow && (
          <div
            className={cn(
              'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF1E27]/10 border border-[#FF1E27]/25 text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF1E27] mb-2',
              align === 'center' && 'mx-auto'
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF1E27] shadow-[0_0_8px_#FF1E27]" />
            {eyebrow}
          </div>
        )}

        {/* Main Title with optional Red Highlight */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-white leading-[1.05]">
          {title}{' '}
          {highlight && (
            <span className="text-[#FF1E27] inline-block drop-shadow-[0_0_20px_rgba(255,30,39,0.35)]">
              {highlight}
            </span>
          )}
        </h2>

        {/* Description Copy */}
        {description && (
          <p className="text-base sm:text-lg text-[#A1A1A6] font-normal leading-relaxed">
            {description}
          </p>
        )}

        {children}
      </div>
    );
  }
);
SectionHeading.displayName = 'SectionHeading';

export { SectionHeading, sectionHeadingVariants };
