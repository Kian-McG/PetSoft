import { cn } from "@/lib/utils";
import React from "react";

type ContentBlockProps = {
  children: React.ReactNode;
  className?: string;
};
const ContentBlock = ({ children, className }: ContentBlockProps) => {
  return (
    <div
      className={cn(
        "bg-[#f7f8fa] shadow-sm overflow-hidden h-full w-full rounded-lg",
        className
      )}
    >
      {children}
    </div>
  );
};

export default ContentBlock;
