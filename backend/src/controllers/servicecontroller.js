const Service = require("../models/servicemodel");

const DEFAULT_SERVICES = [
  // ✂️ Hair Cutting
  {
    title: "Classic Men's Hair Cutting",
    category: "Hair Cutting",
    price: 150,
    originalPrice: 180,
    duration: "20 - 25 mins",
    icon: "✂️",
    popularBadge: "Daily Classic",
    description: "Traditional scissor and clipper cut tailored to your face shape, finished with neck razor cleanup and talc styling.",
  },
  {
    title: "Precision Skin Fade / Taper Cut",
    category: "Hair Cutting",
    price: 250,
    originalPrice: 300,
    duration: "30 - 35 mins",
    icon: "✂️",
    popularBadge: "Trending",
    description: "Modern zero / skin fade blending seamlessly into textured top, styled with premium matte pomade.",
  },
  {
    title: "Advanced Scissor Styling & Layer Cut",
    category: "Hair Cutting",
    price: 300,
    originalPrice: 350,
    duration: "35 mins",
    icon: "✂️",
    popularBadge: "",
    description: "Detailed scissor sculpting for medium to long hair, curtain bangs, wolf cut, or flow styling.",
  },
  {
    title: "Junior / Kids Hair Cutting",
    category: "Hair Cutting",
    price: 120,
    originalPrice: 150,
    duration: "15 - 20 mins",
    icon: "👶",
    popularBadge: "",
    description: "Gentle and patient haircutting for children under 12 years with clean finish.",
  },
  {
    title: "Refreshing Hair Wash & Conditioning",
    category: "Hair Cutting",
    price: 80,
    originalPrice: 100,
    duration: "10 mins",
    icon: "🚿",
    popularBadge: "",
    description: "Invigorating deep shampoo cleanse followed by cooling conditioner and quick blow-dry.",
  },

  // 🪒 Shaving & Beard Grooming ("Saving")
  {
    title: "Clean Razor Shaving (Saving)",
    category: "Shaving & Beard",
    price: 100,
    originalPrice: 120,
    duration: "15 mins",
    icon: "🪒",
    popularBadge: "Essential",
    description: "Smooth single-blade razor shave with warm lather, alum stone treatment, and cooling aftershave splash.",
  },
  {
    title: "Royal Hot-Towel Shaving with Balm",
    category: "Shaving & Beard",
    price: 180,
    originalPrice: 220,
    duration: "25 mins",
    icon: "👑",
    popularBadge: "Luxury Pick",
    description: "Pre-shave essential oils, steaming hot towel wrap, silky shave, and sandalwood hydrating soothing balm.",
  },
  {
    title: "Beard Trim, Shape & Razor Line-Up",
    category: "Shaving & Beard",
    price: 120,
    originalPrice: 150,
    duration: "20 mins",
    icon: "🧔",
    popularBadge: "Most Requested",
    description: "Precision machine fade on beard, razor crisp cheek and neck line-up, finished with cedarwood beard butter.",
  },
  {
    title: "Luxury Beard Spa & Hot Oil Treatment",
    category: "Shaving & Beard",
    price: 220,
    originalPrice: 280,
    duration: "25 mins",
    icon: "✨",
    popularBadge: "",
    description: "Deep beard wash, exfoliation of skin beneath beard, warm steam with argan oil massage for soft, itch-free beard.",
  },
  {
    title: "Mustache Trim & Styling",
    category: "Shaving & Beard",
    price: 50,
    originalPrice: 60,
    duration: "10 mins",
    icon: "🥸",
    popularBadge: "",
    description: "Symmetrical mustache trimming and handlebar wax styling.",
  },

  // 💆‍♂️ Head Massage & Hair Spa
  {
    title: "Ayurvedic Almond / Navratna Head Massage",
    category: "Head Massage & Spa",
    price: 150,
    originalPrice: 200,
    duration: "20 mins",
    icon: "💆‍♂️",
    popularBadge: "Deep Relief",
    description: "Stress-busting traditional champi massage using warm herbal almond or cooling Navratna oil for mental relaxation.",
  },
  {
    title: "Mint Ice Cool Relaxing Head Massage",
    category: "Head Massage & Spa",
    price: 180,
    originalPrice: 230,
    duration: "25 mins",
    icon: "❄️",
    popularBadge: "",
    description: "Cooling menthol therapy massage targeting pressure points on temples and neck to relieve headaches and fatigue.",
  },
  {
    title: "Nourishing Deep Hair Spa & Steam",
    category: "Head Massage & Spa",
    price: 450,
    originalPrice: 600,
    duration: "40 mins",
    icon: "🧴",
    popularBadge: "Best Value",
    description: "Intense keratin moisture hair mask, scalp acupressure, ozone steam treatment, and wash for frizz-free hair.",
  },
  {
    title: "Anti-Dandruff Scalp Clarifying Treatment",
    category: "Head Massage & Spa",
    price: 350,
    originalPrice: 450,
    duration: "30 mins",
    icon: "🌿",
    popularBadge: "",
    description: "Tea tree and salicylic acid scalp exfoliation to eliminate stubborn dandruff flakes and relieve itchy scalp.",
  },

  // ✨ Face Care, D-Tan & Cleanup
  {
    title: "O3+ / Raaga D-Tan Sun Removal Face Pack",
    category: "Face Care & D-Tan",
    price: 250,
    originalPrice: 350,
    duration: "20 mins",
    icon: "☀️",
    popularBadge: "Instant Glow",
    description: "Removes deep sun tan, dark patches, and pollution buildup with kojic acid and clove extract.",
  },
  {
    title: "Activated Charcoal Deep Cleansing Cleanup",
    category: "Face Care & D-Tan",
    price: 350,
    originalPrice: 450,
    duration: "30 mins",
    icon: "🖤",
    popularBadge: "",
    description: "Deep pore scrubbing, blackhead removal, steam, and bamboo charcoal detox peel-off mask for oily skin.",
  },
  {
    title: "Gold Radiance Face Bleach & Glow",
    category: "Face Care & D-Tan",
    price: 300,
    originalPrice: 400,
    duration: "25 mins",
    icon: "🌟",
    popularBadge: "",
    description: "Even tone facial bleaching with gold dust shimmer to brighten dull skin tone before special events.",
  },
  {
    title: "Gentleman's Herbal Fruit Facial",
    category: "Face Care & D-Tan",
    price: 550,
    originalPrice: 750,
    duration: "45 mins",
    icon: "🍇",
    popularBadge: "Luxury Relax",
    description: "5-step cleansing, papaya scrub, nourishing face cream massage, toning serum, and collagen rubber mask.",
  },

  // 🎨 Hair & Beard Color
  {
    title: "Natural Black / Dark Brown Hair Color",
    category: "Hair & Beard Color",
    price: 250,
    originalPrice: 300,
    duration: "30 mins",
    icon: "🎨",
    popularBadge: "100% Gray Coverage",
    description: "Even application of premium ammonia-free color with long-lasting natural shine and zero scalp irritation.",
  },
  {
    title: "Beard Color & Gray Blending",
    category: "Hair & Beard Color",
    price: 150,
    originalPrice: 200,
    duration: "20 mins",
    icon: "🧔",
    popularBadge: "",
    description: "Specialized gentle beard dye targeting patchy gray hairs while protecting sensitive facial skin.",
  },
  {
    title: "Ammonia-Free Organic Herbal Dye",
    category: "Hair & Beard Color",
    price: 350,
    originalPrice: 450,
    duration: "35 mins",
    icon: "🌱",
    popularBadge: "",
    description: "Enriched with henna, amla, and bhringraj extracts for chemical-sensitive scalps.",
  },

  // 🎁 Super Saver Combos (Cutting + Saving + More)
  {
    title: "Gentleman's Daily: Haircut + Clean Shave + Hair Wash",
    category: "Super Saver Combos",
    price: 280,
    originalPrice: 330,
    savings: "Save ₹50",
    duration: "40 mins",
    icon: "🎁",
    popularBadge: "Most Popular Combo",
    description: "The complete regular grooming pack: Classic Haircut + Smooth Clean Shave + Refreshing Shampoo Wash.",
  },
  {
    title: "Royal Grooming: Fade Cut + Hot Towel Shave + Head Massage",
    category: "Super Saver Combos",
    price: 499,
    originalPrice: 630,
    savings: "Save ₹131",
    duration: "60 mins",
    icon: "👑",
    popularBadge: "Best Value Pack",
    description: "Precision Skin Fade/Taper + Royal Hot-Towel Shave with balm + 20-min Ayurvedic Head Champi Massage.",
  },
  {
    title: "Festive Makeover: Haircut + Beard Shape + D-Tan Face Pack + Massage",
    category: "Super Saver Combos",
    price: 799,
    originalPrice: 1050,
    savings: "Save ₹251",
    duration: "75 mins",
    icon: "🌟",
    popularBadge: "Ultimate Transformation",
    description: "All-in-one head-to-neck glow: Haircut + Beard Sculpting + Sun D-Tan Removal Pack + Cooling Head Massage.",
  },
];

