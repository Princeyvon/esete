export interface StoreCategory {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  imageUrl: string;
}

export const ESETE_AGRO_INFO = {
  name: "Esete Agro",
  tagline: "Growing Together for a Better Tomorrow!",
  headline: "Quality products for better farming",
  categoryTag: "AGRICULTURAL INPUTS",
  phone: "+251 939 806 318",
  whatsappNumber: "251939806318",
  email: "princeyvon30@gmail.com",
  location: "Merkato Gojam bernda murtem, Addis Ababa, Ethiopia",
  shortLocation: "Merkato Gojam bernda murtem",
  detailedAddress: "Gojam Berenda Murtem, Merkato Wholesale Commercial Quarter, Addis Ababa, Ethiopia",
  landmark: "Near Regional Bus Logistics & Murtem Agro-merchants Hub",
  hours: "Mon – Sat: 8:00 AM – 6:30 PM",
  safetyNotice:
    "Safety Notice: Always read the product label and safety instructions before handling agricultural chemicals. Use appropriate personal protective equipment (PPE). Keep all pesticides, herbicides, and fertilizers safely stored away from children, food, and animals.",
};

export const STORE_CATEGORIES: StoreCategory[] = [
  {
    id: "herbicides",
    name: "Herbicides",
    subtitle: "Effective weed control",
    description: "Selective and non-selective herbicides for teff, wheat, maize, and land clearing",
    imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "insecticides",
    name: "Insecticides",
    subtitle: "Powerful pest protection",
    description: "Broad-spectrum contact and systemic protection against armyworms, aphids, and borers",
    imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "fungicides",
    name: "Fungicides",
    subtitle: "Protects from plant diseases",
    description: "Curative and protective formulations against blights, rusts, and downy mildews",
    imageUrl: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "fertilizers",
    name: "Fertilizers",
    subtitle: "Nourishment for better yield",
    description: "Granular Urea 46%, NPSB blends, and soluble foliar micro-nutrients",
    imageUrl: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "sprayers-ppe",
    name: "Sprayers & PPE",
    subtitle: "Sprayers, masks, gloves & more",
    description: "16L knapsack sprayers, mist blowers, chemical respirators, and heavy-duty nitrile gloves",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "seeds",
    name: "Seeds",
    subtitle: "Quality seeds for high yield",
    description: "Certified hybrid maize, high-yielding teff (Quncho), wheat, and vegetable seeds",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",
  },
];

export function getProductWhatsAppUrl(productName: string): string {
  const message = encodeURIComponent(
    `Hello Esete Agro, I would like to ask about ${productName}. Is it available, and what is the current price?`,
  );
  return `https://wa.me/${ESETE_AGRO_INFO.whatsappNumber}?text=${message}`;
}
