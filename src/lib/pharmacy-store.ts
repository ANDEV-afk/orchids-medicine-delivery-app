export interface Pharmacy {
  id: string;
  name: string;
  ownerName: string;
  address: string;
  area: string;
  city: string;
  pincode: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  rating: number;
  reviews: number;
  distance?: string;
  deliveryTime?: string;
  deliveryFee: number;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  isVerified: boolean;
  image: string;
  inventory: { [medicineId: number]: number };
}

const delhiPharmacies: Pharmacy[] = [
  {
    id: "p1",
    name: "Apollo Pharmacy - Connaught Place",
    ownerName: "Dr. Amit Sharma",
    address: "Block A-12, Inner Circle, Connaught Place",
    area: "Connaught Place",
    city: "New Delhi",
    pincode: "110001",
    lat: 28.6315,
    lng: 77.2167,
    phone: "+91 9876543210",
    email: "apollo.cp@medrush.com",
    rating: 4.9,
    reviews: 2450,
    deliveryFee: 25,
    openTime: "08:00",
    closeTime: "22:00",
    isOpen: true,
    isVerified: true,
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400",
    inventory: { 1: 100, 2: 50, 3: 75, 4: 60, 5: 80, 6: 90, 7: 45, 8: 70 }
  },
  {
    id: "p2",
    name: "MedPlus - Saket",
    ownerName: "Rajesh Kumar",
    address: "Shop 23, Select Citywalk Mall, Saket",
    area: "Saket",
    city: "New Delhi",
    pincode: "110017",
    lat: 28.5280,
    lng: 77.2190,
    phone: "+91 9876543211",
    email: "medplus.saket@medrush.com",
    rating: 4.8,
    reviews: 1890,
    deliveryFee: 20,
    openTime: "09:00",
    closeTime: "21:00",
    isOpen: true,
    isVerified: true,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400",
    inventory: { 1: 150, 2: 40, 3: 80, 4: 90, 5: 55, 6: 100, 7: 60, 8: 45 }
  },
  {
    id: "p3",
    name: "Fortis Pharmacy - Vasant Kunj",
    ownerName: "Dr. Priya Singh",
    address: "Fortis Hospital, Sector B-4, Vasant Kunj",
    area: "Vasant Kunj",
    city: "New Delhi",
    pincode: "110070",
    lat: 28.5208,
    lng: 77.1530,
    phone: "+91 9876543212",
    email: "fortis.vk@medrush.com",
    rating: 4.9,
    reviews: 3200,
    deliveryFee: 30,
    openTime: "00:00",
    closeTime: "23:59",
    isOpen: true,
    isVerified: true,
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    inventory: { 1: 200, 2: 100, 3: 150, 4: 120, 5: 180, 6: 140, 7: 90, 8: 110 }
  },
  {
    id: "p4",
    name: "Wellness Forever - Dwarka",
    ownerName: "Sunil Verma",
    address: "Plot 12, Sector 6, Dwarka",
    area: "Dwarka",
    city: "New Delhi",
    pincode: "110075",
    lat: 28.5921,
    lng: 77.0460,
    phone: "+91 9876543213",
    email: "wellness.dwarka@medrush.com",
    rating: 4.7,
    reviews: 1560,
    deliveryFee: 25,
    openTime: "08:00",
    closeTime: "21:00",
    isOpen: true,
    isVerified: true,
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400",
    inventory: { 1: 80, 2: 35, 3: 60, 4: 75, 5: 50, 6: 85, 7: 40, 8: 55 }
  },
  {
    id: "p5",
    name: "Netmeds Store - Rohini",
    ownerName: "Neha Gupta",
    address: "Shop 8, M2K Victoria Gardens, Rohini Sector 25",
    area: "Rohini",
    city: "New Delhi",
    pincode: "110085",
    lat: 28.7419,
    lng: 77.1210,
    phone: "+91 9876543214",
    email: "netmeds.rohini@medrush.com",
    rating: 4.6,
    reviews: 980,
    deliveryFee: 15,
    openTime: "09:00",
    closeTime: "20:00",
    isOpen: true,
    isVerified: true,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400",
    inventory: { 1: 70, 2: 25, 3: 55, 4: 65, 5: 40, 6: 70, 7: 35, 8: 45 }
  },
  {
    id: "p6",
    name: "Guardian Pharmacy - Lajpat Nagar",
    ownerName: "Vikram Mehta",
    address: "Central Market, Lajpat Nagar II",
    area: "Lajpat Nagar",
    city: "New Delhi",
    pincode: "110024",
    lat: 28.5672,
    lng: 77.2410,
    phone: "+91 9876543215",
    email: "guardian.ln@medrush.com",
    rating: 4.8,
    reviews: 2100,
    deliveryFee: 20,
    openTime: "08:30",
    closeTime: "21:30",
    isOpen: true,
    isVerified: true,
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    inventory: { 1: 120, 2: 55, 3: 85, 4: 95, 5: 65, 6: 105, 7: 55, 8: 75 }
  },
  {
    id: "p7",
    name: "Max Pharmacy - Patparganj",
    ownerName: "Dr. Kavita Rao",
    address: "Max Super Speciality Hospital, Patparganj",
    area: "Patparganj",
    city: "New Delhi",
    pincode: "110092",
    lat: 28.6229,
    lng: 77.3090,
    phone: "+91 9876543216",
    email: "max.ppg@medrush.com",
    rating: 4.9,
    reviews: 2800,
    deliveryFee: 30,
    openTime: "00:00",
    closeTime: "23:59",
    isOpen: true,
    isVerified: true,
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400",
    inventory: { 1: 180, 2: 90, 3: 130, 4: 100, 5: 150, 6: 120, 7: 80, 8: 95 }
  },
  {
    id: "p8",
    name: "PharmEasy Store - Karol Bagh",
    ownerName: "Ankit Bansal",
    address: "Shop 45, Ajmal Khan Road, Karol Bagh",
    area: "Karol Bagh",
    city: "New Delhi",
    pincode: "110005",
    lat: 28.6519,
    lng: 77.1900,
    phone: "+91 9876543217",
    email: "pharmeasy.kb@medrush.com",
    rating: 4.7,
    reviews: 1450,
    deliveryFee: 18,
    openTime: "09:00",
    closeTime: "21:00",
    isOpen: true,
    isVerified: true,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400",
    inventory: { 1: 90, 2: 45, 3: 70, 4: 80, 5: 55, 6: 90, 7: 45, 8: 60 }
  },
  {
    id: "p9",
    name: "LifeCare Pharmacy - Greater Kailash",
    ownerName: "Dr. Sanjay Jain",
    address: "N-Block Market, Greater Kailash I",
    area: "Greater Kailash",
    city: "New Delhi",
    pincode: "110048",
    lat: 28.5505,
    lng: 77.2340,
    phone: "+91 9876543218",
    email: "lifecare.gk@medrush.com",
    rating: 4.8,
    reviews: 1780,
    deliveryFee: 22,
    openTime: "08:00",
    closeTime: "22:00",
    isOpen: true,
    isVerified: true,
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    inventory: { 1: 110, 2: 60, 3: 90, 4: 85, 5: 70, 6: 100, 7: 50, 8: 70 }
  },
  {
    id: "p10",
    name: "Medanta Pharmacy - Gurgaon",
    ownerName: "Dr. Renu Kapoor",
    address: "Medanta The Medicity, Sector 38, Gurgaon",
    area: "Sector 38",
    city: "Gurgaon",
    pincode: "122001",
    lat: 28.4395,
    lng: 77.0422,
    phone: "+91 9876543219",
    email: "medanta.grg@medrush.com",
    rating: 4.9,
    reviews: 3500,
    deliveryFee: 35,
    openTime: "00:00",
    closeTime: "23:59",
    isOpen: true,
    isVerified: true,
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400",
    inventory: { 1: 250, 2: 120, 3: 180, 4: 140, 5: 200, 6: 160, 7: 100, 8: 130 }
  },
  {
    id: "p11",
    name: "1mg Store - Noida",
    ownerName: "Deepak Sharma",
    address: "Sector 18, Atta Market, Noida",
    area: "Sector 18",
    city: "Noida",
    pincode: "201301",
    lat: 28.5700,
    lng: 77.3250,
    phone: "+91 9876543220",
    email: "1mg.noida@medrush.com",
    rating: 4.7,
    reviews: 1650,
    deliveryFee: 20,
    openTime: "09:00",
    closeTime: "21:00",
    isOpen: true,
    isVerified: true,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400",
    inventory: { 1: 100, 2: 50, 3: 75, 4: 70, 5: 60, 6: 85, 7: 45, 8: 55 }
  },
  {
    id: "p12",
    name: "BLK Hospital Pharmacy - Rajendra Place",
    ownerName: "Dr. Meera Aggarwal",
    address: "BLK Super Speciality Hospital, Pusa Road",
    area: "Rajendra Place",
    city: "New Delhi",
    pincode: "110005",
    lat: 28.6414,
    lng: 77.1775,
    phone: "+91 9876543221",
    email: "blk.rp@medrush.com",
    rating: 4.8,
    reviews: 2650,
    deliveryFee: 28,
    openTime: "00:00",
    closeTime: "23:59",
    isOpen: true,
    isVerified: true,
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    inventory: { 1: 160, 2: 80, 3: 120, 4: 110, 5: 140, 6: 130, 7: 75, 8: 90 }
  }
];

