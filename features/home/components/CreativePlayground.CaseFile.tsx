import Image from "next/image";
import {
  caseFileLabels,
  caseFilePhoto,
  caseFileSheet,
  caseFileStamp,
  INITIAL_CASE,
  playgroundCases,
  type PlaygroundCase,
} from "../constants/creativePlayground.constants";
import caseFolder from "@/public/images/website/home/creative-playground/case-file/folder-empty.png";
import paperBlank from "@/public/images/website/home/creative-playground/case-file/paper-blank.png";
import paperclip from "@/public/images/website/home/creative-playground/case-file/paperclip.png";
import stampApproved from "@/public/images/website/home/creative-playground/case-file/stamp-approved.png";

/** px of the 670 × 413 case-file artwork → % of it. */
const fileX = (px: number) => `${(px / 670) * 100}%`;
const fileY = (px: number) => `${(px / 413) * 100}%`;
const box = ({ left, top, width, height }: { left: number; top: number; width: number; height: number }) => ({
  left: fileX(left),
  top: fileY(top),
  width: fileX(width),
  height: fileY(height),
});

/** The typed sheet of one case (sits on the right of the open folder): the fields (a value may run onto a second line), then the brief. */
function CaseSheet({ index, file }: { index: number; file: PlaygroundCase["file"] }) {
  const fields = [
    [caseFileLabels.client, file.client],
    [caseFileLabels.campaign, file.campaign],
    [caseFileLabels.services, file.services],
  ];
  return (
    <div data-sheet={index} className="absolute" style={{ ...box(caseFileSheet), opacity: index === INITIAL_CASE ? 1 : 0 }}>
      <Image src={paperBlank} alt="" fill sizes="22.3vw" className="pointer-events-none" />
      <div className="absolute inset-x-[27px] top-[28px] font-typewriter">
        <p className="text-[9.5px] leading-none font-bold tracking-[1.9px] whitespace-nowrap text-[#a17351] uppercase">{caseFileLabels.title}</p>
        <dl className="mt-[38px] grid grid-cols-[81px_1fr] gap-y-[11px]">
          {fields.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="pt-[2px] text-[9.5px] leading-none font-bold tracking-[1.2px] text-[#625d58] uppercase">{label}</dt>
              <dd className="text-[12px] leading-[1.3] text-[#3f3b38]">{value}</dd>
            </div>
          ))}
        </dl>
        {/* the brief, typed out underneath */}
        <p className="mt-[18px] text-[9.5px] leading-none font-bold tracking-[1.2px] text-[#625d58] uppercase">{caseFileLabels.brief}</p>
        <p className="mt-[8px] text-[11px] leading-[1.5] text-[#3f3b38]">{file.brief}</p>
      </div>
    </div>
  );
}

/**
 * The open case file on the desk (670 × 413): the folder, the client's photo
 * clipped in a polaroid on the left, the typed sheet on the right and the
 * APPROVED stamp. Every case's photo and sheet are here; the open case's show.
 */
export function CaseFile() {
  return (
    <div data-file="folder" className="absolute top-[474px] left-[513px] h-[413px] w-[670px]">
      <Image src={caseFolder} alt="" fill sizes="46.6vw" className="pointer-events-none" />

      {/* the photo, in the polaroid */}
      <div className="absolute overflow-hidden" style={{ ...box(caseFilePhoto), rotate: `${caseFilePhoto.rotate}deg` }}>
        {playgroundCases.map(({ client, cover }, i) => (
          <div key={client} data-cover={i} className="absolute inset-0" style={{ opacity: i === INITIAL_CASE ? 1 : 0 }}>
            <Image src={cover} alt={`${client} campaign artwork`} fill sizes="18.8vw" className="pointer-events-none object-cover" />
          </div>
        ))}
      </div>
      <Image src={paperclip} alt="" fill sizes="46.6vw" className="pointer-events-none" />

      {/* the typed sheet */}
      {playgroundCases.map(({ client, file }, i) => (
        <CaseSheet key={client} index={i} file={file} />
      ))}

      {/* APPROVED, stamped on each new file */}
      <div data-file="stamp" className="absolute" style={box(caseFileStamp)}>
        <Image src={stampApproved} alt="Approved" fill sizes="14.9vw" className="pointer-events-none" />
      </div>
    </div>
  );
}
