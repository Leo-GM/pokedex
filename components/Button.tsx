import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

const base =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-red-700 text-white hover:bg-red-800",
  secondary:
    "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800",
};

export function Button({ variant = "primary", className = "", type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={`${base} ${variants[variant]} ${className}`} {...rest} />;
}