async function ensureSeedServices() {
  try {
    const count = await Service.countDocuments();
    if (count === 0) {
      await Service.insertMany(DEFAULT_SERVICES);
      console.log(`[SEED SERVICES] Seeded ${DEFAULT_SERVICES.length} salon services & price rates.`);
    }
  } catch (error) {
    console.error("[SEED SERVICES ERROR]", error.message);
  }
}

// PUBLIC: Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isAvailable: true }).sort({ category: 1, price: 1 });

    // Group services by category for quick tab view
    const grouped = {};
    services.forEach((s) => {
      if (!grouped[s.category]) grouped[s.category] = [];
      grouped[s.category].push(s);
    });

    return res.json({
      success: true,
      count: services.length,
      categories: Object.keys(grouped),
      grouped,
      services,
    });
  } catch (error) {
    console.error("[SERVICES ERROR]", error);
    return res.status(500).json({
      message: "Failed to load salon services and price amounts.",
    });
  }
};

// ADMIN: Create service
exports.createService = async (req, res) => {
  try {
    const {
      title,
      category,
      price,
      originalPrice,
      duration,
      description,
      icon,
      popularBadge,
      savings,
    } = req.body;

    if (!title || price === undefined) {
      return res.status(400).json({
        message: "Service title and price amount are required.",
      });
    }

    const service = await Service.create({
      title: title.trim(),
      category: category || "Hair Cutting",
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      duration: duration || "20 mins",
      description: (description || "").trim(),
      icon: icon || "✂️",
      popularBadge: (popularBadge || "").trim(),
      savings: (savings || "").trim(),
      isAvailable: true,
    });

    return res.status(201).json({
      success: true,
      message: `Service "${service.title}" created with amount ₹${service.price}.`,
      service,
    });
  } catch (error) {
    console.error("[SERVICES ERROR]", error);
    return res.status(500).json({
      message: error.message || "Failed to create service.",
    });
  }
};

// ADMIN: Update service
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.price !== undefined) {
      updates.price = Number(updates.price);
    }
    if (updates.originalPrice !== undefined && updates.originalPrice !== null) {
      updates.originalPrice = Number(updates.originalPrice);
    }

    const service = await Service.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({
        message: "Service not found.",
      });
    }

    return res.json({
      success: true,
      message: `Service "${service.title}" updated successfully!`,
      service,
    });
  } catch (error) {
    console.error("[SERVICES ERROR]", error);
    return res.status(500).json({
      message: error.message || "Failed to update service.",
    });
  }
};

// ADMIN: Delete service
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Service.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        message: "Service not found.",
      });
    }

    return res.json({
      success: true,
      message: `Service "${deleted.title}" deleted successfully.`,
    });
  } catch (error) {
    console.error("[SERVICES ERROR]", error);
    return res.status(500).json({
      message: error.message || "Failed to delete service.",
    });
  }
};

