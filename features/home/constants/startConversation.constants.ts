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
  /** The café counter under the meeting room: the chalkboard lists the studio's social handles. */
  cafe: {
    boardTitle: "Find us online",
    follow: "follow us",
    baristaAlt: "Our barista behind the café counter, holding a cup",
    /** The notes pinned to the front of the counter. */
    call: { label: "Call us on", numbers: [{ text: "+91 72900 02168", href: "tel:+917290002168" }, { text: "+91 98119 65550", href: "tel:+919811965550" }] },
    mail: { label: "Mail us on", email: "ritz@creativethinksmedia.com" },
    visit: {
      label: "Visit",
      hint: "hover for map",
      address: "402–404, 4th Floor, Corporate Park, Tower A1, Sector 142, Noida 201305",
      openMap: "Open in Google Maps",
    },
  },
};

export type BookingField = {
  name: string;
  label: string;
  type: "text" | "email" | "tel";
  placeholder: string;
  required: boolean;
  autoComplete?: string;
};

/** The meeting request's fields, in order. */
export const bookingFields: BookingField[] = [
  { name: "name", label: "Name", type: "text", placeholder: "e.g. Vikram Sharma", required: true, autoComplete: "name" },
  { name: "email", label: "Email", type: "email", placeholder: "e.g. vikram@company.com", required: true, autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", placeholder: "e.g. +91 98765 43210", required: true, autoComplete: "tel" },
  { name: "message", label: "Message", type: "text", placeholder: "Tell us a little about your project", required: true },
];
