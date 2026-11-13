import * as React from "react";

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className = "", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`rounded-organic bg-ivory shadow-warm p-6 border border-moss/10 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";
