export const posts = [
  {
    username: "chomi_b",
    description:
      "Spacious commercial stall available with high foot traffic. Ideal for a mini mart, café, or printing shop. Rent is negotiable.",
    images_url: [require("../assets/images/post-1.jpg")],
    comment_count: 120,
    heart_count: 1485,
    hasBookmarked: true,
    hasHearted: true,
    createdAt: "2025-06-27T13:22:00Z",
    price: 5000,
    address: "Aurora Blvd., Cubao, Quezon City",
  },
  {
    username: "mikaella23",
    description:
      "Prime 28 sqm retail unit in a high-traffic commercial zone. Best for boutique shops, salons, or quick-serve food businesses. Biznest Score: 91.",
    images_url: [require("../assets/images/post-2.jpg")],
    comment_count: 87,
    heart_count: 1340,
    hasBookmarked: false,
    hasHearted: false,
    createdAt: "2025-06-25T10:15:00Z",
    price: null,
    address: "Bonifacio High Street, Taguig City",
  },
  {
    username: "juan_delo",
    description:
      "Affordable store front with attached stockroom. Suitable for small retail like a sari-sari store. Electricity and water included. 6-month minimum term.",
    images_url: [require("../assets/images/post-3.jpg")],
    comment_count: 41,
    heart_count: 300,
    hasBookmarked: false,
    hasHearted: true,
    createdAt: "2025-06-24T08:45:00Z",
    price: 4500,
    address: "Velasquez St., Tondo, Manila",
  },
  {
    username: "trisha.codes",
    description:
      "Corner unit with glass frontage near schools and offices. Great for milk tea shops, laundromats, or gadget repairs. Biznest Score: 87.",
    images_url: [require("../assets/images/post-4.jpg")],
    comment_count: 112,
    heart_count: 4500,
    hasBookmarked: true,
    hasHearted: true,
    createdAt: "2025-06-23T17:05:00Z",
    price: 18000,
    address: "Katipunan Ave., Quezon City",
  },
  {
    username: "vinsdailydose",
    description:
      "12 sqm food stall near a university. Ideal for student-friendly meals like rice bowls, milk tea, or snacks. High lunch and dinner traffic.",
    images_url: [require("../assets/images/post-5.jpg")],
    comment_count: 19,
    heart_count: 240,
    hasBookmarked: false,
    hasHearted: false,
    createdAt: "2025-06-22T11:30:00Z",
    price: null,
    address: "España Blvd., Sampaloc, Manila",
  },
  {
    username: "kyle.cam",
    description:
      "Industrial-style studio with high ceilings and natural light. Great for photography, creative work, or small boutique businesses. 24/7 access.",
    images_url: [require("../assets/images/post-6.jpg")],
    comment_count: 78,
    heart_count: 1100,
    hasBookmarked: true,
    hasHearted: true,
    createdAt: "2025-06-20T13:55:00Z",
    price: 22000,
    address: "Don Pedro St., Poblacion, Makati City",
  },
  {
    username: "pinoynomad",
    description:
      "50 sqm warehouse with driveway access. Suitable for e-commerce logistics, storage, or small-scale distribution. Available immediately.",
    images_url: [require("../assets/images/post-7.jpg")],
    comment_count: 54,
    heart_count: 870,
    hasBookmarked: false,
    hasHearted: true,
    createdAt: "2025-06-18T09:10:00Z",
    price: 15000,
    address: "1st Ave., Grace Park, Caloocan City",
  },
  {
    username: "anne.m",
    description:
      "Shared coworking space with WiFi, aircon, and whiteboards. Flexible hourly or per-seat rates. Great for freelancers and student groups.",
    images_url: [require("../assets/images/post-8.jpg")],
    comment_count: 66,
    heart_count: 1320,
    hasBookmarked: true,
    hasHearted: false,
    createdAt: "2025-06-15T16:20:00Z",
    price: 150,
    address: "Emerald Ave., Ortigas Center, Pasig City",
  },
  {
    username: "thechefmike",
    description:
      "Fully equipped ghost kitchen ready for food delivery operations. Includes range hood, stainless prep tables, and storage. Limited slots.",
    images_url: [require("../assets/images/post-9.jpg")],
    comment_count: 101,
    heart_count: 2230,
    hasBookmarked: false,
    hasHearted: true,
    createdAt: "2025-06-13T22:40:00Z",
    price: 12000,
    address: "San Andres St., Malate, Manila",
  },
  {
    username: "nina_art",
    description:
      "Cozy street-level space previously used as an art gallery. Bright interiors, peaceful surroundings. Perfect for cafés, creative studios, or pop-ups.",
    images_url: [require("../assets/images/post-10.jpg")],
    comment_count: 89,
    heart_count: 3150,
    hasBookmarked: true,
    hasHearted: true,
    createdAt: "2025-06-10T07:00:00Z",
    price: null,
    address: "N. Domingo St., San Juan City",
  },
];

