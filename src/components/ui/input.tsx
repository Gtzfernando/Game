import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground-alt mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 bg-ivory/80 border rounded-organic focus:outline-none focus:ring-2 focus:ring-moss-light focus:border-moss transition-colors placeholder:text-foreground-alt/50 ${
            error ? "border-terracotta" : "border-moss/20"
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-terracotta">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
