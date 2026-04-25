#!/usr/bin/env ts-node
/**
 * Run: npm run seed
 * Make sure MONGODB_URI is set in .env.local
 * All prices are in Egyptian Pounds (EGP)
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

const ProductSchema = new mongoose.Schema({
  name: String, description: String, price: Number, category: String,
  images: [String], sizes: [String], stock: Number, featured: Boolean, tags: [String],
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true },
  password: String, role: String,
}, { timestamps: true });

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
  const User = mongoose.models.User || mongoose.model("User", UserSchema);

  await Product.deleteMany({});
  console.log("🗑  Cleared existing products");

  // ─────────────────────────────────────────────
  // ALL PRICES IN EGP (Egyptian Pounds)
  // Reference ranges (2025 Egyptian market):
  //   Basic tanks/tees:       220 – 650 EGP
  //   Premium tees:           550 – 950 EGP
  //   Shorts:                 450 – 900 EGP
  //   Leggings / joggers:     750 – 1,400 EGP
  //   Hoodies:              1,100 – 2,200 EGP
  //   Jackets / windbreakers: 1,400 – 2,800 EGP
  //   Accessories (caps etc): 250 – 650 EGP
  //   Gloves / gear:          350 – 900 EGP
  //   Resistance bands:       450 – 1,100 EGP
  //   Sports bras:            450 – 850 EGP
  //   Sets (2-piece):       1,400 – 2,600 EGP
  // ─────────────────────────────────────────────
  const products = [

    // ── TOPS ─────────────────────────────────────────────────────────────
    {
      name: "Apex Compression Tee",
      description: "Four-way stretch compression fabric with geometric hexagonal panel design. Moisture-wicking technology keeps you dry during the most intense sessions. Flatlock seams prevent chafing on long runs and training blocks.",
      price: 749,
      category: "tops",
      images: ["https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80"],
      sizes: ["S","M","L","XL","XXL"], stock: 45, featured: true,
      tags: ["compression","gym","geometric","training","mens"],
    },
    {
      name: "GridForce Training Tank",
      description: "Lightweight muscle tank with breathable mesh inserts and bold grid pattern. Dropped armholes for full range of motion. Perfect for weightlifting and CrossFit sessions.",
      price: 420,
      category: "tops",
      images: ["https://images.unsplash.com/photo-1554568218-0f1715e72254?w=600&q=80"],
      sizes: ["S","M","L","XL"], stock: 60, featured: false,
      tags: ["tank","mesh","weightlifting","athletic","mens"],
    },
    {
      name: "Titan Oversized Muscle Tee",
      description: "Oversized muscle tee crafted from ultra-soft cotton blend. Angular cut with dropped shoulders for a premium streetwear-meets-gym aesthetic. A staple for rest-day fits.",
      price: 580,
      category: "tops",
      images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"],
      sizes: ["S","M","L","XL","XXL"], stock: 30, featured: true,
      tags: ["oversized","cotton","streetwear","casual","mens"],
    },
    {
      name: "Hexagon Performance Hoodie",
      description: "Premium fleece hoodie with tonal hexagonal embossed pattern. Kangaroo pocket, adjustable drawstring hood. Ideal for warm-up, cool-down, and outdoor runs in cool weather.",
      price: 1390,
      category: "tops",
      images: ["https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80"],
      sizes: ["S","M","L","XL","XXL"], stock: 25, featured: true,
      tags: ["hoodie","fleece","geometric","warmup","mens"],
    },
    {
      name: "Hi-Dri Sports Tank — Men",
      description: "Sweat-wicking Hi-Dri fabric keeps you dry through two-a-days. Slim-fit cut with contrast side panels and reflective APEX wordmark. Lightweight and breathable for cardio and HIIT.",
      price: 350,
      category: "tops",
      images: ["https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=600&q=80"],
      sizes: ["S","M","L","XL","XXL"], stock: 80, featured: false,
      tags: ["tank","hi-dri","moisture-wicking","cardio","mens"],
    },
    {
      name: "Carbon Ribbed Stringer",
      description: "Ultra-thin ribbed stringer inspired by carbon fibre weave. Extra-wide arm holes and deep scoop back for maximum ventilation during intense lifting sessions.",
      price: 280,
      category: "tops",
      images: ["https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80"],
      sizes: ["S","M","L","XL"], stock: 55, featured: false,
      tags: ["stringer","ribbed","lifting","ventilation","mens"],
    },
    {
      name: "Prism Long-Sleeve Compression Top",
      description: "Long-sleeve compression top with prism-pattern side panels. UPF 40+ sun protection, four-way stretch, and thumbhole cuffs. Ideal for outdoor training and running.",
      price: 920,
      category: "tops",
      images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80"],
      sizes: ["S","M","L","XL","XXL"], stock: 35, featured: false,
      tags: ["long-sleeve","compression","UPF","running","mens"],
    },

    // ── WOMEN TOPS ───────────────────────────────────────────────────────
    {
      name: "TwinSleeve Oversized Sports Tee — Women",
      description: "Relaxed oversized sports tee with twin-sleeve colour-block detail. Soft cotton-poly blend, dropped shoulders, and raw-edge hem. Perfect for gym and everyday wear.",
      price: 650,
      category: "tops",
      images: ["https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=600&q=80"],
      sizes: ["XS","S","M","L","XL"], stock: 40, featured: true,
      tags: ["oversized","women","colorblock","casual","tee"],
    },
    {
      name: "Elevation Edge Performance Tee — Women",
      description: "Patterned athletic tee for women with geometric edge print. Moisture-wicking, anti-odour finish, and a feminine athletic cut. Available in multiple colourways.",
      price: 580,
      category: "tops",
      images: ["https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&q=80"],
      sizes: ["XS","S","M","L"], stock: 50, featured: false,
      tags: ["women","performance","geometric","anti-odour","tee"],
    },
    {
      name: "Apex Sports Bra — Medium Support",
      description: "Medium-support sports bra with geometric strap design and moisture-wicking lining. Built-in removable cups, flat-lock seams, and a secure racerback fit. Suitable for yoga to weightlifting.",
      price: 620,
      category: "tops",
      images: ["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80"],
      sizes: ["XS","S","M","L","XL"], stock: 65, featured: true,
      tags: ["sports-bra","women","medium-support","yoga","gym"],
    },
    {
      name: "Grid Crop Tank — Women",
      description: "Cropped training tank with grid-mesh panels for targeted ventilation. Shelf-bra inner with adjustable straps. Pairs perfectly with high-waist leggings.",
      price: 480,
      category: "tops",
      images: ["https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=600&q=80"],
      sizes: ["XS","S","M","L"], stock: 45, featured: false,
      tags: ["crop","tank","women","mesh","shelf-bra"],
    },

    // ── BOTTOMS ───────────────────────────────────────────────────────────
    {
      name: "Vortex Tapered Jogger",
      description: "Tapered jogger with diagonal geometric print on side panels. Four-way stretch fabric, deep zip pockets, and cinched ankle cuffs for a clean silhouette.",
      price: 1100,
      category: "bottoms",
      images: ["https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&q=80"],
      sizes: ["S","M","L","XL"], stock: 40, featured: true,
      tags: ["jogger","tapered","geometric","pockets","mens"],
    },
    {
      name: "Prism 7-Inch Training Shorts",
      description: "7\" inseam training shorts with prism-patterned panels. Built-in compression brief liner, reflective details, and zippered side pocket for your phone.",
      price: 750,
      category: "bottoms",
      images: ["https://images.unsplash.com/photo-1581044777550-4cfa30c4a6ad?w=600&q=80"],
      sizes: ["S","M","L","XL","XXL"], stock: 55, featured: false,
      tags: ["shorts","training","compression","reflective","mens"],
    },
    {
      name: "Carbon Fibre Leggings — Women",
      description: "Full-length leggings inspired by carbon fibre weave patterns. High-waist design with hidden waistband pocket. UPF 50+ and 100% squat-proof fabric.",
      price: 990,
      category: "bottoms",
      images: ["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80"],
      sizes: ["XS","S","M","L","XL"], stock: 35, featured: true,
      tags: ["leggings","women","high-waist","squat-proof","UPF"],
    },
    {
      name: "Speed Hi-Dri Sports Pants — Men",
      description: "Full-length Hi-Dri sports pants with zip-cuff ankles and two deep hand pockets. Breathable, moisture-wicking, and built for running, cycling, and training outdoors.",
      price: 1390,
      category: "bottoms",
      images: ["https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&q=80"],
      sizes: ["S","M","L","XL","XXL"], stock: 30, featured: false,
      tags: ["pants","hi-dri","running","zip-cuff","mens"],
    },
    {
      name: "Hexagonal Biker Shorts — Women",
      description: "4\" inseam biker shorts with hexagonal jacquard pattern. Ultra-high waistband, phone pocket, and four-way stretch compression fabric. Great for cycling, yoga, and the gym.",
      price: 650,
      category: "bottoms",
      images: ["https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=600&q=80"],
      sizes: ["XS","S","M","L","XL"], stock: 50, featured: false,
      tags: ["biker-shorts","women","high-waist","yoga","cycling"],
    },
    {
      name: "Stealth Training Shorts — 5 Inch",
      description: "Minimalist 5\" training shorts in matte-black stretch fabric. Side split hem, internal drawstring, and airy mesh liner. Built for speed work and sprint sessions.",
      price: 680,
      category: "bottoms",
      images: ["https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80"],
      sizes: ["S","M","L","XL"], stock: 45, featured: false,
      tags: ["shorts","speed","sprint","matte","mens"],
    },
    {
      name: "Wide Leg Training Pants — Women",
      description: "Relaxed wide-leg pants in a soft, brushed fabric. Elasticated drawstring waist, two side pockets, and a flowy cut that transitions seamlessly from training to the street.",
      price: 980,
      category: "bottoms",
      images: ["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80"],
      sizes: ["XS","S","M","L","XL"], stock: 38, featured: true,
      tags: ["wide-leg","women","relaxed","street","pockets"],
    },

    // ── OUTERWEAR ─────────────────────────────────────────────────────────
    {
      name: "Stealth Packable Windbreaker",
      description: "Ultra-lightweight packable windbreaker with angular geometric seam lines. DWR water-resistant finish, hidden hood in collar, and underarm mesh venting. Packs into its own pocket.",
      price: 1850,
      category: "outerwear",
      images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80"],
      sizes: ["S","M","L","XL","XXL"], stock: 20, featured: true,
      tags: ["windbreaker","packable","DWR","running","mens"],
    },
    {
      name: "Block Training Zip Jacket",
      description: "Colour-block zip-up training jacket with stand collar and geometric panel construction. Slim athletic fit with stretch side panels for unrestricted movement during training.",
      price: 2100,
      category: "outerwear",
      images: ["https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&q=80"],
      sizes: ["S","M","L","XL"], stock: 18, featured: false,
      tags: ["jacket","color-block","training","zip-up","mens"],
    },
    {
      name: "Vortex Quarter-Zip Pullover",
      description: "Midlayer quarter-zip pullover in moisture-wicking performance fleece. Geometric vortex chest print, thumbhole cuffs, and two zip pockets. Ideal for cool-weather training.",
      price: 1650,
      category: "outerwear",
      images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80"],
      sizes: ["S","M","L","XL","XXL"], stock: 22, featured: true,
      tags: ["quarter-zip","fleece","geometric","midlayer","mens"],
    },

    // ── ACCESSORIES ───────────────────────────────────────────────────────
    {
      name: "Geo Performance Cap",
      description: "6-panel structured cap with embroidered geometric logo on front. Moisture-wicking sweatband, eyelets for breathability, and adjustable snapback closure.",
      price: 320,
      category: "accessories",
      images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80"],
      sizes: ["S","M","L","XL"], stock: 80, featured: false,
      tags: ["cap","hat","snapback","gym","unisex"],
    },
    {
      name: "Apex Training Gloves",
      description: "Half-finger training gloves with padded palms and integrated wrist wrap support. Anti-slip silicone grip pattern on fingertips and breathable mesh back for ventilation.",
      price: 480,
      category: "accessories",
      images: ["https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80"],
      sizes: ["S","M","L","XL"], stock: 50, featured: false,
      tags: ["gloves","grip","wrist","weightlifting","unisex"],
    },
    {
      name: "Titan Resistance Band Set (5 bands)",
      description: "Set of 5 premium fabric-outer resistance bands with geometric pattern. Covers light to extra-heavy resistance levels (5 kg – 45 kg). Includes a compact zip carry pouch.",
      price: 850,
      category: "accessories",
      images: ["https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=600&q=80"],
      sizes: ["S","M","L","XL"], stock: 65, featured: true,
      tags: ["bands","resistance","set","home-gym","unisex"],
    },
    {
      name: "Apex Gym Duffel Bag — 35L",
      description: "35-litre duffel with separate wet/dry compartment, ventilated shoe pocket, and exterior water-bottle holders. Reinforced carry handles and removable padded shoulder strap.",
      price: 1250,
      category: "accessories",
      images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80"],
      sizes: ["S","M","L","XL"], stock: 30, featured: true,
      tags: ["bag","duffel","gym-bag","unisex","travel"],
    },
    {
      name: "Grip Socks — 3-Pack",
      description: "Anti-slip grip socks with cushioned arch support and geometric grip pattern on sole. Ankle-length, moisture-wicking, and reinforced heel and toe. Pack of 3 pairs.",
      price: 390,
      category: "accessories",
      images: ["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80"],
      sizes: ["S","M","L","XL"], stock: 120, featured: false,
      tags: ["socks","grip","anti-slip","3-pack","unisex"],
    },
    {
      name: "Lifting Belt — 4-Inch Nylon",
      description: "4-inch nylon weightlifting belt with quick-release lever buckle. Reinforced stitching, contoured back panel for lumbar support, and adjustable dual-prong closure.",
      price: 950,
      category: "accessories",
      images: ["https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&q=80"],
      sizes: ["S","M","L","XL"], stock: 28, featured: false,
      tags: ["belt","lifting","lumbar","powerlifting","unisex"],
    },
    {
      name: "Shaker Bottle — 700ml",
      description: "BPA-free 700ml shaker with stainless-steel mixing ball, leak-proof flip lid, and measurements printed on the side. APEX geometric logo embossed on body.",
      price: 250,
      category: "accessories",
      images: ["https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&q=80"],
      sizes: ["S","M","L","XL"], stock: 100, featured: false,
      tags: ["shaker","bottle","supplement","BPA-free","unisex"],
    },

    // ── FOOTWEAR ─────────────────────────────────────────────────────────
    {
      name: "Apex Cross-Trainer — Low",
      description: "Lightweight cross-training shoe with hexagonal outsole pattern for multi-directional grip. Wide toe box for powerlifting stability, cushioned midsole for cardio and HIIT.",
      price: 2800,
      category: "footwear",
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"],
      sizes: ["S","M","L","XL"], stock: 25, featured: true,
      tags: ["shoes","cross-trainer","grip","lifting","unisex"],
    },
    {
      name: "Stealth Running Shoe",
      description: "Neutral-cushioned running shoe with breathable engineered mesh upper and geometric sole pattern. Responsive foam midsole absorbs impact across long distances.",
      price: 2450,
      category: "footwear",
      images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80"],
      sizes: ["S","M","L","XL"], stock: 20, featured: false,
      tags: ["shoes","running","cushioned","neutral","unisex"],
    },

  ];

  await Product.insertMany(products);
  console.log(`✅ Inserted ${products.length} products (prices in EGP)`);

  // ── Create admin user ────────────────────────────────────────────────────
  const bcryptjs = await import("bcryptjs"); const bcrypt = bcryptjs.default;
  const adminExists = await User.findOne({ email: "admin@gymstore.com" });
  if (!adminExists) {
    const hashed = await bcrypt.hash("Admin@123", 12);
    await User.create({
      name: "Store Admin",
      email: "admin@gymstore.com",
      password: hashed,
      role: "admin",
    });
    console.log("✅ Admin created → admin@gymstore.com / Admin@123");
  } else {
    console.log("ℹ️  Admin already exists");
  }

  await mongoose.disconnect();
  console.log("🎉 Seed complete!");
  console.log(`   ${products.length} products | Price range: ${Math.min(...products.map(p=>p.price))} – ${Math.max(...products.map(p=>p.price))} EGP`);
}

seed().catch((err) => { console.error(err); process.exit(1); });