export const businessTypes = [
  "Food Stall",
  "Milk Tea Shop",
  "Café",
  "Sari-Sari Store",
  "Retail",
  "Boutique",
  "Salon",
  "Tech Startup",
  "Art Studio",
  "Ghost Kitchen",
  "Laundry",
  "Coworking",
];

export const cities = [
  "Quezon City",
  "Makati",
  "Taguig",
  "Manila",
  "Pasig",
  "San Juan",
  "Caloocan",
  "Parañaque",
  "Mandaluyong",
  "Las Piñas",
  "Marikina",
  "Navotas",
  "Malabon",
  "Valenzuela",
];

export const priceRange = [
  "< ₱5,000",
  "₱5,000 – ₱10,000",
  "₱10,000 – ₱20,000",
  "₱20,000+",
];

export const rentalTerm = ["Yearly", "Monthly", "Hourly", "Daily", "Flexible"];

export const biznestScore = [
  "Excellent (85–100)",
  "Good (70–84)",
  "Average (50–69)",
  "Low (below 50)",
];

export const comments = [
  {
    username: "jane_doe88",
    createdAt: "2025-06-25T10:23:00Z",
    text: "Hi! Is this spot still available for rent? I'm looking for a space in Quezon City.",
    upvote_count: 12,
    replies: [
      {
        username: "propertyfinderPH",
        createdAt: "2025-06-25T11:00:00Z",
        text: "Yes, it's still available! DM sent 😊",
        upvote_count: 5,
      },
    ],
  },
  {
    username: "bizmanila2024",
    createdAt: "2025-06-24T14:47:00Z",
    text: "How much is the monthly rental for this space?",
    upvote_count: 34,
    replies: [
      {
        username: "makatibroker",
        createdAt: "2025-06-24T15:05:00Z",
        text: "Hi! It's ₱25,000/month excluding utilities. Let me know if you'd like a tour.",
        upvote_count: 18,
      },
      {
        username: "realestateph",
        createdAt: "2025-06-24T15:45:00Z",
        text: "Utilities are billed separately depending on usage.",
        upvote_count: 10,
      },
    ],
  },
  {
    username: "foodielauncher",
    createdAt: "2025-06-22T08:12:00Z",
    text: "Is this lot near foot traffic areas? Planning to open a small café in Taguig.",
    upvote_count: 19,
    replies: [
      {
        username: "taguigspaces",
        createdAt: "2025-06-22T09:00:00Z",
        text: "Yes, very close to Market! Market! and BGC High Street.",
        upvote_count: 9,
      },
    ],
  },
  {
    username: "startupqueen",
    createdAt: "2025-06-20T17:30:00Z",
    text: "Do you allow short-term leases? Looking to test my business for 3 months in Pasig.",
    upvote_count: 22,
    replies: [
      {
        username: "pasiglease",
        createdAt: "2025-06-20T18:10:00Z",
        text: "We do! Minimum lease is 2 months. Message me for terms.",
        upvote_count: 13,
      },
    ],
  },
  {
    username: "kuya_negosyo",
    createdAt: "2025-06-19T20:45:00Z",
    text: "Pwede ba ito gawing laundry shop? Gaano kalawak ang space?",
    upvote_count: 40,
    replies: [
      {
        username: "manila_rentals",
        createdAt: "2025-06-19T21:05:00Z",
        text: "Yes, maraming gumagawa ng laundromat diyan. Space is 35sqm.",
        upvote_count: 17,
      },
    ],
  },
  {
    username: "mompreneurlife",
    createdAt: "2025-06-18T08:50:00Z",
    text: "Hi! Is this ideal for a small play café? I’m looking for a child-friendly area in QC.",
    upvote_count: 17,
    replies: [],
  },
  {
    username: "pandesalhunter",
    createdAt: "2025-06-17T13:20:00Z",
    text: "May sariling CR ba 'to? Planning to rent for a bakery stall.",
    upvote_count: 23,
    replies: [
      {
        username: "lotfinderPH",
        createdAt: "2025-06-17T13:50:00Z",
        text: "Yes po, may sariling restroom sa likod ng unit.",
        upvote_count: 6,
      },
    ],
  },
  {
    username: "tinderaQueen",
    createdAt: "2025-06-16T11:45:00Z",
    text: "Ilang months advance ang kailangan? May deposit din ba?",
    upvote_count: 29,
    replies: [
      {
        username: "rentalsPH",
        createdAt: "2025-06-16T12:10:00Z",
        text: "Usually 2 months advance + 1 month deposit. Negotiable for small businesses.",
        upvote_count: 11,
      },
      {
        username: "quickspace",
        createdAt: "2025-06-16T12:25:00Z",
        text: "Nag-ooffer kami ng 1-month advance lang for startups.",
        upvote_count: 7,
      },
      {
        username: "bizguide",
        createdAt: "2025-06-16T12:45:00Z",
        text: "Tip: Always request a written contract to protect both parties.",
        upvote_count: 14,
      },
    ],
  },
  {
    username: "freelance_studio",
    createdAt: "2025-06-15T16:30:00Z",
    text: "Is this unit soundproof or can it be used as a mini recording studio?",
    upvote_count: 14,
    replies: [],
  },
  {
    username: "plantita_mnl",
    createdAt: "2025-06-14T07:40:00Z",
    text: "Is there natural light here? Planning a small plant shop.",
    upvote_count: 10,
    replies: [
      {
        username: "metroagents",
        createdAt: "2025-06-14T08:05:00Z",
        text: "Yes! There's a large front window with good morning sunlight.",
        upvote_count: 5,
      },
    ],
  },
  {
    username: "deliveryexpressph",
    createdAt: "2025-06-13T19:22:00Z",
    text: "Pwede ba for logistics hub? May daanan ng truck?",
    upvote_count: 21,
    replies: [
      {
        username: "leasingmanila",
        createdAt: "2025-06-13T20:00:00Z",
        text: "Oo, along a main road and accessible for trucks.",
        upvote_count: 8,
      },
    ],
  },
  {
    username: "sidehustler",
    createdAt: "2025-06-12T10:12:00Z",
    text: "Safe ba dito sa gabi? Planning to open a milk tea shop open till 10PM.",
    upvote_count: 18,
    replies: [],
  },
  {
    username: "trendingnowmnl",
    createdAt: "2025-06-11T14:55:00Z",
    text: "Is this inside a mall or roadside? Need good visibility for walk-ins.",
    upvote_count: 27,
    replies: [
      {
        username: "spacehunter",
        createdAt: "2025-06-11T15:10:00Z",
        text: "Roadside frontage! Beside a convenience store.",
        upvote_count: 4,
      },
    ],
  },
  {
    username: "budgetbiz",
    createdAt: "2025-06-10T09:30:00Z",
    text: "Kaya ba to sa budget 10k per month? Looking for startup stall lang.",
    upvote_count: 35,
    replies: [
      {
        username: "affordablerentsph",
        createdAt: "2025-06-10T09:50:00Z",
        text: "Meron po kaming units na pasok sa 10k. Please DM 😊",
        upvote_count: 10,
      },
    ],
  },
  {
    username: "techkubo",
    createdAt: "2025-06-09T18:00:00Z",
    text: "Hi! Is there WiFi included or fiber-ready at least?",
    upvote_count: 11,
    replies: [
      {
        username: "wiredplaces",
        createdAt: "2025-06-09T18:22:00Z",
        text: "Fiber-ready na po, Globe and Converge available.",
        upvote_count: 3,
      },
    ],
  },
];

