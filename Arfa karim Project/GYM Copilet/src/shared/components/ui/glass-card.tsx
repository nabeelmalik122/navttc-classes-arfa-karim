import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/utils/cn';

const glassCardVariants = cva(
  'rounded-2xl transition-all duration-300 relative overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'bg-[#0B0B0E]/80 backdrop-blur-2xl border border-white/8 shadow-[0_8px_32px_rgba(0,0,0,0.6)]',
        solid:
          'bg-[#121217] border border-[#22222B] shadow-md',
        redGlow:
          'bg-[#121217]/90 backdrop-blur-2xl border border-[#FF1E27]/35 shadow-[0_0_30px_rgba(255,30,39,0.15)] hover:border-[#FF1E27]/60 hover:shadow-[0_0_40px_rgba(255,30,39,0.25)]',
        interactive:
          'bg-[#0B0B0E]/75 backdrop-blur-xl border border-white/8 hover:border-white/20 hover:bg-[#121217]/90 hover:scale-[1.01] hover:shadow-[0_16px_40px_rgba(0,0,0,0.8)] cursor-pointer',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  }
);

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {
  spotlight?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant, padding, spotlight = false, children, ...props }, ref) => {
    const cardRef = React.useRef<HTMLDivElement | null>(null);
    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!spotlight || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    return (
      <div
        ref={(node) => {
          cardRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(glassCardVariants({ variant, padding, className }))}
        {...props}
      >
        {/* Specular Top Rim Lighting */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

        {/* Optional Interactive Cursor Spotlight */}
        {spotlight && isHovered && (
          <div
            className="absolute -inset-px pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 30, 39, 0.12), transparent 70%)`,
            }}
          />
        )}

        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);
GlassCard.displayName = 'GlassCard';

export { GlassCard, glassCardVariants };
