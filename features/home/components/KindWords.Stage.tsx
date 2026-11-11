"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/** The water cooler corner is drawn on the 1440 frame; the room spans y 377–1108 of the section. */
export const ROOM = { width: 1440, height: 731 } as const;

/**
 * The part of the room shown below desktop (x and width in px of the 1440
 * room), so Arjun stays a good size: phones show him and the cooler, tablets
 * add the notice board, laptops the whole room.
 */
function cropFor(width: number) {
  if (width < 640) return { x: 120, width: 720 };
  if (width < 1024) return { x: 90, width: 1150 };
  return { x: 0, width: ROOM.width };
}

/**
 * The room's stage. Everything in the room (Arjun, the cooler's bubbles, the
 * sticky notes) is placed and animated in px of the 1440 room, so below
 * desktop the stage scales that whole room to the screen's width as one piece
 * (showing the part of it set by `cropFor`), and every animation stays as
 * designed. From xl up the room is drawn 1:1 at its Figma place (y 377).
 */
export function RoomStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(375);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const crop = cropFor(width);
  const scale = width / crop.width;
  const vars = {
    "--room-h": `${ROOM.height * scale}px`,
    "--room-t": `scale(${scale}) translateX(${-crop.x}px)`,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      style={vars}
      className="relative h-(--room-h) w-full overflow-hidden xl:absolute xl:top-[377px] xl:left-0 xl:h-[731px] xl:w-[1440px] xl:overflow-visible"
    >
      <div className="absolute top-0 left-0 h-[731px] w-[1440px] origin-top-left transform-(--room-t) xl:transform-none">{children}</div>
    </div>
  );
}