export const userPosts = [
  {
    images_url: [require("../assets/images/post-1.jpg")],
    comment_count: 120,
    heart_count: 1485,
  },
  {
    images_url: [require("../assets/images/post-2.jpg")],
    comment_count: 87,
    heart_count: 1340,
  },
  {
    images_url: [require("../assets/images/post-3.jpg")],
    comment_count: 41,
    heart_count: 300,
  },
];

export const messages = [
  {
    username: "chomi_b",
    fullname: "Jomari Borines",
    latestMessage:
      "Hi! I’m interested in the spot you posted in Sampaloc. Is it still available? I’d love to set up a small café there.",
    latestMessageDate: "2025-06-27T18:45:00Z",
    isRead: false,
    unreadCount: 2,
  },
  {
    username: "mikaella23",
    fullname: "Mikaella Santos",
    latestMessage:
      "Thanks for the update! I’ll let my team know and we’ll discuss it during our planning session tonight.",
    latestMessageDate: "2025-06-27T16:20:00Z",
    isRead: true,
    unreadCount: 0,
  },
  {
    username: "juan_delo",
    fullname: "Juan Dela Cruz",
    latestMessage:
      "Can I schedule a site visit tomorrow afternoon? I’m currently managing logistics and would like to finalize by next week.",
    latestMessageDate: "2025-06-26T14:10:00Z",
    isRead: false,
    unreadCount: 1,
  },
  {
    username: "trisha.codes",
    fullname: "Trisha Mendoza",
    latestMessage:
      "Let me know once the evaluation results are available. I want to compare this location with two others I bookmarked.",
    latestMessageDate: "2025-06-26T08:30:00Z",
    isRead: true,
    unreadCount: 0,
  },
  {
    username: "kyle.cam",
    fullname: "Kyle Camacho",
    latestMessage:
      "Do you accept short-term leases, like three months or less? I'm planning a seasonal pop-up for gadgets and accessories.",
    latestMessageDate: "2025-06-25T20:50:00Z",
    isRead: false,
    unreadCount: 3,
  },
  {
    username: "pinoynomad",
    fullname: "Leo Dominguez",
    latestMessage:
      "I like the foot traffic in that area, but how’s the noise level? Planning to open a meditation and wellness center.",
    latestMessageDate: "2025-06-25T15:02:00Z",
    isRead: false,
    unreadCount: 10,
  },
  {
    username: "nina_art",
    fullname: "Nina Alcantara",
    latestMessage:
      "Hello! I’m considering this unit as my first art studio. Do you have any more photos or details about the lighting?",
    latestMessageDate: "2025-06-24T21:18:00Z",
    isRead: false,
    unreadCount: 1,
  },
  {
    username: "thechefmike",
    fullname: "Chef Mike Velasquez",
    latestMessage:
      "I run a ghost kitchen in Quezon City and looking to expand. Can you tell me about delivery accessibility in that area?",
    latestMessageDate: "2025-06-24T09:45:00Z",
    isRead: true,
    unreadCount: 0,
  },
  {
    username: "vinsdailydose",
    fullname: "Vincent Salazar",
    latestMessage:
      "Hey! That retail space near Katipunan looks promising. Just checking if there's secure parking nearby for staff and customers?",
    latestMessageDate: "2025-06-23T13:30:00Z",
    isRead: false,
    unreadCount: 2,
  },
  {
    username: "anne.m",
    fullname: "Anne Mercado",
    latestMessage:
      "Would it be possible to hold the unit until the weekend? I’m out of town but planning to check it out with my partner.",
    latestMessageDate: "2025-06-22T19:05:00Z",
    isRead: true,
    unreadCount: 0,
  },
  {
    username: "pinoynomad",
    fullname: "Leo Dominguez",
    latestMessage:
      "I like the foot traffic in that area, but how’s the noise level? Planning to open a meditation and wellness center.",
    latestMessageDate: "2025-06-25T15:02:00Z",
    isRead: true,
    unreadCount: 0,
  },
  {
    username: "nina_art",
    fullname: "Nina Alcantara",
    latestMessage:
      "Hello! I’m considering this unit as my first art studio. Do you have any more photos or details about the lighting?",
    latestMessageDate: "2025-06-24T21:18:00Z",
    isRead: false,
    unreadCount: 1,
  },
];

