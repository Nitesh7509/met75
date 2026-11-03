import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import AppointmentModal from "../components/AppointmentModal";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const FALLBACK_CATEGORIES = [
  "All",
  "Hair Cutting",
  "Shaving & Beard",
  "Head Massage & Spa",
  "Face Care & D-Tan",
  "Hair & Beard Color",
  "Super Saver Combos",
];

export default function Pricing() {
  const navigate = useNavigate();

  // Authentication state
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("salonUser");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Services state
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Interactive Estimate / Bill Calculator
  const [selectedItems, setSelectedItems] = useState([]);
  const [showEstimateDrawer, setShowEstimateDrawer] = useState(false);

  // Appointment Modal state
  const [bookingService, setBookingService] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("salonToken");
    if (token) {
      api.get("/auth/me")
        .then(({ data }) => {
          setUser(data.user);
          localStorage.setItem("salonUser", JSON.stringify(data.user));
        })
        .catch(() => {
          localStorage.removeItem("salonToken");
          localStorage.removeItem("salonUser");
          setUser(null);
        });
    }

    // Load services & pricing amounts from backend
    setLoading(true);
    api.get("/services")
      .then(({ data }) => {
        if (data.services && data.services.length > 0) {
          setServices(data.services);
        }
      })
      .catch((err) => {
        console.warn("Using fallback services:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    localStorage.removeItem("salonToken");
    localStorage.removeItem("salonUser");
    setUser(null);
  }

  const profileDestination = user?.role === "admin" ? "/admin" : "/dashboard";

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter((item) => {
      const matchesCat =
        selectedCategory === "All" || item.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (q === "saving" && (item.category.includes("Shaving") || item.title.toLowerCase().includes("shaving") || item.title.toLowerCase().includes("shave"))) ||
        (q === "cutting" && (item.category.includes("Cutting") || item.title.toLowerCase().includes("cut")));

      return matchesCat && matchesSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  // Estimate calculations
  const estimateTotal = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + (item.price || 0), 0);
  }, [selectedItems]);

  const estimateOriginalTotal = useMemo(() => {
    return selectedItems.reduce(
      (sum, item) => sum + (item.originalPrice || item.price || 0),
      0
    );
  }, [selectedItems]);

  const estimateSavings = estimateOriginalTotal - estimateTotal;

  function toggleItemSelection(item) {
    if (selectedItems.some((s) => s._id === item._id)) {
      setSelectedItems((prev) => prev.filter((s) => s._id !== item._id));
    } else {
      setSelectedItems((prev) => [...prev, item]);
      setShowEstimateDrawer(true);
    }
  }

  function handleBookEstimate() {
    if (selectedItems.length === 0) return;

    const comboTitle = selectedItems.map((s) => s.title).join(" + ");
    setBookingService({
      title: comboTitle,
      price: `₹${estimateTotal}`,
      category: "Selected Custom Package",
    });
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-between text-[#24231f]">
      {/* Top Navbar */}
      <header className="border-b border-[#e7e0d5] bg-white/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 font-serif text-xl font-bold tracking-wider text-[#392918] hover:opacity-90 transition"
          >
            <span className="text-2xl">💇</span>
            <span>MET75 SALON</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-[#66513e] hover:text-[#24231f] transition"
            >
              Home
            </Link>
            <Link
              to="/hair-designs"
              className="text-sm font-medium text-[#66513e] hover:text-[#24231f] transition"
            >
              Hair Designs
            </Link>
            <Link
              to="/pricing"
              className="text-sm font-bold text-[#392918] underline underline-offset-4"
            >
              Amount & Pricing
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-[#66513e] hover:text-[#24231f] transition"
            >
              About
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#f6f4ef] border border-[#e7e0d5] rounded-full text-xs font-medium text-[#392918]"
                  title={user.email}
                >
                  <span>👤</span>
                  <span className="font-semibold">{user.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#e9e3d8] text-[#66513e]">
                    {user.role}
                  </span>
                </div>

                <Link
                  to={profileDestination}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#66513e] text-white hover:bg-[#524131] transition shadow-xs"
                >
                  Dashboard →
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-[#817d76] hover:text-red-700 hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#66513e] hover:bg-[#f6f4ef] transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#66513e] text-white hover:bg-[#524131] transition shadow-xs"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#f0ebe1] to-[#faf8f5] py-14 px-6 border-b border-[#e7e0d5]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-[#ded6c9] text-[#66513e] inline-block shadow-2xs">
            SALON RATE CARD & PRICING
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#24231f] leading-tight">
            Haircut, Shaving & Salon Amount Menu
          </h1>
          <p className="text-sm sm:text-base text-[#6a665f] max-w-2xl mx-auto leading-relaxed">
            Transparent pricing for professional hair cutting, clean royal shaving, stress-relief head massages, face d-tan, and super saver grooming combos.
          </p>

          {/* Quick highlights */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-[#66513e] font-semibold">
            <span className="flex items-center gap-1.5">
              <span>✓</span> Sterilized & Fresh Blades
            </span>
            <span className="flex items-center gap-1.5">
              <span>✓</span> No Hidden Taxes (All-Inclusive)
            </span>
            <span className="flex items-center gap-1.5">
              <span>✓</span> Master Stylists & Barbers
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Search & Category Tabs */}
        <div className="space-y-4 mb-8">
          {/* Search Box */}
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cutting, saving / shave, massage, d-tan, color, combos..."
              className="w-full px-5 py-3.5 pl-11 rounded-2xl bg-white border border-[#ded9d0] text-sm text-[#24231f] placeholder:text-[#8a847a] focus:outline-none focus:ring-2 focus:ring-[#66513e] shadow-xs"
            />
            <span className="absolute left-4 top-3.5 text-base text-[#8a847a]">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-3.5 text-xs text-[#8a847a] hover:text-[#24231f] font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
            {FALLBACK_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#66513e] text-white shadow-sm"
                      : "bg-white border border-[#ded9d0] text-[#66513e] hover:bg-[#f6f4ef]"
                  }`}
                >
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Highlight Banner: Super Saver Combos */}
        {selectedCategory === "All" && !searchQuery && (
          <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#66513e] to-[#4d3b2d] text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-stone-900 inline-block">
                ★ BEST VALUE PACKAGE
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                Gentleman's Royal Grooming Combo
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 max-w-xl">
                Haircut (Fade or Classic) + Royal Hot Towel Shave + 20-min Ayurvedic Head Massage.
                Get the complete pampering experience for only <strong>₹499</strong> (Save ₹131)!
              </p>
            </div>
            <button
              onClick={() =>
                setBookingService({
                  title: "Royal Grooming: Fade Cut + Hot Towel Shave + Head Massage",
                  price: "₹499",
                  category: "Super Saver Combos",
                })
              }
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-sm shadow-md transition transform hover:scale-102 flex-shrink-0"
            >
              Book Royal Combo for ₹499 →
            </button>
          </div>
        )}

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-20 text-[#8a847a]">
            Loading salon services & amount details...
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#f0ebe1] text-[#66513e] flex items-center justify-center text-2xl">
              ✂️
            </div>
            <h3 className="font-serif text-xl font-bold text-[#24231f]">
              No services matched "{searchQuery}"
            </h3>
            <p className="text-xs text-[#8a847a]">
              Try searching for "cutting", "saving", "massage", or reset the category.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="px-5 py-2.5 rounded-xl bg-[#66513e] text-white text-xs font-bold hover:bg-[#524131] transition"
            >
              View Full Price Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const isSelectedInEstimate = selectedItems.some(
                (s) => s._id === service._id
              );

              return (
                <article
                  key={service._id}
                  className={`bg-white rounded-3xl border transition-all p-6 flex flex-col justify-between hover:shadow-md relative ${
                    isSelectedInEstimate
                      ? "border-[#66513e] ring-2 ring-[#66513e]/20 bg-amber-50/10"
                      : "border-[#e7e0d5] hover:border-[#ded9d0]"
                  }`}
                >
                  {/* Top Bar: Icon, Category & Badges */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#f6f4ef] text-[#66513e] border border-[#e7e0d5] flex items-center justify-center text-2xl shadow-2xs">
                        {service.icon || "✂️"}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {service.popularBadge && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                            {service.popularBadge}
                          </span>
                        )}
                        {service.savings && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
                            {service.savings}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Category */}
                    <div className="mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a7057] block">
                        {service.category}
                      </span>
                      <h4 className="font-serif text-xl font-bold text-[#24231f] mt-0.5">
                        {service.title}
                      </h4>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#6a665f] leading-relaxed line-clamp-3 mb-4">
                      {service.description}
                    </p>
                  </div>

                  {/* Bottom: Price Amount, Duration & Action Buttons */}
                  <div className="pt-4 border-t border-[#f0ebe1] space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-serif text-2xl font-bold text-[#24231f]">
                            ₹{service.price}
                          </span>
                          {service.originalPrice && (
                            <span className="text-xs text-[#8a847a] line-through font-medium">
                              ₹{service.originalPrice}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#8a7057] font-medium block">
                          ⏱ Est. {service.duration || "20 mins"}
                        </span>
                      </div>

                      {/* Add to estimate calculator button */}
                      <button
                        type="button"
                        onClick={() => toggleItemSelection(service)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                          isSelectedInEstimate
                            ? "bg-[#66513e] text-white"
                            : "bg-[#f6f4ef] text-[#66513e] hover:bg-[#eae4d9] border border-[#ded9d0]"
                        }`}
                        title="Add to total bill calculator"
                      >
                        <span>{isSelectedInEstimate ? "✓ Added" : "+ Add"}</span>
                      </button>
                    </div>

                    {/* One-click Book Service */}
                    <button
                      type="button"
                      onClick={() =>
                        setBookingService({
                          title: service.title,
                          price: `₹${service.price}`,
                          category: service.category,
                        })
                      }
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-[#66513e] hover:bg-[#524131] text-white shadow-xs transition flex items-center justify-center gap-2"
                    >
                      <span>📅</span>
                      <span>Book for ₹{service.price}</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Detailed Price List Table for Quick Reference */}
        <section className="mt-16 bg-white border border-[#e7e0d5] rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="pb-6 border-b border-[#f0ebe1] mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8a7057] block">
              COMPLETE PRICE CARD OVERVIEW
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#24231f] mt-1">
              Standard Rates at a Glance
            </h3>
            <p className="text-xs text-[#6a665f] mt-1">
              Quick comparison of our salon cutting, saving (shaving), and grooming amounts.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#ded9d0] text-[#8a7057] uppercase font-bold text-[11px]">
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ebe1]">
                {services.map((svc) => (
                  <tr key={svc._id} className="hover:bg-[#faf8f5] transition">
                    <td className="py-3.5 px-4 font-bold text-[#24231f]">
                      <span className="mr-2">{svc.icon || "✂️"}</span>
                      <span>{svc.title}</span>
                      {svc.popularBadge && (
                        <span className="ml-2 text-[9px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full">
                          {svc.popularBadge}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#66513e] font-medium">
                      {svc.category}
                    </td>
                    <td className="py-3.5 px-4 text-[#8a847a]">
                      {svc.duration || "20 mins"}
                    </td>
                    <td className="py-3.5 px-4 text-right font-serif text-sm font-bold text-[#24231f]">
                      ₹{svc.price}
                      {svc.originalPrice && (
                        <span className="text-[10px] text-[#8a847a] line-through ml-1.5 font-normal">
                          ₹{svc.originalPrice}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() =>
                          setBookingService({
                            title: svc.title,
                            price: `₹${svc.price}`,
                            category: svc.category,
                          })
                        }
                        className="px-3 py-1 rounded-lg text-[11px] font-bold text-white bg-[#66513e] hover:bg-[#524131] transition"
                      >
                        Book
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Floating Bill / Estimate Calculator Tray */}
      {selectedItems.length > 0 && (
        <aside className="fixed bottom-6 right-4 sm:right-6 z-40 bg-white border-2 border-[#66513e] text-[#24231f] rounded-3xl shadow-2xl p-5 max-w-sm w-full animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-[#ded9d0]">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#8a7057]">
                YOUR ESTIMATE TRAY
              </span>
              <h5 className="font-serif text-lg font-bold text-[#24231f]">
                {selectedItems.length} {selectedItems.length === 1 ? "Service" : "Services"} Selected
              </h5>
            </div>
            <button
              onClick={() => setSelectedItems([])}
              className="text-xs text-red-600 hover:underline font-bold"
            >
              Clear All
            </button>
          </div>

          {/* Selected items list */}
          <div className="max-h-40 overflow-y-auto py-2 divide-y divide-[#f0ebe1] space-y-1">
            {selectedItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between py-1.5 text-xs"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <span>{item.icon || "✂️"}</span>
                  <span className="truncate font-medium text-[#24231f]">{item.title}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-bold text-[#66513e]">₹{item.price}</span>
                  <button
                    onClick={() => toggleItemSelection(item)}
                    className="text-stone-400 hover:text-stone-700 text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total & Book Combo Button */}
          <div className="pt-3 border-t border-[#ded9d0] space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#8a847a]">Estimated Total Amount:</span>
                {estimateSavings > 0 && (
                  <p className="text-[10px] text-emerald-700 font-bold">
                    You save ₹{estimateSavings}!
                  </p>
                )}
              </div>
              <span className="font-serif text-2xl font-bold text-[#24231f]">
                ₹{estimateTotal}
              </span>
            </div>

            <button
              onClick={handleBookEstimate}
              className="w-full py-3 px-4 rounded-xl bg-[#66513e] hover:bg-[#524131] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <span>📅</span>
              <span>Book Selected Services for ₹{estimateTotal}</span>
            </button>
          </div>
        </aside>
      )}

      {/* Appointment Booking Modal */}
      <AppointmentModal
        isOpen={Boolean(bookingService)}
        initialHairStyle={
          bookingService
            ? {
                title: bookingService.title,
                price: bookingService.price,
                category: bookingService.category,
              }
            : null
        }
        onClose={() => setBookingService(null)}
      />

      <Footer />
    </div>
  );
}

