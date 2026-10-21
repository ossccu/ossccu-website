import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

type AvatarRootProps = React.ComponentProps<typeof AvatarPrimitive.Root> & {
  className?: string;
};

function Avatar({ className, ...props }: AvatarRootProps) {
  return (
    <div
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
    >
      <AvatarPrimitive.Root
        data-slot="avatar"
        {...props}
      />
    </div>
  );
}

type AvatarImageProps = React.ComponentProps<typeof AvatarPrimitive.Image> & {
  className?: string;
};

function AvatarImage({ className, ...props }: AvatarImageProps) {
  const imageProps = {
    "data-slot": "avatar-image",
    className: cn("aspect-square size-full", className),
    ...props,
  };

  return React.createElement(AvatarPrimitive.Image, imageProps);
}

type AvatarFallbackProps = React.ComponentProps<
  typeof AvatarPrimitive.Fallback
> & {
  className?: string;
};

function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  const fallbackProps = {
    "data-slot": "avatar-fallback",
    className: cn(
      "bg-muted flex size-full items-center justify-center rounded-full",
      className
    ),
    ...props,
  };

  return React.createElement(AvatarPrimitive.Fallback, fallbackProps);
}

export { Avatar, AvatarImage, AvatarFallback };