export const conversations = [
  {
    username: "chomi_b",
    fullname: "Jomari Borines",
    messages: [
      {
        username: "chomi_b",
        message: "Hi! Is the location in Sampaloc still available?",
        date: "2025-06-27T18:45:00Z",
      },
      {
        username: "me",
        message: "Yes, it’s still open! Would you like to visit it this week?",
        date: "2025-06-27T18:47:10Z",
      },
      {
        username: "chomi_b",
        message: "That would be great. I'm free Friday afternoon.",
        date: "2025-06-27T18:49:34Z",
      },
      {
        username: "me",
        message: "Perfect. I can meet you there around 3 PM if that works.",
        date: "2025-06-27T18:51:02Z",
      },
      {
        username: "chomi_b",
        message: "Sounds good! Is there parking available nearby?",
        date: "2025-06-27T18:53:10Z",
      },
      {
        username: "me",
        message: "Yes, there’s a parking lot right across the street.",
        date: "2025-06-27T18:55:42Z",
      },
      {
        username: "chomi_b",
        message: "Nice. How long can we stay at the location?",
        date: "2025-06-27T18:57:55Z",
      },
      {
        username: "me",
        message: "As long as needed during the visit, no rush.",
        date: "2025-06-27T18:59:03Z",
      },
      {
        username: "chomi_b",
        message:
          "Okay cool, is it okay if I bring a friend to help me inspect?",
        date: "2025-06-27T19:01:19Z",
      },
      {
        username: "me",
        message: "Absolutely, the more eyes the better!",
        date: "2025-06-27T19:03:30Z",
      },
      {
        username: "chomi_b",
        message:
          "Thanks! Just confirming — it’s the unit beside the old bakery?",
        date: "2025-06-27T19:06:15Z",
      },
      {
        username: "me",
        message:
          "Yes, exactly. Unit 4, left of the old bakery with green gate.",
        date: "2025-06-27T19:08:00Z",
      },
      {
        username: "chomi_b",
        message: "Got it. Looking forward to checking it out!",
        date: "2025-06-27T19:10:44Z",
      },
      {
        username: "me",
        message: "See you Friday, then!",
        date: "2025-06-27T19:11:30Z",
      },
    ],
  },
];

