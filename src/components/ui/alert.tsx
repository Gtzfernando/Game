import * as React from "react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "error";
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ children, variant = "info", className = "", ...props }, ref) => {
    const variants = {
      info: "bg-sky-soft/40 text-foreground border-sky/30",
      success: "bg-moss-light/20 text-foreground border-moss/30",
      error: "bg-terracotta/10 text-foreground border-terracotta/30",
    };

    return (
      <div
        ref={ref}
        className={`p-4 rounded-organic border ${variants[variant]} ${className}`}
        role="alert"
        {...props}
      >
        {children}
      </div>
    );
  }
);

Alert.displayName = "Alert";
