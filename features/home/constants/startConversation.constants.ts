/** "Start a conversation" (Figma 75:315): book the meeting room. */
export const startConversationCopy = {
  label: "Start a conversation",
  heading: "The meeting room is free. Shall we book it?",
  intro: "Fill in the request and the sign on the door flips to yours. Someone from the team will call or write within a working day.",
  formTitle: "Meeting request",
  submit: "Book The Room",
  sending: "Booking the room…",
  /** The note clipped on once the request is taken in. */
  booked: {
    label: "Meeting request · received",
    title: "The room is yours!",
    message: "Thank you for your request. Our team will contact you shortly, within a working day.",
    signature: "— CTM reception",
    stamp: "Booked",
    another: "Send another request",
  },
};

export type BookingField = {
  name: string;
  label: string;
  type: "text" | "email";
  placeholder: string;
  required: boolean;
  autoComplete?: string;
};

/** The meeting request's fields, in order. */
export const bookingFields: BookingField[] = [
  { name: "name", label: "Your name", type: "text", placeholder: "e.g. Vikram Sharma", required: true, autoComplete: "name" },
  { name: "email", label: "Email", type: "email", placeholder: "e.g. vikram@company.com", required: true, autoComplete: "email" },
  { name: "project", label: "What are we making? (optional)", type: "text", placeholder: "e.g. A launch film, a rebrand, a campaign", required: false },
  { name: "idea", label: "Your idea", type: "text", placeholder: "Tell us a little about it", required: true },
];

export type ContactCard = {
  label: string;
  lines: { text: string; href: string }[];
  /** Colour of its lines (Figma: the email in red, WhatsApp in green). */
  tone: "ink" | "brand" | "whatsapp";
};

/** The quick contact cards under the meeting room. */
export const contactCards: ContactCard[] = [
  {
    label: "Call",
    tone: "ink",
    lines: [
      { text: "+91 72900 02168", href: "tel:+917290002168" },
      { text: "+91 98118 69950", href: "tel:+919811869950" },
    ],
  },
  { label: "Write", tone: "brand", lines: [{ text: "info@creativethinksmedia.com", href: "mailto:info@creativethinksmedia.com" }] },
  { label: "Chat", tone: "whatsapp", lines: [{ text: "WhatsApp Us", href: "#" }] },
  { label: "Visit", tone: "ink", lines: [{ text: "Sector 142, Noida, UP", href: "#" }] },
];
