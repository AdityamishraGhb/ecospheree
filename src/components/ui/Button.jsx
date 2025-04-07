'use client';

import React from 'react';
import Link from 'next/link';
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
        outline:
          "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800",
        secondary:
          "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
        ghost:
          "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
        link:
          "bg-transparent text-green-600 underline-offset-4 hover:underline dark:text-green-500",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({
  className,
  variant,
  size,
  asChild = false,
  href,
  children,
  ...props
}, ref) => {
  if (asChild) {
    return (
      <slot className={`${buttonVariants({ variant, size, className })}`} ref={ref} {...props}>
        {children}
      </slot>
    );
  }

  if (href) {
    return (
      <Link 
        href={href} 
        className={`${buttonVariants({ variant, size, className })}`} 
        ref={ref} 
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button 
      className={`${buttonVariants({ variant, size, className })}`} 
      ref={ref} 
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button; 