
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  className?: string;
}

export const LoadingSpinner = ({ size = 24, className, ...props }: LoadingSpinnerProps) => {
  return (
    <div className={cn("flex justify-center items-center", className)} {...props}>
      <Loader2 className={cn("animate-spin text-primary")} size={size} />
    </div>
  );
};
