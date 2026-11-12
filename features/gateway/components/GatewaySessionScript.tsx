import { GATEWAY_SEEN_KEY } from "../constants/gateway.constants";

/**
 * Runs before the page is painted: if the welcome gateway has already played
 * this browser session, marks the page so the gateway's paper cover is never
 * drawn (no flash on reload). Lives in the root layout, so it also works when
 * the home page is reached from another page.
 */
export function GatewaySessionScript() {
  const script = `try{if(sessionStorage.getItem(${JSON.stringify(GATEWAY_SEEN_KEY)})!==null)document.documentElement.dataset.gateway="done"}catch(e){}`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
