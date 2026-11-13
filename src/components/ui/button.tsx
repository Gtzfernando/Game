import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, isLoading, variant = "primary", disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-organic font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-moss-light disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]";
    const variants = {
      primary:
        "bg-moss text-white shadow-warm hover:bg-moss-light hover:shadow-lg",
      secondary:
        "bg-ivory text-foreground border border-moss/20 shadow-warm hover:bg-cream hover:border-moss/40",
      danger:
        "bg-terracotta text-white shadow-warm hover:bg-terracotta/90 hover:shadow-lg",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? "Cargando..." : children}
      </button>
    );
  }
);

Button.displayName = "Button";
