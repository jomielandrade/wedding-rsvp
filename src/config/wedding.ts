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
      date: "2014",
      description:
        "Our paths crossed in the most unexpected way, and from that moment, something beautiful began to unfold.",
    },
    {
      id: "graduate-work",
      title: "Graduation & Work",
      date: "2018",
      description:
        "We shared many memories together, from graduation to work, and we've been through it all.",
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
      id: "gallery-2014",
      src: "/images/gallery/2014.jpg",
      alt: "2014",
      width: 720,
      height: 960,
    },
    {
      id: "gallery-2015",
      src: "/images/gallery/2015.jpg",
      alt: "2015",
      width: 1920,
      height: 2560,
    },
    {
      id: "gallery-2016",
      src: "/images/gallery/2016.jpg",
      alt: "2016",
      width: 1920,
      height: 2560,
    },
    {
      id: "gallery-2017",
      src: "/images/gallery/2017.jpg",
      alt: "2017",
      width: 720,
      height: 479,
    },
    {
      id: "gallery-2018",
      src: "/images/gallery/2018.jpg",
      alt: "2018",
      width: 720,
      height: 960,
    },
    {
      id: "gallery-2019",
      src: "/images/gallery/2019.jpg",
      alt: "2019",
      width: 1216,
      height: 1624,
    },
    {
      id: "gallery-2020",
      src: "/images/gallery/2020.jpg",
      alt: "2020",
      width: 1218,
      height: 1624,
    },
    {
      id: "gallery-2021",
      src: "/images/gallery/2021.jpg",
      alt: "2021",
      width: 914,
      height: 1624,
    },
    {
      id: "gallery-2022",
      src: "/images/gallery/2022.jpg",
      alt: "2022",
      width: 1200,
      height: 1600,
    },
    {
      id: "gallery-2023",
      src: "/images/gallery/2023.jpg",
      alt: "2023",
      width: 1224,
      height: 1624,
    },
    {
      id: "gallery-2024",
      src: "/images/gallery/2024.JPG",
      alt: "2024",
      width: 3456,
      height: 2304,
    },
    {
      id: "gallery-2025-v2",
      src: "/images/gallery/2025-v2.jpeg",
      alt: "2025 v2",
      width: 1920,
      height: 1440,
    },
    {
      id: "gallery-2025",
      src: "/images/gallery/2025.jpg",
      alt: "2025",
      width: 1600,
      height: 2133,
    },
    {
      id: "gallery-2026",
      src: "/images/gallery/2026.jpg",
      alt: "2026",
      width: 1920,
      height: 1440,
    },
  ],
  dressCode: {
    title: "Dress Code",
    description: "Smart casual attire in the following shades",
    colors: [
      { id: "peach", name: "Pale Peach", hex: "#E5CFC0" },
      { id: "ochre", name: "Muted Ochre", hex: "#C9B08A" },
      { id: "dusty-blue", name: "Dusty Blue", hex: "#8BA4BE" },
      { id: "slate-blue", name: "Slate Blue", hex: "#4E6478" },
    ],
  },
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
    banks: [
      {
        id: "gotyme",
        bankName: "GoTyme Bank",
        accountName: "Rojiely Palma",
        accountNumber: "0165 1520 0676",
        qrImage: "/images/banks/gotyme.JPG",
        enabled: true,
      },
      {
        id: "maya",
        bankName: "Maya Bank, Inc.",
        accountName: "Jomiel Hernandez Andrade",
        accountNumber: "8059 8055 4598",
        qrImage: "/images/banks/maya.JPG",
        enabled: true,
      },
    ],
  },
  contact: {
    email: "hello@example.com",
    phone: "+63 9XX XXX XXXX",
  },
  socialLinks: [],
  rsvp: {
    deadline: "2026-06-15",
    emailConfirmation: false,
  },
};
