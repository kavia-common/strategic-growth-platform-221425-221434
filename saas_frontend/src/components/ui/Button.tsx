'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link' | 'default';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon' | 'default';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'full' | 'default';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
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
    fullWidth = false,
    rounded = 'md',
    shadow = 'md',
    ...props 
  }, ref) => {
    
    // Normalize defaults
    const activeVariant = variant === 'default' ? 'primary' : variant;
    const activeSize = size === 'default' ? 'md' : size;
    const activeRounded = rounded === 'default' ? 'md' : rounded;

    const baseStyles = cn(
      "inline-flex items-center justify-center font-medium transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-primary] focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "active:scale-[0.98]",
      "select-none",
      fullWidth && "w-full"
    );
    
    // Rounded styles
    const roundedStyles = {
      sm: "rounded",
      md: "rounded-lg",
      lg: "rounded-xl",
      full: "rounded-full",
    };

    // Shadow styles
    const shadowStyles = {
      none: "shadow-none",
      sm: "shadow-sm hover:shadow",
      md: "shadow-md hover:shadow-lg",
      lg: "shadow-lg hover:shadow-xl",
    };

    const variants = {
      primary: cn(
        "bg-[--color-primary] text-white border border-[--color-primary]/90",
        "hover:bg-[--color-primary]/90 hover:shadow-[--color-primary]/20",
        "active:bg-[--color-primary]/80",
        shadowStyles[shadow]
      ),
      secondary: cn(
        "bg-gradient-to-b from-gray-50 to-white text-gray-800 border border-gray-200/80",
        "hover:from-gray-100 hover:to-gray-50 hover:border-gray-300",
        "active:from-gray-200 active:to-gray-100",
        shadowStyles[shadow],
        "shadow-gray-200/50"
      ),
      outline: cn(
        "bg-transparent text-gray-700 border border-gray-300",
        "hover:bg-gray-50/80 hover:text-gray-900 hover:border-gray-400",
        "active:bg-gray-100",
        shadowStyles[shadow] === 'none' ? 'shadow-none' : 'shadow-sm'
      ),
      ghost: cn(
        "bg-transparent text-gray-600 hover:bg-gray-100/80 hover:text-gray-900",
        "active:bg-gray-200/60",
        "shadow-none border border-transparent"
      ),
      destructive: cn(
        "bg-gradient-to-b from-red-600 to-red-500 text-white border border-red-600",
        "hover:from-red-700 hover:to-red-600 hover:border-red-700",
        "active:from-red-800 active:to-red-700",
        shadowStyles[shadow],
        "shadow-red-200/50"
      ),
      link: cn(
        "text-[--color-primary] hover:text-[--color-primary]/80 underline-offset-4",
        "hover:underline shadow-none bg-transparent border-none p-0 h-auto",
        "active:scale-100"
      ),
    };

    const sizes = {
      xs: "h-7 px-2.5 text-xs gap-1.5",
      sm: "h-8 px-3.5 text-sm gap-2",
      md: "h-10 px-4.5 text-sm gap-2.5",
      lg: "h-12 px-5 text-base gap-3",
      xl: "h-14 px-6 text-lg gap-3.5",
      icon: {
        xs: "h-7 w-7",
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-14 w-14",
      },
    };

    // Determine if it's an icon-only button
    const isIconOnly = (!children && !isLoading) || (activeSize === 'icon');
    
    // Get size class
    const sizeClass = isIconOnly 
      ? sizes.icon[activeSize === 'icon' ? 'md' : activeSize] || sizes.icon.md
      : sizes[activeSize];

    // Get icon size based on button size
    const getIconSize = () => {
      if (activeSize === 'xs') return 12;
      if (activeSize === 'sm') return 14;
      if (activeSize === 'md') return 16;
      if (activeSize === 'lg') return 18;
      if (activeSize === 'xl') return 20;
      return 16;
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          roundedStyles[activeRounded],
          variants[activeVariant],
          sizeClass,
          !isIconOnly && "[&>svg]:shrink-0",
          activeVariant !== 'link' && "min-w-[2rem]",
          className
        )}
        disabled={isLoading || disabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 
              className={cn(
                "animate-spin", 
                children && "mr-2"
              )} 
              size={getIconSize()} 
            />
            {children}
          </>
        ) : (
          <>
            {leftIcon && (
              <span className={cn(
                "inline-flex shrink-0 items-center",
                children && "mr-2"
              )}>
                {React.isValidElement(leftIcon) 
                  ? React.cloneElement(leftIcon as React.ReactElement<{ className?: string; size?: number }>, {
                      size: getIconSize(),
                      className: cn(
                        "shrink-0",
                        (leftIcon as React.ReactElement<{ className?: string; size?: number }>).props.className
                      )
                    })
                  : leftIcon}
              </span>
            )}
            
            {children && <span className="truncate">{children}</span>}
            
            {rightIcon && (
              <span className={cn(
                "inline-flex shrink-0 items-center",
                children && "ml-2"
              )}>
                {React.isValidElement(rightIcon) 
                  ? React.cloneElement(rightIcon as React.ReactElement<{ className?: string; size?: number }>, {
                      size: getIconSize(),
                      className: cn(
                        "shrink-0",
                        (rightIcon as React.ReactElement<{ className?: string; size?: number }>).props.className
                      )
                    })
                  : rightIcon}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };