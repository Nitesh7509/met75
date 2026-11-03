import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import AppointmentModal from "../components/AppointmentModal";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CATEGORIES = [
  "All",
  "Fades & Tapers",
  "Classic & Gentleman",
  "Textured & Modern",
  "Beard & Grooming",
];

export default function HairDesigns() {
  const navigate = useNavigate();

  const [hairStyles, setHairStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeModalStyle, setActiveModalStyle] = useState(null);

  // Full Screen Lightbox Viewer State
  const [fullscreenViewer, setFullscreenViewer] = useState(null);
  const [bookingModalStyle, setBookingModalStyle] = useState(null);

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("salonUser");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // Load live hairstyles from backend API
    setLoading(true);
    api.get("/hairstyles")
      .then(({ data }) => {
        setHairStyles(data.hairStyles || []);
      })
      .catch((err) => {
        console.error("Error loading hairstyles:", err);
        setHairStyles([]);
      })
      .finally(() => {
        setLoading(false);
      });

    // Verify current authentication
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
  }, []);

  // Keyboard navigation for fullscreen lightbox
  useEffect(() => {
    function handleKeyDown(e) {
      if (!fullscreenViewer) return;
      if (e.key === "Escape") {
        setFullscreenViewer(null);
      } else if (e.key === "ArrowLeft") {
        setFullscreenViewer((prev) => {
          if (!prev) return null;
          const nextIdx = (prev.activeIndex - 1 + prev.images.length) % prev.images.length;
          return { ...prev, activeIndex: nextIdx };
        });
      } else if (e.key === "ArrowRight") {
        setFullscreenViewer((prev) => {
          if (!prev) return null;
          const nextIdx = (prev.activeIndex + 1) % prev.images.length;
          return { ...prev, activeIndex: nextIdx };
        });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreenViewer]);

  function handleLogout() {
    localStorage.removeItem("salonToken");
    localStorage.removeItem("salonUser");
    setUser(null);
  }

  function openFullscreen(style, index = 0) {
    const imgs =
      style.images && style.images.length > 0
        ? style.images
        : style.imageUrl
        ? [style.imageUrl]
        : [];

    if (imgs.length > 0) {
      setFullscreenViewer({
        title: style.title,
        category: style.category,
        masterProfile: style.masterProfile,
        images: imgs,
        activeIndex: index,
      });
    }
  }

  const profileDestination = user?.role === "admin" ? "/admin" : "/dashboard";

  const filteredStyles = hairStyles.filter((style) => {
    const matchesCategory =
      selectedCategory === "All" || style.category === selectedCategory;
    const matchesSearch =
      style.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (style.description && style.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (style.hairType && style.hairType.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (style.masterProfile && style.masterProfile.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-between text-[#24231f]">
      {/* Top Navbar */}
      <header className="border-b border-[#e7e0d5] bg-white/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 font-serif text-xl font-bold tracking-wider text-[#392918] hover:opacity-90 transition">
            <span className="text-2xl">💇</span>
            <span>MET75 SALON</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-[#66513e] hover:text-[#24231f] transition">
              Home
            </Link>
            <Link
              to="/hair-designs"
              className="text-sm font-bold text-[#392918] underline underline-offset-4"
            >
              Hair Designs
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-[#66513e] hover:text-[#24231f] transition">
              Amount & Pricing
            </Link>
            <Link to="/about" className="text-sm font-medium text-[#66513e] hover:text-[#24231f] transition">
              About
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#f6f4ef] border border-[#e7e0d5] rounded-full text-xs font-medium text-[#392918]" title={user.email}>
                  <span>👤</span>
                  <span className="font-semibold">{user.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#e9e3d8] text-[#66513e]">
                    {user.role}
                  </span>
                </div>

                <Link
                  to={profileDestination}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#66513e] hover:bg-[#4d3b2d] transition shadow-sm"
                >
                  {user.role === "admin" ? "Admin Panel" : "My Profile"}
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3.5 py-2 rounded-xl text-sm font-medium border border-[#ded9d0] bg-white hover:bg-[#f6f4ef] text-[#66513e] transition"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold border border-[#ded9d0] bg-white hover:bg-[#f6f4ef] text-[#392918] transition"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#66513e] hover:bg-[#4d3b2d] transition shadow-sm"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Showcase */}
      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full">
        <section className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-[#8a7057] mb-2">
            TRENDING STYLES & INSPIRATION
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#24231f] mb-3">
            Hair Designs & Grooming Catalog
          </h1>
          <p className="text-sm sm:text-base text-[#6a665f] leading-relaxed">
            Explore precision cuts with multi-angle photos. Click on any picture to view it in full screen!
          </p>

          <input
            type="text"
            className="w-full max-w-md mx-auto mt-6 block px-4 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-[#24231f] placeholder-[#a8a196] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition"
            placeholder="Search hairstyles, hair types, or stylists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </section>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                selectedCategory === cat
                  ? "bg-[#66513e] text-white shadow-sm"
                  : "bg-white border border-[#ded9d0] text-[#66513e] hover:bg-[#f6f4ef]"
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Styles Content */}
        {loading ? (
          <div className="text-center py-24 px-4 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#66513e] mb-4"></div>
            <p className="text-sm font-medium text-[#6a665f]">Loading hairstyles catalog...</p>
          </div>
        ) : hairStyles.length === 0 ? (
          <div className="text-center py-20 px-6 bg-white border border-[#e7e0d5] rounded-3xl max-w-xl mx-auto shadow-xs">
            <span className="text-4xl block mb-3">✂️</span>
            <h3 className="font-serif text-2xl font-bold text-[#24231f] mb-2">No Hairstyles Added Yet</h3>
            <p className="text-sm text-[#6a665f] max-w-md mx-auto mb-6">
              Our styling catalog is currently empty. You can request an appointment anytime or browse our amount & pricing.
            </p>
            {user?.role === "admin" ? (
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#66513e] hover:bg-[#4d3b2d] transition"
              >
                <span>➕</span> Add Hairstyle in Admin Panel
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setBookingModalStyle({ title: "Custom Haircut & Styling" })}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#66513e] hover:bg-[#4d3b2d] transition"
              >
                <span>📅</span> Book an Appointment
              </button>
            )}
          </div>
        ) : filteredStyles.length === 0 ? (
          <div className="text-center py-16 px-4">
            <p className="text-3xl mb-2">🔍</p>
            <h3 className="font-serif text-xl font-bold text-[#24231f]">No hairstyles matched your search.</h3>
            <p className="text-sm text-[#817d76] mt-1 mb-4">Try resetting your filters or search keywords.</p>
            <button
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#66513e] hover:bg-[#4d3b2d] transition"
              onClick={() => {
                setSelectedCategory("All");
                setSearchTerm("");
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStyles.map((style) => {
            const styleImgs =
              style.images && style.images.length > 0
                ? style.images
                : style.imageUrl
                ? [style.imageUrl]
                : [];

            return (
              <article
                key={style._id}
                className="bg-white border border-[#e7e0d5] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                {/* Main Visual Banner */}
                <div
                  className="bg-[#f6f4ef] border-b border-[#e7e0d5] flex flex-col items-center justify-center relative min-h-[200px] overflow-hidden cursor-zoom-in"
                  onClick={() => openFullscreen(style, 0)}
                  title="Click to view full screen"
                >
                  <span className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-xs border border-[#ded9d0] text-[#66513e]">
                    {style.category}
                  </span>

                  {styleImgs.length > 0 ? (
                    <div className="w-full h-52 relative overflow-hidden">
                      <img
                        src={styleImgs[0]}
                        alt={style.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-black/70 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-xs flex items-center gap-1.5 shadow-md">
                          <span>🔍</span>
                          <span>Click for Full Screen</span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-6xl select-none py-10">{style.icon || "✂️"}</div>
                  )}

                  <span className="absolute bottom-4 right-4 z-10 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#66513e] text-white shadow-xs">
                    Cycle: {style.cycle}
                  </span>
                </div>

                {/* 2-3 Angle Thumbnails Strip */}
                {styleImgs.length > 1 && (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-[#faf8f5] border-b border-[#ded9d0]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a7057]">
                      {styleImgs.length} Angles:
                    </span>
                    <div className="flex items-center gap-2 flex-1">
                      {styleImgs.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => openFullscreen(style, idx)}
                          className="w-9 h-9 rounded-lg overflow-hidden border-2 border-white hover:border-[#66513e] shadow-xs transition hover:scale-110 flex-shrink-0 cursor-zoom-in"
                          title={`View Angle ${idx + 1} full screen`}
                        >
                          <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] text-[#66513e] font-semibold flex items-center gap-1">
                      <span>🔍</span> Full Screen
                    </span>
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#24231f] mb-1">{style.title}</h3>
                    {style.masterProfile && (
                      <p className="text-xs font-semibold text-[#8a7057] mb-2 flex items-center gap-1">
                        <span>👤</span>
                        <span>Stylist Profile: {style.masterProfile}</span>
                      </p>
                    )}
                    <p className="text-sm text-[#6a665f] leading-relaxed line-clamp-3">{style.description}</p>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-[#f0ebe1] text-xs">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[#8a847a] font-medium">Ideal Hair:</span>
                      <span className="font-semibold text-[#24231f] text-right">{style.hairType}</span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[#8a847a] font-medium">Recommended Product:</span>
                      <span className="font-semibold text-[#24231f] text-right">{style.product}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-[#66513e] hover:bg-[#524131] shadow-xs transition text-center flex items-center justify-center gap-1.5"
                      onClick={() => setBookingModalStyle(style)}
                    >
                      <span>📅</span>
                      <span>Book Cut</span>
                    </button>
                    <button
                      type="button"
                      className="py-2.5 px-3 rounded-xl text-xs font-bold text-[#66513e] bg-[#f6f4ef] hover:bg-[#e9e3d8] border border-[#e7e0d5] transition text-center"
                      onClick={() => setActiveModalStyle(style)}
                      title="View Details & Styling Guide"
                    >
                      Guide →
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
        )}
      </main>

      {/* Style Detail Modal */}
      {activeModalStyle && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveModalStyle(null)}
        >
          <div
            className="bg-white rounded-3xl border border-[#ded9d0] max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#f6f4ef] border border-[#ded9d0] text-[#66513e]">
                  {activeModalStyle.category}
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#24231f] mt-2">
                  {activeModalStyle.icon} {activeModalStyle.title}
                </h2>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg border border-[#ded9d0] text-xs font-semibold text-[#6a665f] hover:bg-[#f6f4ef] transition"
                onClick={() => setActiveModalStyle(null)}
              >
                ✕ Close
              </button>
            </div>

            {/* Photo / Gallery preview in modal */}
            {activeModalStyle.images && activeModalStyle.images.length > 0 && (
              <div className="mb-4">
                <div
                  className="relative rounded-2xl overflow-hidden cursor-zoom-in border border-[#e7e0d5] group"
                  onClick={() => openFullscreen(activeModalStyle, 0)}
                  title="Click to view full screen"
                >
                  <img
                    src={activeModalStyle.images[0]}
                    alt={activeModalStyle.title}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-black/75 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                      <span>🔍</span> Click to Expand Full Screen
                    </span>
                  </div>
                </div>

                {activeModalStyle.images.length > 1 && (
                  <div className="flex items-center gap-2 mt-2">
                    {activeModalStyle.images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => openFullscreen(activeModalStyle, idx)}
                        className="w-14 h-14 rounded-xl overflow-hidden border-2 border-[#e7e0d5] hover:border-[#66513e] shadow-xs transition hover:scale-105 cursor-zoom-in"
                        title={`Angle ${idx + 1}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                    <span className="text-xs text-[#8a7057] ml-2">Click angle for full screen</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-2 my-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#f6f4ef] border border-[#e7e0d5] text-[#392918]">
                ✂️ Recut Cycle: {activeModalStyle.cycle}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#f6f4ef] border border-[#e7e0d5] text-[#392918]">
                👤 Faces: {activeModalStyle.faceShape}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#f6f4ef] border border-[#e7e0d5] text-[#392918]">
                💈 Hair: {activeModalStyle.hairType}
              </span>
              {activeModalStyle.masterProfile && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#e9e3d8] border border-[#ded9d0] text-[#66513e]">
                  ⭐ Artisan: {activeModalStyle.masterProfile}
                </span>
              )}
            </div>

            <p className="text-sm text-[#4a463f] leading-relaxed mb-4">
              {activeModalStyle.description}
            </p>

            <div className="bg-[#faf8f5] p-4 rounded-2xl border border-[#ded9d0] mb-3 text-xs leading-relaxed text-[#4a463f]">
              <h4 className="font-bold text-[#24231f] mb-1">🎯 Barber's Styling Advice</h4>
              <p>{activeModalStyle.stylingTips}</p>
            </div>

            <div className="bg-[#faf8f5] p-4 rounded-2xl border border-[#ded9d0] mb-3 text-xs leading-relaxed text-[#4a463f]">
              <h4 className="font-bold text-[#24231f] mb-1">🧴 Recommended Styling Product</h4>
              <p>
                <strong>{activeModalStyle.product}</strong>: Provides optimal texture and all-day hold without greasiness.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#ded9d0]">
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-[#ded9d0] text-[#66513e] hover:bg-[#f6f4ef] transition"
                onClick={() => setActiveModalStyle(null)}
              >
                Done
              </button>
              <button
                type="button"
                className="px-5 py-2 rounded-xl text-sm font-bold bg-[#66513e] hover:bg-[#4d3b2d] text-white transition shadow-sm flex items-center gap-1.5"
                onClick={() => {
                  const s = activeModalStyle;
                  setActiveModalStyle(null);
                  setBookingModalStyle(s);
                }}
              >
                <span>📅</span>
                <span>Request Appointment for This Cut</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LIGHTBOX: FULL SCREEN IMAGE VIEWER                                        */}
      {/* ========================================================================= */}
      {fullscreenViewer && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 select-none animate-fadeIn"
          onClick={() => setFullscreenViewer(null)}
        >
          {/* Header Bar */}
          <div
            className="flex items-center justify-between gap-4 max-w-6xl w-full mx-auto pb-4 border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white/90 mr-2">
                {fullscreenViewer.category}
              </span>
              <span className="font-serif text-white text-lg sm:text-xl font-bold">
                {fullscreenViewer.title}
              </span>
              {fullscreenViewer.masterProfile && (
                <span className="hidden sm:inline text-xs text-white/60 ml-3">
                  (Artisan: {fullscreenViewer.masterProfile})
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-white/70 font-semibold px-2.5 py-1 bg-white/10 rounded-full">
                Photo {fullscreenViewer.activeIndex + 1} of {fullscreenViewer.images.length}
              </span>
              <button
                type="button"
                onClick={() => setFullscreenViewer(null)}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 border border-white/20"
              >
                <span>✕</span>
                <span>Close (Esc)</span>
              </button>
            </div>
          </div>

          {/* Center Fullscreen Image Stage */}
          <div
            className="relative flex-1 flex items-center justify-center p-2 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Arrow */}
            {fullscreenViewer.images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFullscreenViewer((prev) => ({
                    ...prev,
                    activeIndex: (prev.activeIndex - 1 + prev.images.length) % prev.images.length,
                  }));
                }}
                className="absolute left-2 sm:left-6 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white text-2xl flex items-center justify-center transition border border-white/20 backdrop-blur-xs shadow-lg"
                title="Previous photo (←)"
              >
                ‹
              </button>
            )}

            {/* High-Res Image */}
            <div className="max-h-[75vh] max-w-full flex items-center justify-center">
              <img
                src={fullscreenViewer.images[fullscreenViewer.activeIndex]}
                alt={`${fullscreenViewer.title} - View ${fullscreenViewer.activeIndex + 1}`}
                className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/15 transition-all duration-300"
              />
            </div>

            {/* Next Arrow */}
            {fullscreenViewer.images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFullscreenViewer((prev) => ({
                    ...prev,
                    activeIndex: (prev.activeIndex + 1) % prev.images.length,
                  }));
                }}
                className="absolute right-2 sm:right-6 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white text-2xl flex items-center justify-center transition border border-white/20 backdrop-blur-xs shadow-lg"
                title="Next photo (→)"
              >
                ›
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          <div
            className="flex items-center justify-center gap-3 pt-3 border-t border-white/10 max-w-xl mx-auto overflow-x-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {fullscreenViewer.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setFullscreenViewer((prev) => ({ ...prev, activeIndex: idx }))}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition transform hover:scale-105 flex-shrink-0 ${
                  fullscreenViewer.activeIndex === idx
                    ? "border-amber-400 scale-105 ring-2 ring-amber-400/50 shadow-md"
                    : "border-white/30 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Appointment Booking Modal */}
      <AppointmentModal
        isOpen={Boolean(bookingModalStyle)}
        initialHairStyle={bookingModalStyle}
        onClose={() => setBookingModalStyle(null)}
      />

      <Footer />
    </div>
  );
}
