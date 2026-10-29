/* ============================================================================
   WEDDING WEBSITE — CONTENT FILE
   ============================================================================
   THIS IS THE ONLY FILE YOU NEED TO EDIT.

   Every word, photo, video, the music, the colours and the map link are set
   here. Media paths point inside the /public folder, so
   "/assets/images/background.jpg" is the file  public/assets/images/background.jpg

   • To add a line break inside any text, type:  <br>
   • Leave any line as ""  and it disappears from the page completely.
   ========================================================================= */

export type Photo = {
  image: string;
  width?: number;
  height?: number;
  name: string;
  caption?: string;
};

export type WeddingEvent = {
  image: string;
  full?: string;
  width?: number;
  height?: number;
  title: string;
  text?: string;
  date?: string;
  time?: string;
  venue?: string;
  dressCode?: string;
  colour?: string;
};

export type Family = {
  side?: string;
  familyName: string;
  parents?: string;
  note?: string;
};

export const wedding = {
  /* 1. THE BASICS */
  couple: {
    groomName: "Manan",
    brideName: "Ritva",
    separator: "&",
    hashtag: "#MananKiRitva", // set to "" to hide it everywhere
    weddingDate: "18 October 2026",
    browserTitle: "Manan & Ritva — We're Getting Married",
  },

  /* 2. OPENING SCREEN */
  opening: {
    backgroundImage: "/assets/images/background.jpg",
    eyebrow: "You Are Invited",
    subLine: "to the wedding celebration of",
    // Kept empty so the scratch card's date stays a surprise.
    dateLine: "",
    buttonText: "Open Invitation",
    hintText: "Best experienced with sound on",
  },

  /* 3. INTRO ANIMATION VIDEO — plays full screen after "Open Invitation" */
  introVideo: {
    src: "/assets/videos/intro.mp4",
    sound: true,
    allowSkip: false,
    skipText: "Skip",
  },

  /* 4. HERO SECTION */
  hero: {
    backgroundVideo: "/assets/videos/hero-background.mp4",
    posterImage: "/assets/images/background.jpg",
    eyebrow: "You Are Invited",
    heading: "",
    subheading: "We invite you to celebrate the beginning of our forever.",
    buttonText: "Scroll",
  },

  /* 5. SCRATCH CARD */
  scratch: {
    backgroundImage: "/assets/images/background.jpg",
    heading: "A special surprise awaits you.",
    text: "Scratch the card to reveal our wedding date.",
    revealSmallText: "Save the Date",
    revealBigText: "18 October 2026",
    revealSubText: "Sunday  ·  The Leela Palace, Jaipur",
    coverLabel: "Scratch Here",
  },

  /* 6. MEET THE COUPLE — portrait photos look best */
  meetTheCouple: {
    backgroundImage: "/assets/images/background.jpg",
    heading: "Meet the Couple",
    text: "Two hearts. One beautiful journey. A lifetime of love begins here.",
    photos: [
      { image: "/assets/images/couple/groom.jpg", width: 1122, height: 1402, name: "Manan", caption: "The Groom" },
      { image: "/assets/images/couple/bride.jpg", width: 1122, height: 1402, name: "Ritva", caption: "The Bride" },
      { image: "/assets/images/couple/couple-1.jpg", width: 1448, height: 1086, name: "Manan & Ritva", caption: "Where it began" },
      { image: "/assets/images/couple/couple-2.jpg", width: 1086, height: 1448, name: "Manan & Ritva", caption: "Forever from here" },
    ] as Photo[],
  },

  /* 7. WEDDING CELEBRATIONS
     "colour" is the shade the background washes into as that event scrolls
     into view. "image" is the quick copy shown on the page; "full" is the
     original opened when a guest taps the card. */
  celebrations: {
    backgroundImage: "/assets/images/background.jpg",
    heading: "Celebrate With Us",
    text: "Four days of joy, colour and blessings — we would love you beside us for every one of them.",
    detailsButton: "View {event} Details",
    backButton: "Back to the Invitation",
    events: [
      {
        image: "/assets/images/events/haldi.jpg",
        full: "/assets/images/events/originals/haldi.png",
        width: 1024, height: 1536,
        title: "Haldi",
        text: "A celebration filled with laughter, blessings, and shades of yellow.",
        date: "17 October 2026, Saturday",
        time: "10:30 AM Onwards",
        venue: "The Leela Palace, Jaipur",
        dressCode: "Shades of Yellow",
        colour: "#FFC42E",
      },
      {
        image: "/assets/images/events/sangeet.jpg",
        full: "/assets/images/events/originals/sangeet.png",
        width: 1024, height: 1536,
        title: "Sangeet",
        text: "An evening of music, dance, unforgettable moments, and endless joy.",
        date: "17 October 2026, Saturday",
        time: "7:00 PM Onwards",
        venue: "The Leela Palace, Jaipur",
        dressCode: "Indo-Western / Festive",
        colour: "#B02A78",
      },
      {
        image: "/assets/images/events/wedding.jpg",
        full: "/assets/images/events/originals/wedding.png",
        width: 1024, height: 1536,
        title: "Wedding Ceremony & Phere",
        text: "As sacred vows are exchanged, two souls become one forever.",
        date: "18 October 2026, Sunday",
        time: "6:00 PM Onwards",
        venue: "The Leela Palace, Jaipur",
        dressCode: "Traditional Indian",
        colour: "#9E1B32",
      },
      {
        image: "/assets/images/events/reception.jpg",
        full: "/assets/images/events/originals/reception.png",
        width: 1024, height: 1536,
        title: "Dinner Reception",
        text: "Join us for a memorable evening of celebrations, blessings, and delicious food.",
        date: "18 October 2026, Sunday",
        time: "9:00 PM Onwards",
        venue: "The Leela Palace, Jaipur",
        dressCode: "Cocktail / Ethnic",
        colour: "#3A3C8F",
      },
    ] as WeddingEvent[],
  },

  /* 8. WITH LOVE (families) */
  withLove: {
    backgroundImage: "/assets/images/background.jpg",
    heading: "With Love",
    text: "With the blessings of our beloved families, we look forward to celebrating this beautiful occasion with you.",
    families: [
      { side: "The Groom's Family", familyName: "The Sharma Family", parents: "Mr. Rajesh Sharma & Mrs. Sunita Sharma", note: "Parents of Manan" },
      { side: "The Bride's Family", familyName: "The Verma Family", parents: "Mr. Anil Verma & Mrs. Meena Verma", note: "Parents of Ritva" },
    ] as Family[],
  },

  /* 9. VENUE — paste your Google Maps share link in mapsLink */
  venue: {
    backgroundImage: "/assets/images/background.jpg",
    backgroundVideo: "", // optional video instead of the image
    heading: "Venue",
    text: "We can't wait to welcome you to our wedding celebration.",
    name: "The Leela Palace, Jaipur",
    address: "Jaipur–Delhi Highway, Kukas,<br>Jaipur, Rajasthan 302028, India",
    buttonText: "Open in Google Maps",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=The+Leela+Palace+Jaipur",
  },

  /* 9b. SEND BLESSINGS — opens WhatsApp with the guest's message typed out.
     whatsappNumber: country code first, digits only (91 = India). */
  blessings: {
    enabled: true,
    backgroundImage: "/assets/images/background.jpg",
    heading: "Send Your Blessings",
    text: "Write us a note — your wishes mean the world to us.",
    placeholder: "Type your blessing for Manan & Ritva…",
    buttonText: "Send Blessing",
    whatsappNumber: "91XXXXXXXXXX", // << PUT YOUR NUMBER HERE >>
    messagePrefix: "Blessings for Manan & Ritva —",
    emptyWarning: "Please write a message first.",
  },

  /* 10. FOOTER */
  footer: {
    backgroundImage: "/assets/images/background.jpg",
    closingLine: "We look forward to celebrating with you.",
    signOff: "With love and gratitude",
  },

  /* 11. BACKGROUND MUSIC — startAt skips the first seconds, and loops return there */
  music: {
    enabled: true,
    src: "/assets/music/background-music.mp3",
    volume: 0.35,
    startAt: 15,
  },

  /* 12. LOOK & FEEL */
  theme: {
    gold: "#c9a227",
    lightGold: "#e8cf8b",
    deepRose: "#8e1b47",
    rose: "#c2185b",
    cream: "#fdf6ec",
    ink: "#3b1f2b",
    revealSpeed: 1.1, // seconds
  },
};

export type Wedding = typeof wedding;
