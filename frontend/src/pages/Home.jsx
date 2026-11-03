import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AppointmentModal from "../components/AppointmentModal";

export default function Home() {
  const navigate = useNavigate();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);

  function handleOpenBooking(service = null) {
    setSelectedServiceForBooking(service);
    setIsBookingOpen(true);
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-between text-[#24231f]">
      {/* Top Navbar */}
      <Navbar onOpenBooking={() => handleOpenBooking(null)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 lg:px-8 border-b border-[#e7e0d5]">
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f3eee7]/70 via-[#faf8f5] to-[#faf8f5] pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#ded9d0] shadow-2xs mb-6">
            <span className="text-sm">💈</span>
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#66513e]">
              PREMIER GROOMING STUDIO & 30-DAY REMINDER SYSTEM
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#24231f] tracking-tight leading-[1.1] max-w-4xl">
            Look Sharp Every Day. <br className="hidden sm:inline" />
            <span className="text-[#66513e]">Never Miss a Haircut.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-[#6a665f] mt-6 max-w-2xl leading-relaxed">
            Experience world-class master styling paired with smart haircut reminder scheduling.
            We record your haircut date and politely notify you every 30 days so your hair is always at peak sharpness.
          </p>

          {/* Call to action buttons */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => handleOpenBooking(null)}
              className="px-7 py-4 rounded-2xl bg-[#66513e] hover:bg-[#4d3b2d] text-white font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>📅</span>
              <span>Request Appointment</span>
            </button>

            <Link
              to="/hair-designs"
              className="px-6 py-4 rounded-2xl bg-white border border-[#ded9d0] hover:bg-[#f6f4ef] text-[#392918] font-bold text-base shadow-xs hover:shadow-sm transition-all"
            >
              Explore Hair Designs ✨
            </Link>

            <Link
              to="/pricing"
              className="px-6 py-4 rounded-2xl bg-[#f0ebe1] hover:bg-[#e4ddcf] text-[#66513e] font-bold text-base transition-all"
            >
              Amount & Rate Card →
            </Link>
          </div>

          {/* Trust Strip */}
          <div className="mt-14 pt-8 border-t border-[#e7e0d5]/80 w-full max-w-3xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="font-serif text-2xl font-bold text-[#392918]">4.9 ★</p>
              <p className="text-xs uppercase tracking-wider font-semibold text-[#817d76]">Client Rating</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-[#392918]">30 Days</p>
              <p className="text-xs uppercase tracking-wider font-semibold text-[#817d76]">Auto Cycle Engine</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-[#392918]">Master Stylists</p>
              <p className="text-xs uppercase tracking-wider font-semibold text-[#817d76]">Artisan Hair & Beard</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-[#392918]">100%</p>
              <p className="text-xs uppercase tracking-wider font-semibold text-[#817d76]">Sterilized Tools</p>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Services Spotlight */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#8a7057] mb-2">
              PRICING & POPULAR GROOMING
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#24231f]">
              Signature Services & Rates
            </h2>
          </div>
          <Link
            to="/pricing"
            className="text-sm font-bold text-[#66513e] hover:text-[#392918] flex items-center gap-1 group"
          >
            <span>View Full Rate Card & Estimate Calculator</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Service Card 1 */}
          <div className="bg-white border border-[#e7e0d5] rounded-3xl p-7 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#f6f4ef] flex items-center justify-center text-2xl mb-5">
                ✂️
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#f6f4ef] text-[#66513e] mb-3">
                Hair Cutting
              </span>
              <h3 className="font-serif text-xl font-bold text-[#24231f] mb-2">
                Classic & Modern Haircut
              </h3>
              <p className="text-sm text-[#6a665f] leading-relaxed mb-6">
                Tailored scissor or machine skin fade tailored to your face shape, finished with neck razor cleanup and pomade.
              </p>
            </div>
            <div className="pt-4 border-t border-[#f0ebe1] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#817d76]">Starting from</span>
                <p className="font-serif text-xl font-bold text-[#392918]">₹150</p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenBooking({ title: "Classic Men's Hair Cutting" })}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#66513e] hover:bg-[#4d3b2d] text-white transition"
              >
                Book Cut
              </button>
            </div>
          </div>

          {/* Service Card 2 */}
          <div className="bg-white border border-[#e7e0d5] rounded-3xl p-7 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#f6f4ef] flex items-center justify-center text-2xl mb-5">
                🪒
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#f6f4ef] text-[#66513e] mb-3">
                Shaving & Saving
              </span>
              <h3 className="font-serif text-xl font-bold text-[#24231f] mb-2">
                Hot-Towel Royal Shave
              </h3>
              <p className="text-sm text-[#6a665f] leading-relaxed mb-6">
                Pre-shave essential oils, steaming warm towels, feather razor shave, alum stone and soothing sandalwood balm.
              </p>
            </div>
            <div className="pt-4 border-t border-[#f0ebe1] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#817d76]">Starting from</span>
                <p className="font-serif text-xl font-bold text-[#392918]">₹100</p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenBooking({ title: "Clean Razor Shaving (Saving)" })}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#66513e] hover:bg-[#4d3b2d] text-white transition"
              >
                Book Shave
              </button>
            </div>
          </div>

          {/* Service Card 3 */}
          <div className="bg-white border border-[#e7e0d5] rounded-3xl p-7 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#f6f4ef] flex items-center justify-center text-2xl mb-5">
                🧔
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#f6f4ef] text-[#66513e] mb-3">
                Beard Styling
              </span>
              <h3 className="font-serif text-xl font-bold text-[#24231f] mb-2">
                Beard Trim & Line-Up
              </h3>
              <p className="text-sm text-[#6a665f] leading-relaxed mb-6">
                Symmetrical beard sculpting, razor cheek crisping, neckline taper, and nourishing cedarwood beard conditioning butter.
              </p>
            </div>
            <div className="pt-4 border-t border-[#f0ebe1] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#817d76]">Starting from</span>
                <p className="font-serif text-xl font-bold text-[#392918]">₹120</p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenBooking({ title: "Beard Trim, Shape & Razor Line-Up" })}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#66513e] hover:bg-[#4d3b2d] text-white transition"
              >
                Book Beard
              </button>
            </div>
          </div>

          {/* Service Card 4 */}
          <div className="bg-white border border-[#e7e0d5] rounded-3xl p-7 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#f6f4ef] flex items-center justify-center text-2xl mb-5">
                ✨
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#f6f4ef] text-[#66513e] mb-3">
                Face Care & D-Tan
              </span>
              <h3 className="font-serif text-xl font-bold text-[#24231f] mb-2">
                O3+ D-Tan & Cleanup
              </h3>
              <p className="text-sm text-[#6a665f] leading-relaxed mb-6">
                Removes tough sun tan, pollution residue, and blackheads. Rejuvenates fatigued skin with instant natural radiance.
              </p>
            </div>
            <div className="pt-4 border-t border-[#f0ebe1] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#817d76]">Starting from</span>
                <p className="font-serif text-xl font-bold text-[#392918]">₹250</p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenBooking({ title: "O3+ / Raaga D-Tan Sun Removal Face Pack" })}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#66513e] hover:bg-[#4d3b2d] text-white transition"
              >
                Book Care
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The 30-Day Reminder Engine Feature Showcase */}
      <section className="bg-[#f0ebe1] py-20 px-4 sm:px-6 lg:px-8 border-y border-[#e2dacd]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#8a7057] mb-2">
            INTELLIGENT SALON SCHEDULE
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#24231f] mb-4">
            How The 30-Day Reminder Works
          </h2>
          <p className="text-[#6a665f] text-sm sm:text-base max-w-xl mx-auto mb-14">
            Most people wait 6 to 8 weeks simply because they forget. Our automated system ensures your fade, taper, or trim is always on time.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-3xl border border-[#ded8cb] shadow-sm relative hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-2xl bg-[#66513e] text-white font-bold flex items-center justify-center mb-5 text-base shadow-sm">
                1
              </div>
              <h3 className="font-serif text-xl font-bold text-[#24231f] mb-2">
                Get Your Haircut
              </h3>
              <p className="text-sm text-[#6a665f] leading-relaxed">
                Visit MET75 Salon Studio. Our master craftsmen style your hair and trim your beard to perfection.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-3xl border border-[#ded8cb] shadow-sm relative hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-2xl bg-[#66513e] text-white font-bold flex items-center justify-center mb-5 text-base shadow-sm">
                2
              </div>
              <h3 className="font-serif text-xl font-bold text-[#24231f] mb-2">
                Date Recorded Live
              </h3>
              <p className="text-sm text-[#6a665f] leading-relaxed">
                Our team logs your haircut date into your private client profile. The 30-day countdown begins automatically.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-3xl border border-[#ded8cb] shadow-sm relative hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-2xl bg-[#66513e] text-white font-bold flex items-center justify-center mb-5 text-base shadow-sm">
                3
              </div>
              <h3 className="font-serif text-xl font-bold text-[#24231f] mb-2">
                Timely Notification
              </h3>
              <p className="text-sm text-[#6a665f] leading-relaxed">
                On day 30, you receive a polite reminder with an instant one-click link to schedule your next appointment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hair Designs Portfolio Teaser */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-br from-[#392918] to-[#241a0f] rounded-3xl p-8 sm:p-14 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#d4c3b2] mb-3 block">
              HAIRCUT INSPIRATION & 360° ANGLES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Explore Our Haircut Designs Gallery
            </h2>
            <p className="text-sm sm:text-base text-[#cfc5ba] leading-relaxed mb-6">
              Browse haircut designs tailored for your face shape and hair texture. Inspect multiple angles in full screen, check recommended maintenance cycles, and request the exact cut with one click.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/hair-designs"
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white text-[#392918] hover:bg-[#f6f4ef] transition shadow-md"
              >
                Open Hair Designs Gallery ✨
              </Link>
              <button
                type="button"
                onClick={() => handleOpenBooking(null)}
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-[#66513e] hover:bg-[#524131] text-white transition"
              >
                📅 Request Appointment
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-2xl p-5 text-center">
              <span className="text-3xl block mb-2">✂️</span>
              <p className="font-serif text-lg font-bold text-white">Fades & Tapers</p>
              <p className="text-xs text-[#b8afa4]">Low, Mid & Skin Fades</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-2xl p-5 text-center">
              <span className="text-3xl block mb-2">💈</span>
              <p className="font-serif text-lg font-bold text-white">Classic Cuts</p>
              <p className="text-xs text-[#b8afa4]">Pompadour & Side Parts</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-2xl p-5 text-center">
              <span className="text-3xl block mb-2">🌊</span>
              <p className="font-serif text-lg font-bold text-white">Textured Modern</p>
              <p className="text-xs text-[#b8afa4]">Crops, Quiffs & Mullets</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-2xl p-5 text-center">
              <span className="text-3xl block mb-2">👑</span>
              <p className="font-serif text-lg font-bold text-white">Beard Sculpt</p>
              <p className="text-xs text-[#b8afa4]">Crisp Lines & Butter Care</p>
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#8a7057] mb-2">
            REAL CLIENT EXPERIENCES
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#24231f]">
            Loved by Modern Gentlemen
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#e7e0d5] rounded-3xl p-7 shadow-xs">
            <div className="text-amber-500 text-sm mb-3">★ ★ ★ ★ ★</div>
            <p className="text-sm text-[#6a665f] italic leading-relaxed mb-6">
              "The 30-day reminder email is a game-changer! I used to look scruffy before remembering to book. Now my taper fade is crisp year-round."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f0e7dc] flex items-center justify-center font-bold text-[#66513e]">
                R
              </div>
              <div>
                <p className="font-serif text-sm font-bold text-[#24231f]">Rahul V.</p>
                <p className="text-[11px] text-[#817d76]">Executive Client</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#e7e0d5] rounded-3xl p-7 shadow-xs">
            <div className="text-amber-500 text-sm mb-3">★ ★ ★ ★ ★</div>
            <p className="text-sm text-[#6a665f] italic leading-relaxed mb-6">
              "Best hot-towel shave and beard sculpt in town. The master stylists actually listen to what you want and offer expert advice for face shape."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f0e7dc] flex items-center justify-center font-bold text-[#66513e]">
                S
              </div>
              <div>
                <p className="font-serif text-sm font-bold text-[#24231f]">Sameer K.</p>
                <p className="text-[11px] text-[#817d76]">Regular Grooming Member</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#e7e0d5] rounded-3xl p-7 shadow-xs">
            <div className="text-amber-500 text-sm mb-3">★ ★ ★ ★ ★</div>
            <p className="text-sm text-[#6a665f] italic leading-relaxed mb-6">
              "Clear upfront pricing with no hidden charges. The bill estimate calculator on the pricing page is super handy to pick your package before coming in."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f0e7dc] flex items-center justify-center font-bold text-[#66513e]">
                A
              </div>
              <div>
                <p className="font-serif text-sm font-bold text-[#24231f]">Amit P.</p>
                <p className="text-[11px] text-[#817d76]">Tech Lead</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialHairStyle={selectedServiceForBooking}
        onSuccess={() => {
          setIsBookingOpen(false);
          const token = localStorage.getItem("salonToken");
          if (token) navigate("/dashboard");
        }}
      />

      {/* Bottom Footer */}
      <Footer />
    </div>
  );
}
