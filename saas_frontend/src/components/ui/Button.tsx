import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link' | 'default'; // default mapped to primary for backward compat
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon' | 'default'; // default mapped to md
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading, 
    children, 
    leftIcon,
    rightIcon,
    disabled,
    ...props 
  }, ref) => {
    
    // Normalize defaults
    const activeVariant = variant === 'default' ? 'primary' : variant;
    const activeSize = size === 'default' ? 'md' : size;

    const baseStyles = cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium tracking-[-0.01em]",
      "transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-primary] focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-60",
      "active:translate-y-[1px]"
    );
    
    const variants = {
      primary: cn(
        "bg-[--color-primary] text-white shadow-md",
        "hover:brightness-110 hover:shadow-lg hover:ring-2 hover:ring-[--color-primary]/30",
        "border border-transparent"
      ),
      secondary: cn(
        "bg-white text-[--color-primary] border border-[--color-primary]/20 shadow-sm",
        "hover:bg-gray-50 hover:border-[--color-primary]/30"
      ),
      outline: cn(
        "bg-transparent border border-gray-200 text-gray-700 shadow-sm",
        "hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300"
      ),
      ghost: cn(
        "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        "border border-transparent shadow-none"
      ),
      destructive: cn(
        "bg-red-600 text-white shadow-sm",
        "hover:bg-red-700 hover:shadow-md"
      ),
      link: "text-[--color-primary] underline-offset-4 hover:underline shadow-none bg-transparent p-0 h-auto",
    };

    const sizes = {
      sm: "h-8 px-3 py-1.5 text-sm gap-1.5",
      md: "h-10 px-5 py-2.5 text-sm gap-2",
      lg: "h-12 px-6 py-3 text-base gap-2.5",
      xl: "h-14 px-7 py-3.5 text-lg gap-3",
      icon: "h-10 w-10 p-2",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[activeVariant],
          sizes[activeSize],
          // Automatic spacing for direct SVG children if not using explicit left/right props
          "[&>svg]:shrink-0 [&>svg]:pointer-events-none",
          "[&>svg:first-child:not(:last-child)]:mr-2", 
          "[&>svg:last-child:not(:first-child)]:ml-2",
          className
        )}
        disabled={isLoading || disabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className={cn("animate-spin", children ? "mr-2" : "")} size={activeSize === 'sm' ? 14 : 18} />
        )}
        
        {!isLoading && leftIcon && (
          <span className="mr-2 inline-flex shrink-0">{leftIcon}</span>
        )}
        
        {children}

        {!isLoading && rightIcon && (
          <span className="ml-2 inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
