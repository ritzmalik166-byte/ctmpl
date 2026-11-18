"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useScrollPlane } from "../animations/ScrollPlane";

/**
 * The layer the scroll plane flies in (see useScrollPlane): laid over the
 * whole page (in the page's own coordinates, so the plane scrolls with it),
 * under the header, catching no clicks.
 */
function PlaneLayer() {
  const ref = useScrollPlane();
  return <div ref={ref} aria-hidden="true" className="pointer-events-none absolute top-0 left-0 z-40 h-0 w-full" />;
}

/** The scroll plane, drawn on the page's body (outside every section, so none clips it). */
export function ScrollPlane() {
  const [body, setBody] = useState<HTMLElement | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- the body is only there in the browser
  useEffect(() => setBody(document.body), []);
  return body ? createPortal(<PlaneLayer />, body) : null;
}
