export interface Medicine {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  stock: number;
  image: string;
  description?: string;
  dosage?: string;
  prescription?: boolean;
}

export const medicines: Medicine[] = [
  { id: 1, name: "Paracetamol 500mg", brand: "Crocin", category: "Pain Relief", price: 25, originalPrice: 35, stock: 50, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200", description: "For fever and mild pain", dosage: "1-2 tablets every 4-6 hours" },
  { id: 2, name: "Azithromycin 500mg", brand: "Azithral", category: "Antibiotics", price: 120, originalPrice: 150, stock: 25, image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=200", description: "Antibiotic for bacterial infections", prescription: true },
  { id: 3, name: "Vitamin D3 60000IU", brand: "Drise", category: "Vitamins", price: 85, originalPrice: 100, stock: 100, image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=200", description: "Weekly vitamin D supplement" },
  { id: 4, name: "Cetirizine 10mg", brand: "Cetcip", category: "Cold & Flu", price: 35, originalPrice: 45, stock: 80, image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200", description: "Antihistamine for allergies" },
  { id: 5, name: "Metformin 500mg", brand: "Glycomet", category: "Diabetes", price: 45, originalPrice: 55, stock: 60, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200", prescription: true },
  { id: 6, name: "Aspirin 75mg", brand: "Ecosprin", category: "Heart Care", price: 30, originalPrice: 40, stock: 90, image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=200", description: "Blood thinner for heart health" },
  { id: 7, name: "Multivitamin Tablets", brand: "Supradyn", category: "Vitamins", price: 145, originalPrice: 180, stock: 45, image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=200", description: "Daily multivitamin supplement" },
  { id: 8, name: "Omeprazole 20mg", brand: "Pan", category: "Digestive", price: 55, originalPrice: 70, stock: 70, image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200", description: "For acid reflux and ulcers" },
  { id: 9, name: "Ibuprofen 400mg", brand: "Brufen", category: "Pain Relief", price: 32, originalPrice: 42, stock: 65, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200", description: "Anti-inflammatory pain reliever" },
  { id: 10, name: "Amoxicillin 500mg", brand: "Mox", category: "Antibiotics", price: 95, originalPrice: 120, stock: 40, image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=200", prescription: true },
  { id: 11, name: "Vitamin C 500mg", brand: "Limcee", category: "Vitamins", price: 28, originalPrice: 35, stock: 120, image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=200", description: "Immunity booster" },
  { id: 12, name: "Montelukast 10mg", brand: "Montair", category: "Cold & Flu", price: 75, originalPrice: 95, stock: 55, image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200", description: "For asthma and allergies" },
  { id: 13, name: "Glimepiride 2mg", brand: "Amaryl", category: "Diabetes", price: 62, originalPrice: 78, stock: 45, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200", prescription: true },
  { id: 14, name: "Atorvastatin 10mg", brand: "Lipitor", category: "Heart Care", price: 85, originalPrice: 110, stock: 50, image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=200", description: "Cholesterol management", prescription: true },
  { id: 15, name: "Calcium + Vitamin D", brand: "Shelcal", category: "Vitamins", price: 125, originalPrice: 150, stock: 75, image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=200", description: "For bone health" },
  { id: 16, name: "Ranitidine 150mg", brand: "Zinetac", category: "Digestive", price: 42, originalPrice: 55, stock: 60, image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200", description: "For acidity and heartburn" },
  { id: 17, name: "Diclofenac 50mg", brand: "Voveran", category: "Pain Relief", price: 38, originalPrice: 48, stock: 55, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200", description: "Anti-inflammatory pain reliever" },
  { id: 18, name: "Ciprofloxacin 500mg", brand: "Ciplox", category: "Antibiotics", price: 88, originalPrice: 110, stock: 35, image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=200", prescription: true },
  { id: 19, name: "Omega-3 Fish Oil", brand: "Seven Seas", category: "Vitamins", price: 195, originalPrice: 245, stock: 40, image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=200", description: "Heart and brain health" },
  { id: 20, name: "Levocetirizine 5mg", brand: "Xyzal", category: "Cold & Flu", price: 48, originalPrice: 60, stock: 70, image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200", description: "For allergies and hay fever" },
  { id: 21, name: "Sitagliptin 100mg", brand: "Januvia", category: "Diabetes", price: 185, originalPrice: 225, stock: 30, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200", prescription: true },
  { id: 22, name: "Clopidogrel 75mg", brand: "Plavix", category: "Heart Care", price: 95, originalPrice: 120, stock: 45, image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=200", prescription: true },
  { id: 23, name: "Iron + Folic Acid", brand: "Autrin", category: "Vitamins", price: 65, originalPrice: 80, stock: 85, image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=200", description: "For anemia" },
  { id: 24, name: "Pantoprazole 40mg", brand: "Pan-D", category: "Digestive", price: 68, originalPrice: 85, stock: 55, image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200", description: "For GERD and ulcers" },
  { id: 25, name: "Aceclofenac 100mg", brand: "Zerodol", category: "Pain Relief", price: 45, originalPrice: 58, stock: 60, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200", description: "For arthritis and joint pain" },
  { id: 26, name: "Doxycycline 100mg", brand: "Doxylab", category: "Antibiotics", price: 72, originalPrice: 90, stock: 40, image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=200", prescription: true },
  { id: 27, name: "Biotin 10000mcg", brand: "Satogain", category: "Vitamins", price: 245, originalPrice: 295, stock: 35, image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=200", description: "For hair and nail health" },
  { id: 28, name: "Fexofenadine 180mg", brand: "Allegra", category: "Cold & Flu", price: 85, originalPrice: 105, stock: 50, image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200", description: "Non-drowsy antihistamine" },
  { id: 29, name: "Vildagliptin 50mg", brand: "Galvus", category: "Diabetes", price: 145, originalPrice: 180, stock: 35, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200", prescription: true },
  { id: 30, name: "Amlodipine 5mg", brand: "Amlong", category: "Heart Care", price: 35, originalPrice: 45, stock: 80, image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=200", description: "For high blood pressure", prescription: true },
  { id: 31, name: "Moisturizing Cream", brand: "Cetaphil", category: "Skin Care", price: 285, originalPrice: 350, stock: 45, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200", description: "For dry and sensitive skin" },
  { id: 32, name: "Sunscreen SPF 50", brand: "Neutrogena", category: "Skin Care", price: 395, originalPrice: 480, stock: 30, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200", description: "UV protection" },
  { id: 33, name: "Salicylic Acid Face Wash", brand: "Himalaya", category: "Skin Care", price: 165, originalPrice: 195, stock: 55, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200", description: "For acne-prone skin" },
  { id: 34, name: "Vitamin E Capsules", brand: "Evion", category: "Skin Care", price: 48, originalPrice: 60, stock: 90, image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=200", description: "For skin and hair health" },
  { id: 35, name: "Hand Sanitizer 500ml", brand: "Dettol", category: "Hygiene", price: 125, originalPrice: 155, stock: 100, image: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=200", description: "99.9% germ protection" },
  { id: 36, name: "Digital Thermometer", brand: "Omron", category: "Devices", price: 295, originalPrice: 350, stock: 40, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200", description: "Fast and accurate reading" },
  { id: 37, name: "Blood Pressure Monitor", brand: "Omron", category: "Devices", price: 1850, originalPrice: 2200, stock: 20, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200", description: "Digital BP monitor" },
  { id: 38, name: "Pulse Oximeter", brand: "Dr Trust", category: "Devices", price: 895, originalPrice: 1100, stock: 35, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200", description: "SpO2 and pulse rate monitor" },
  { id: 39, name: "N95 Mask (Pack of 5)", brand: "3M", category: "Hygiene", price: 195, originalPrice: 250, stock: 150, image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=200", description: "High filtration protection" },
  { id: 40, name: "Protein Powder 1kg", brand: "MuscleBlaze", category: "Nutrition", price: 1450, originalPrice: 1800, stock: 25, image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=200", description: "Whey protein for muscle building" },
];

export const categories = [
  { name: "All", icon: "💊" },
  { name: "Pain Relief", icon: "🩹" },
  { name: "Antibiotics", icon: "💉" },
  { name: "Vitamins", icon: "🍊" },
  { name: "Cold & Flu", icon: "🤧" },
  { name: "Diabetes", icon: "🩺" },
  { name: "Heart Care", icon: "❤️" },
  { name: "Skin Care", icon: "✨" },
  { name: "Digestive", icon: "🫃" },
  { name: "Hygiene", icon: "🧴" },
  { name: "Devices", icon: "📱" },
  { name: "Nutrition", icon: "💪" },
];

export function getFeaturedMedicines(): Medicine[] {
  return medicines.filter(m => [1, 3, 7, 11, 15, 31, 36, 40].includes(m.id));
}

export function getMedicinesByCategory(category: string): Medicine[] {
  if (category === "All") return medicines;
  return medicines.filter(m => m.category === category);
}

export function searchMedicines(query: string): Medicine[] {
  const lowercaseQuery = query.toLowerCase();
  return medicines.filter(m => 
    m.name.toLowerCase().includes(lowercaseQuery) || 
    m.brand.toLowerCase().includes(lowercaseQuery) ||
    m.category.toLowerCase().includes(lowercaseQuery)
  );
}