let pharmacies: Pharmacy[] = [...delhiPharmacies];
let listeners: (() => void)[] = [];

export function getPharmacies(): Pharmacy[] {
  return pharmacies;
}

export function addPharmacy(pharmacy: Omit<Pharmacy, "id" | "rating" | "reviews" | "isVerified" | "inventory">): Pharmacy {
  const newPharmacy: Pharmacy = {
    ...pharmacy,
    id: `p${Date.now()}`,
    rating: 4.5,
    reviews: 0,
    isVerified: false,
    inventory: { 1: 50, 2: 30, 3: 40, 4: 35, 5: 45, 6: 50, 7: 25, 8: 30 }
  };
  pharmacies = [...pharmacies, newPharmacy];
  listeners.forEach(listener => listener());
  return newPharmacy;
}

export function subscribeToPharmacies(listener: () => void): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function findNearestPharmacyWithStock(
  userLat: number, 
  userLng: number, 
  medicineIds: number[]
): Pharmacy | null {
  const availablePharmacies = pharmacies.filter(pharmacy => {
    if (!pharmacy.isOpen) return false;
    return medicineIds.every(id => (pharmacy.inventory[id] || 0) > 0);
  });

  if (availablePharmacies.length === 0) return null;

  let nearest: Pharmacy | null = null;
  let minDistance = Infinity;

  for (const pharmacy of availablePharmacies) {
    const distance = calculateDistance(userLat, userLng, pharmacy.lat, pharmacy.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = { ...pharmacy, distance: `${distance.toFixed(1)} km` };
    }
  }

  return nearest;
}

export function getPharmaciesWithDistances(userLat: number, userLng: number): Pharmacy[] {
  return pharmacies.map(pharmacy => {
    const distance = calculateDistance(userLat, userLng, pharmacy.lat, pharmacy.lng);
    const deliveryTimeMin = Math.round(5 + distance * 3);
    return {
      ...pharmacy,
      distance: `${distance.toFixed(1)} km`,
      deliveryTime: `${deliveryTimeMin} min`
    };
  }).sort((a, b) => parseFloat(a.distance!) - parseFloat(b.distance!));
}
