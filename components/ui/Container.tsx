import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils/cn";

type ContainerProps<T extends ElementType> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;

/**
 * The site's centered 1237px content column (see `site-container` in
 * globals.css). Full-bleed backgrounds sit outside it; content sits inside.
 */
function Container<T extends ElementType = "div">({
  as,
  className,
  ...props
}: ContainerProps<T>) {
  const Component = as ?? "div";
  return <Component className={cn("site-container", className)} {...props} />;
}

export default Container;
