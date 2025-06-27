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
