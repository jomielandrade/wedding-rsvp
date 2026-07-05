import type { WeddingConfig } from "@/types/wedding";

export const weddingConfig: WeddingConfig = {
  couple: {
    partnerOne: "Jomiel",
    partnerTwo: "Rojiely",
    displayNames: "Jomiel & Rojiely",
    hashtag: "#JomielAndRojiely2026",
  },
  weddingDate: "2026-07-15T01:00:00.000Z",
  weddingDateDisplay: "July 15, 2026",
  weddingTime: "9:00 AM",
  timezone: "Asia/Manila",
  location: "Metro Manila, Philippines",
  ceremony: {
    name: "Pateros Municipal Hall",
    address: "Pateros, Metro Manila, Philippines",
    time: "9:00 AM",
    mapsUrl: "https://maps.app.goo.gl/sFGE4xbiGvXrCdk96",
  },
  reception: {
    name: "Max's Restaurant – Vista Mall Taguig",
    address: "Vista Mall, Taguig, Metro Manila, Philippines",
    time: "11:00 AM",
    mapsUrl: "https://maps.app.goo.gl/5yMabr4dA7d8eyJr9",
  },
  schedule: [
    {
      time: "9:00 AM",
      title: "Civil Wedding Ceremony",
      description: "Officiated by the Mayor of Pateros",
    },
    {
      time: "",
      title: "Travel to Reception",
      description: "Please allow time for travel between venues",
    },
    {
      time: "11:00 AM",
      title: "Wedding Reception",
      description: "Celebration lunch at Max's Restaurant",
    },
  ],
  story: [
    {
      id: "first-met",
      title: "First Met",
      date: "2018",
      description:
        "Our paths crossed in the most unexpected way, and from that moment, something beautiful began to unfold.",
    },
    {
      id: "first-date",
      title: "First Date",
      date: "2020",
      description:
        "A simple evening that felt like coming home — laughter, stories, and the quiet certainty that this was special.",
    },
    {
      id: "proposal",
      title: "The Proposal",
      date: "2025",
      description:
        "Under a sky painted with stars, a question was asked and answered with joyful tears and a resounding yes.",
    },
    {
      id: "wedding-day",
      title: "Wedding Day",
      date: "July 15, 2026",
      description:
        "The day we promise forever - surrounded by the people who mean the most to us.",
    },
  ],
  godparents: [
    {
      title: "Ninong",
      names: ["Mejavier Awitin", "Donato Hernandez"],
    },
    {
      title: "Ninang",
      names: ["Rowena Awitin", "Mila Hernandez"],
    },
  ],
  gallery: [
    {
      id: "gallery-1",
      src: "/images/gallery/placeholder-1.jpg",
      alt: "Couple portrait",
      width: 800,
      height: 1000,
    },
    {
      id: "gallery-2",
      src: "/images/gallery/placeholder-2.jpg",
      alt: "Engagement moment",
      width: 800,
      height: 600,
    },
    {
      id: "gallery-3",
      src: "/images/gallery/placeholder-3.jpg",
      alt: "Together outdoors",
      width: 800,
      height: 800,
    },
    {
      id: "gallery-4",
      src: "/images/gallery/placeholder-4.jpg",
      alt: "Celebration",
      width: 800,
      height: 1200,
    },
    {
      id: "gallery-5",
      src: "/images/gallery/placeholder-5.jpg",
      alt: "Quiet moment",
      width: 800,
      height: 600,
    },
    {
      id: "gallery-6",
      src: "/images/gallery/placeholder-6.jpg",
      alt: "Love story",
      width: 800,
      height: 900,
    },
  ],
  faq: [
    {
      id: "plus-one",
      question: "Can I bring a plus one?",
      answer:
        "We kindly request that only guests named on the invitation attend. If your invitation includes a plus one, it will be indicated on your personal invite link.",
    },
    {
      id: "arrival-time",
      question: "What time should I arrive?",
      answer:
        "Please arrive 15–30 minutes before the ceremony begins at 9:00 AM. This allows time for seating and ensures we can start on schedule.",
    },
    {
      id: "parking",
      question: "Where should I park?",
      answer:
        "Parking is available at both venues. At Pateros Municipal Hall, street and nearby parking areas are accessible. Vista Mall Taguig offers ample parking for reception guests.",
    },
    {
      id: "photos",
      question: "Can I take photos?",
      answer:
        "We welcome photos during the reception! However, we kindly ask that you refrain from taking photos during the ceremony so everyone can be fully present in the moment.",
    },
    {
      id: "rsvp-deadline",
      question: "When should I RSVP?",
      answer:
        "Please RSVP by June 15, 2026 so we can finalize our preparations. You may update your response anytime before the deadline.",
    },
  ],
  giftRegistry: {
    message:
      "Your presence at our wedding is the greatest gift we could ask for. However, if you wish to bless us with a gift, a monetary contribution towards our future together would be deeply appreciated.",
    gcash: {
      enabled: true,
      accountName: "Jomiel Andrade",
      mobileNumber: "09xxxxxxxxx",
      qrImage: "/images/gcash-qr.png",
    },
    bank: {
      enabled: true,
      bankName: "BDO",
      accountName: "Jomiel & Rojiely",
      accountNumber: "XXXX XXXX XXXX",
    },
  },
  contact: {
    email: "hello@example.com",
    phone: "+63 9XX XXX XXXX",
  },
  socialLinks: [],
  music: {
    enabled: true,
    src: "/audio/wedding-music.mp3",
    title: "Our Song",
  },
  rsvp: {
    deadline: "2026-06-15",
    emailConfirmation: false,
  },
  guests: [
    { slug: "john-doe", fullName: "John Doe" },
    { slug: "jane-smith", fullName: "Jane Smith" },
  ],
};
