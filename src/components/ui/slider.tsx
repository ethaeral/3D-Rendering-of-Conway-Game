import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../lib/utils";

export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, orientation, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    orientation={orientation}
    className={cn(
      "relative flex touch-none select-none items-center",
      orientation === "vertical"
        ? "h-full w-auto flex-col"
        : "w-full flex-row",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        "relative overflow-hidden rounded-full bg-primary/20",
        orientation === "vertical"
          ? "h-full w-2"
          : "h-2 w-full"
      )}
    >
      <SliderPrimitive.Range
        className={cn(
          "absolute bg-primary",
          orientation === "vertical"
            ? "w-full left-0"
            : "h-full"
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[orientation=vertical]:translate-x-0 data-[orientation=vertical]:data-[state=checked]:-translate-y-4 data-[orientation=vertical]:data-[state=unchecked]:translate-y-0" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;
