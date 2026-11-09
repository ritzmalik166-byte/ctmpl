"use client";

import { useCallback, useRef, useState } from "react";
import { gatewayCopy } from "../constants/gateway.constants";
import { useGatewayAnimation } from "../animations/Gateway.Animation";

/**
 * Welcome gateway: a creased paper sheet greets the visitor, then is crumpled
 * into a ball and tossed away to reveal the site.
 *
 * Server-rendered as a plain paper-coloured cover so the page never flashes
 * underneath; the 3D sheet fades in on top once ready. Hidden for visitors who
 * prefer reduced motion, and a CSS failsafe removes it if JavaScript never runs.
 */
function Gateway() {
  const [isDone, setIsDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onComplete = useCallback(() => setIsDone(true), []);
  useGatewayAnimation({ rootRef, backdropRef, canvasRef, onComplete });

  if (isDone) return null;

  return (
    <div
      ref={rootRef}
      className="gateway-failsafe fixed inset-0 z-100 cursor-pointer motion-reduce:hidden"
      role="dialog"
      aria-label="Welcome"
    >
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-[radial-gradient(circle_at_45%_42%,#f8ecd6_0%,#f0debe_55%,#e2cba5_100%)]"
      />
      <canvas ref={canvasRef} className="invisible absolute inset-0 size-full" aria-hidden="true" />

      {/* The welcome is painted into the 3D paper; this keeps it readable for assistive tech */}
      <p className="sr-only">
        {gatewayCopy.headline.map((line) => line.map((part) => part.text).join("")).join(" ")}
        {` ${gatewayCopy.subline}`}
      </p>
    </div>
  );
}

export default Gateway;
