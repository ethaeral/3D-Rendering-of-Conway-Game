import React from "react";
import { Label } from "./ui/label";
import { Switch as ShadcnSwitch } from "./ui/switch";
import { cn } from "../lib/utils";

interface SwitchProps {
  id?: string;
  cb: (value: boolean) => void;
  state: boolean;
  title: string;
  checked?: boolean;
  className?: string;
}

export function Switch({
  id,
  cb,
  state,
  title,
  checked,
  className,
}: SwitchProps) {
  const switchId = id ?? `switch-${title.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div
      className={cn("flex items-center space-x-2 cursor-pointer", className)}
      onClick={() => cb(!state)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          cb(!state);
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={state}
    >
      <ShadcnSwitch
        id={switchId}
        checked={state}
        onCheckedChange={cb}
        onClick={(e) => e.stopPropagation()}
      />
      <Label htmlFor={switchId} className="cursor-pointer text-xs">
        {title}
      </Label>
    </div>
  );
}