export const faqs = [
  {
    question: "🧠 What is Biznest?",
    answer:
      "Biznest is a mobile app that helps entrepreneurs evaluate if a location in Metro Manila is ideal for their business. It uses data like nearby establishments, accessibility, and business density to generate a suitability score.",
  },
  {
    question: "📍 How does the location evaluation work?",
    answer:
      "We analyze multiple data points — such as surrounding businesses, foot traffic, transport access, and business trends — to assess whether a location is a good fit for different types of businesses.",
  },
  {
    question: "🏪 What business types does Biznest support?",
    answer:
      "Biznest currently supports evaluations for food stalls, cafés, milk tea shops, sari-sari stores, salons, boutiques, coworking spaces, and more. We’re constantly expanding our list!",
  },
  {
    question: "🔐 Is my personal data secure?",
    answer:
      "Yes. We only collect necessary data and do not share your personal information with third parties. You are in full control of your account.",
  },
  {
    question: "📦 Can I post a location for rent?",
    answer:
      "Yes! You can post available spaces with photos, descriptions, rental rates, and get a Biznest Score to attract potential renters.",
  },
  {
    question: "🗺️ Where does Biznest get its data?",
    answer:
      "We source public and open data (e.g., HOTOSM, government records), combined with user-submitted information and evaluations.",
  },
  {
    question: "💬 How accurate is the Biznest Score?",
    answer:
      "While we aim for the highest accuracy, the score is a guide based on available data. We recommend combining it with your own market research and instincts.",
  },
  {
    question: "🏙️ Does Biznest work outside Metro Manila?",
    answer:
      "Currently, Biznest focuses on Metro Manila. We're working on expanding to other regions soon.",
  },
  {
    question: "🧾 Is Biznest free to use?",
    answer:
      "Yes! You can use core features like evaluation and location browsing for free. Additional tools may be added in future updates.",
  },
  {
    question: " 🛠️ I'm experiencing a bug or issue. What should I do?",
    answer:
      "Please contact us via the Help & Feedback section in the app. We'd love to fix it and improve your experience!",
  },
];
