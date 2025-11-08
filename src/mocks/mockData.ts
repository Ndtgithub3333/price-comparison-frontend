// Small mock data used when backend is absent or for local development
import type { Product } from "@/services/productService";

export const sponsorMocks = [
    {
    id: "s1",
    name: "The gioi di dong",
    logoUrl: "Logo-The-Gioi-Di-Dong-MWG.webp",
    imageUrl: "Logo-The-Gioi-Di-Dong-MWG-B-V.webp",
    targetUrl: "#",
  },
    {
    id: "s2",
    name: "CellphoneS",
    logoUrl: "cellphones.png",
    imageUrl: "cellphones-logo.png",
    targetUrl: "#",
    },
    {
    id: "s3",
    name: "FPT Shop",
    logoUrl: "Logo-FPT-Shop-Black.png",
    imageUrl: "Logo-FPT-Shop-Black.png",
    targetUrl: "#",
  },
    {
    id: "s4",
    name: "Vietel Store",
    logoUrl: "vietel_store_logo.png",
    imageUrl: "vietel_store.png",
    targetUrl: "#",
  },
 
  { id: "s5", name: "Joybuy", imageUrl: "iphone.png", targetUrl: "#" },
  { id: "s6", name: "Vodafone", imageUrl: "laptop.png", targetUrl: "#" },
  { id: "s7", name: "Hughes Electrical", imageUrl: "ipad.png", targetUrl: "#" },
  {
    id: "s8",
    name: "Hughes Electrical",
    imageUrl: "airpod.png",
    targetUrl: "#",
  },
  {
    id: "s9",
    name: "Joybuy",
    imageUrl: "apple_watch.png",
    targetUrl: "#",
  },
  {
    id: "s10",
    name: "Vodafone",
    imageUrl: "accessories.png",
    targetUrl: "#",
  }
];

export const productMocks: Product[] = Array.from({ length: 12 }).map(
  (_, i) => ({
    _id: `mock-${i}`,
    name:
      [
        "Apple iPhone 17 Pro Max",
        "Apple MacBook Air",
        "Crocs Classic Clog",
        "Creed Aventus EdP",
        "Apple AirPods 4",
        "Apple AirPod",
      ][i % 6] + ` ${i + 1}`,
    price: Math.floor(199 + i * 50),
    originalPrice: i % 3 === 0 ? Math.floor(299 + i * 60) : undefined,
    discount: i % 3 === 0 ? 10 + i : undefined,
    category: "phone",
    brand: i % 2 === 0 ? "Apple" : "Generic",
    source: "mock",
    sourceUrl: "#",
    sourceProductId: `mock-${i}`,
    inStock: i % 5 !== 0,
    description: "Mock product used for development",
    imageUrl: "laptop.png",
    soldCount: (i + 1) * 10,
    promotion: i % 4 === 0 ? "Free delivery" : undefined,
    rating: 4 + (i % 2) * 0.1,
  }),
);
