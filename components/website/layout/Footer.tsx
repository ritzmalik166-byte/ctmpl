import { BoardFooter } from "./Footer.Board";

/**
 * The site footer: the studio's pinboard (Footer.Board.tsx, Figma 211:1226).
 * The previous café footer is kept as a backup in Footer.Cafe.tsx: render
 * <CafeFooter /> (from "./Footer.Cafe") here instead to bring it back.
 */
function Footer() {
  return <BoardFooter />;
}

export default Footer;
