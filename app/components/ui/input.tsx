import * as React from "react";

import { cn } from "~/lib/utils";
import { ErrorMessage } from "./error-message";
import { Label } from "./label";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const InputWithLabel = React.forwardRef<
  HTMLInputElement,
  InputProps & { label: string; error?: React.ReactNode; description?: string }
>(({ label, error, description, ...props }, ref) => {
  return (
    <div className="grid w-full items-center gap-2">
      <Label htmlFor={props.id}>{label}</Label>
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
      <Input
        {...props}
        ref={ref}
        type={props.type}
        name={props.name}
        id={props.id}
        placeholder={props.placeholder}
      />
      {error ? <ErrorMessage message={error} /> : null}
    </div>
  );
});
InputWithLabel.displayName = "InputWithLabel";

export { Input, InputWithLabel };
