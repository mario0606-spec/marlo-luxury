import { PrismaClient, ItemCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const adminPassword = await bcrypt.hash("admin123!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@marloluxury.com" },
    update: {},
    create: {
      email: "admin@marloluxury.com",
      name: "Marlo Admin",
      passwordHash: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log("Admin user:", admin.email);

  // Demo customer
  const customerPassword = await bcrypt.hash("demo123!", 12);
  const customer = await prisma.user.upsert({
    where: { email: "demo@marloluxury.com" },
    update: {},
    create: {
      email: "demo@marloluxury.com",
      name: "Demo Customer",
      passwordHash: customerPassword,
      role: "CUSTOMER",
      emailVerified: new Date(),
    },
  });
  console.log("Demo customer:", customer.email);

  // Catalog items
  const items = [
    {
      name: "Rolex Submariner Date 41mm",
      slug: "rolex-submariner-date-41mm",
      description:
        "The iconic Rolex Submariner in Oystersteel with black dial. A legend in sports watches, waterproof to 300m.",
      category: ItemCategory.WATCH,
      brand: "Rolex",
      model: "Submariner Date",
      referenceNumber: "126610LN",
      retailPrice: 1250000, // €12,500
      dailyRate: 12500,     // €125/day
      weeklyRate: 75000,    // €750/week
      monthlyRate: 250000,  // €2,500/month
      depositAmount: 500000, // €5,000
      images: [
        "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800",
      ],
      available: true,
      featured: true,
    },
    {
      name: "Audemars Piguet Royal Oak 37mm",
      slug: "ap-royal-oak-37mm",
      description:
        "The Royal Oak — designed by Gérald Genta in 1972. Iconic octagonal bezel, integrated bracelet, petite tapisserie dial.",
      category: ItemCategory.WATCH,
      brand: "Audemars Piguet",
      model: "Royal Oak",
      referenceNumber: "15551OR.OO.1356OR.02",
      retailPrice: 4500000, // €45,000
      dailyRate: 45000,
      weeklyRate: 270000,
      monthlyRate: 900000,
      depositAmount: 1500000,
      images: [
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
      ],
      available: true,
      featured: true,
    },
    {
      name: "Cartier Love Bracelet 18K Yellow Gold",
      slug: "cartier-love-bracelet-18k-yellow-gold",
      description:
        "The legendary Cartier Love bracelet — a symbol of eternal love. 18K yellow gold with screwhead motif.",
      category: ItemCategory.JEWELRY,
      brand: "Cartier",
      model: "Love Bracelet",
      referenceNumber: "B6035517",
      retailPrice: 690000, // €6,900
      dailyRate: 6900,
      weeklyRate: 41400,
      monthlyRate: 138000,
      depositAmount: 250000,
      images: [
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800",
      ],
      available: true,
      featured: true,
    },
    {
      name: "Patek Philippe Nautilus 5711",
      slug: "patek-philippe-nautilus-5711",
      description:
        "The holy grail of sports watches. The Nautilus 5711 with olive-green dial — one of the most coveted timepieces ever made.",
      category: ItemCategory.WATCH,
      brand: "Patek Philippe",
      model: "Nautilus",
      referenceNumber: "5711/1A-014",
      retailPrice: 13500000, // €135,000 market value
      dailyRate: 135000,
      weeklyRate: 810000,
      monthlyRate: 2700000,
      depositAmount: 4000000,
      images: [
        "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800",
      ],
      available: true,
      featured: true,
    },
    {
      name: "Van Cleef & Arpels Alhambra Necklace",
      slug: "vcna-alhambra-necklace-turquoise",
      description:
        "The iconic Alhambra necklace with turquoise clover motifs in 18K yellow gold. A timeless Van Cleef & Arpels signature.",
      category: ItemCategory.JEWELRY,
      brand: "Van Cleef & Arpels",
      model: "Vintage Alhambra Necklace",
      retailPrice: 620000, // €6,200
      dailyRate: 6200,
      weeklyRate: 37200,
      monthlyRate: 124000,
      depositAmount: 200000,
      images: [
        "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800",
      ],
      available: true,
      featured: false,
    },
  ];

  for (const item of items) {
    const created = await prisma.item.upsert({
      where: { slug: item.slug },
      update: {},
      create: item,
    });
    console.log("Item:", created.name);
  }

  console.log("\nSeed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
