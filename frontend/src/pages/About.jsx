import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AppointmentModal from "../components/AppointmentModal";

export default function About() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("salonUser");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

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
  }, []);

  function handleLogout() {
    localStorage.removeItem("salonToken");
    localStorage.removeItem("salonUser");
    setUser(null);
  }

  const profileDestination = user?.role === "admin" ? "/admin" : "/dashboard";

  const [masters, setMasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get("/masters")
      .then(({ data }) => {
        setMasters(data.masters || []);
      })
      .catch((err) => {
        console.error("Could not load masters:", err);
        setMasters([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="home-container min-h-screen flex flex-col bg-[#f6f4ef]">
      <Navbar onOpenBooking={() => setIsBookingOpen(true)} />

      {/* Main About Content */}
      <main className="about-page max-w-6xl mx-auto px-6 py-10 md:py-16">
        {/* Header Section */}
        <section className="about-header text-center max-w-3xl mx-auto mb-12">
          <p className="eyebrow text-xs uppercase tracking-widest text-[#8a7057] font-bold mb-2">OUR STORY & PHILOSOPHY</p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#24231f] mb-4 leading-tight">
            Crafting Confidence Through Precision Grooming & Smart Care
          </h1>
          <p className="lead text-[#5c5851] text-base md:text-lg leading-relaxed">
            MET75 Salon was founded on a simple promise: exceptional haircuts with a zero-hassle
            schedule. We blend traditional barbering precision with smart automated reminders so
            you never have to wonder when your next cut is due.
          </p>
        </section>

        {/* Stats Strip */}
        <section className="stats-strip grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          <div className="stat-item bg-white border border-[#e7e0d5] rounded-2xl p-6 text-center shadow-xs hover:shadow-md transition-shadow">
            <p className="stat-num font-serif text-3xl md:text-4xl font-bold text-[#66513e] mb-1">5,000+</p>
            <p className="stat-lbl text-xs uppercase tracking-wider font-semibold text-[#8c867e]">Haircuts Crafted</p>
          </div>
          <div className="stat-item bg-white border border-[#e7e0d5] rounded-2xl p-6 text-center shadow-xs hover:shadow-md transition-shadow">
            <p className="stat-num font-serif text-3xl md:text-4xl font-bold text-[#66513e] mb-1">99.4%</p>
            <p className="stat-lbl text-xs uppercase tracking-wider font-semibold text-[#8c867e]">Reminder Delivery</p>
          </div>
          <div className="stat-item bg-white border border-[#e7e0d5] rounded-2xl p-6 text-center shadow-xs hover:shadow-md transition-shadow">
            <p className="stat-num font-serif text-3xl md:text-4xl font-bold text-[#66513e] mb-1">15+</p>
            <p className="stat-lbl text-xs uppercase tracking-wider font-semibold text-[#8c867e]">Years Experience</p>
          </div>
          <div className="stat-item bg-white border border-[#e7e0d5] rounded-2xl p-6 text-center shadow-xs hover:shadow-md transition-shadow">
            <p className="stat-num font-serif text-3xl md:text-4xl font-bold text-[#66513e] mb-1">4.9 ★</p>
            <p className="stat-lbl text-xs uppercase tracking-wider font-semibold text-[#8c867e]">Customer Rating</p>
          </div>
        </section>

        {/* Story Section */}
        <section className="about-story-section grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-center">
          <div className="story-card lg:col-span-7 bg-white border border-[#e7e0d5] rounded-2xl p-6 sm:p-10 shadow-xs">
            <p className="eyebrow text-xs uppercase tracking-widest text-[#8a7057] font-bold mb-2">WHY WE'RE DIFFERENT</p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#24231f] mb-4">The MET75 Experience</h2>
            <p className="text-[#6a665f] leading-relaxed text-sm sm:text-base mb-4">
              In conventional salons, clients frequently lose track of their grooming cadence.
              A week or two slips by, hair loses its sharp contours, and booking becomes an afterthought.
            </p>
            <p className="text-[#6a665f] leading-relaxed text-sm sm:text-base mb-4">
              At MET75 Salon, we engineered our proprietary <strong>30-Day Reminder Engine</strong>.
              Every time you visit, your haircut date is recorded into your private portal. Exactly
              when your fade or length begins to outgrow its ideal silhouette, a personalized email
              arrives to keep your look consistently sharp.
            </p>
            <p className="text-[#6a665f] leading-relaxed text-sm sm:text-base mb-0">
              Every chair in our studio is hosted by dedicated master stylists trained in facial harmony,
              natural growth patterns, and advanced scissor & fade architectures.
            </p>
          </div>

          <div className="quote-card lg:col-span-5 bg-gradient-to-br from-[#e9dfd1] to-[#d8c8b4] border border-[#cfc0ad] rounded-2xl p-8 sm:p-10 shadow-xs">
            <span className="quote-icon text-4xl mb-4 block">✂️</span>
            <p className="quote-text font-serif italic text-xl sm:text-2xl text-[#392918] leading-relaxed mb-4">
              "A great haircut is more than grooming; it’s an invisible suit of armor you wear every single day."
            </p>
            <p className="quote-author text-xs uppercase tracking-wider font-bold text-[#66513e]">
              — The MET75 Master Team
            </p>
          </div>
        </section>

        {/* Four Core Pillars */}
        <section className="pillars-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="pillar-box bg-white border border-[#e7e0d5] rounded-2xl p-6 shadow-xs hover:-translate-y-1 transition-transform">
            <span className="pillar-icon text-3xl mb-3 block">💈</span>
            <h3 className="font-serif text-lg font-bold text-[#24231f] mb-2">Master Barber Craft</h3>
            <p className="text-[#6a665f] text-sm leading-relaxed">
              Artisan hot-towel shaves, razor edge lineups, and customized texturing tailored
              specifically to your facial anatomy.
            </p>
          </div>

          <div className="pillar-box bg-white border border-[#e7e0d5] rounded-2xl p-6 shadow-xs hover:-translate-y-1 transition-transform">
            <span className="pillar-icon text-3xl mb-3 block">⏱️</span>
            <h3 className="font-serif text-lg font-bold text-[#24231f] mb-2">Automated Scheduling</h3>
            <p className="text-[#6a665f] text-sm leading-relaxed">
              Daily server-side cron checks run every morning to ensure you get timely, polite
              reminders right when a recut is needed.
            </p>
          </div>

          <div className="pillar-box bg-white border border-[#e7e0d5] rounded-2xl p-6 shadow-xs hover:-translate-y-1 transition-transform">
            <span className="pillar-icon text-3xl mb-3 block">🌿</span>
            <h3 className="font-serif text-lg font-bold text-[#24231f] mb-2">Scalp & Hair Health</h3>
            <p className="text-[#6a665f] text-sm leading-relaxed">
              We only use sulfate-free, botanical-grade pomades, clays, and nourishing beard oils
              that protect hair density.
            </p>
          </div>

          <div className="pillar-box bg-white border border-[#e7e0d5] rounded-2xl p-6 shadow-xs hover:-translate-y-1 transition-transform">
            <span className="pillar-icon text-3xl mb-3 block">📱</span>
            <h3 className="font-serif text-lg font-bold text-[#24231f] mb-2">Personal Client Portal</h3>
            <p className="text-[#6a665f] text-sm leading-relaxed">
              View your cut history, reminder logs, and password recovery tools anytime from your
              phone or desktop.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section text-center mb-16">
          <p className="eyebrow text-xs uppercase tracking-widest text-[#8a7057] font-bold mb-2">MEET THE ARTISANS</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#24231f] mb-3">Our Master Stylists</h2>
          <p className="muted text-[#817d76] text-sm max-w-lg mx-auto mb-8">
            Passionate craftsmen and grooming specialists committed to your personal aesthetic.
          </p>

          {loading ? (
            <div className="py-12 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#66513e]"></div>
            </div>
          ) : masters.length === 0 ? (
            <div className="bg-white border border-[#e7e0d5] rounded-2xl p-8 max-w-md mx-auto text-center shadow-xs">
              <span className="text-4xl block mb-3">🧔</span>
              <h3 className="font-serif text-xl font-bold text-[#24231f] mb-2">Stylist Profiles Being Updated</h3>
              <p className="text-sm text-[#6a665f] mb-4">
                Our master team roster is currently being updated. Please check back soon or visit our studio.
              </p>
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#66513e] hover:bg-[#4d3b2d] transition"
                >
                  <span>➕</span> Add Master in Admin Panel
                </Link>
              )}
            </div>
          ) : (
            <div className="team-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {masters.map((master) => (
                <div
                  key={master._id}
                  className="team-member-card bg-white border border-[#e7e0d5] rounded-2xl p-8 text-center shadow-xs hover:-translate-y-1 transition-transform flex flex-col justify-between"
                >
                  <div>
                    <div className="team-avatar w-18 h-18 bg-[#f0e7dc] rounded-full grid place-items-center text-3xl mx-auto mb-4 border-2 border-[#e0d5c5]">
                      {master.avatar || "🧔"}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#24231f] mb-1">
                      {master.name}
                    </h3>
                    <p className="team-role text-xs uppercase tracking-wider font-bold text-[#8a7057] mb-2">
                      {master.specialty}
                    </p>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f6f4ef] text-[#66513e] mb-3">
                      ⏱ {master.experience || "5+ Years"}
                    </span>
                    <p className="team-bio text-sm text-[#6a665f] leading-relaxed">
                      {master.bio || "Dedicated salon master providing precision haircutting and styling."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Location & Hours CTA Banner */}
        <section className="about-cta-banner bg-[#392918] text-white rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-lg">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f6f4ef] mb-3">Visit Our Studio</h2>
          <p className="text-[#d1c8bd] text-sm sm:text-base max-w-xl mx-auto mb-6 leading-relaxed">
            Experience premium grooming firsthand. We are open 7 days a week with walk-ins
            and booked schedules welcome.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/hair-designs" className="hero-btn-primary bg-[#66513e] hover:bg-[#4d3b2d] text-white px-6 py-3 rounded-xl font-semibold transition-all">
              Explore Hair Designs ✨
            </Link>
            <Link
              onClick={() => setIsBookingOpen(true)} to="#"
              className="hero-btn-secondary bg-white hover:bg-[#f6f4ef] text-[#66513e] border border-[#ded9d0] px-6 py-3 rounded-xl font-semibold transition-all"
            >
              📅 Book an Appointment Now
            </Link>
          </div>
        </section>
      </main>

      <AppointmentModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <Footer />
    </div>
  );
}
