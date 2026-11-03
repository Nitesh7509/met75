import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#1f1d1a] text-[#b0a99f] border-t border-[#34302b]">
      {/* Upper Footer: 4 Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#66513e] text-white flex items-center justify-center text-lg">
                ✂️
              </div>
              <span className="font-serif text-2xl font-bold tracking-wider text-white">
                MET75
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[#9a948a]">
              Premier grooming studio blending classic scissor craft with smart automated 30-day haircut reminders. Looking sharp is effortless.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2c2823] border border-[#3e3932] text-xs text-[#d1c8bd]">
              <span className="text-amber-400">★ ★ ★ ★ ★</span>
              <span className="font-semibold text-white">4.9 / 5</span>
              <span className="text-[#8a847a]">(1,200+ clients)</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#d8cfc4] mb-4">
              Explore Studio
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home & Schedule
                </Link>
              </li>
              <li>
                <Link to="/hair-designs" className="hover:text-white transition-colors">
                  Hair Designs & Angles
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  Amount & Rate Card
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About & Master Stylists
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  My Appointment Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Grooming Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#d8cfc4] mb-4">
              Signature Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center justify-between">
                <span>Precision Hair Cut</span>
                <span className="text-white font-semibold text-xs">₹150</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Skin Fade & Taper Cut</span>
                <span className="text-white font-semibold text-xs">₹250</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Clean Razor Shave (Saving)</span>
                <span className="text-white font-semibold text-xs">₹100</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Hot-Towel Royal Shave</span>
                <span className="text-white font-semibold text-xs">₹180</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Beard Sculpt & Line-Up</span>
                <span className="text-white font-semibold text-xs">₹120</span>
              </li>
              <li className="flex items-center justify-between">
                <span>O3+ D-Tan Face Care</span>
                <span className="text-white font-semibold text-xs">₹250</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Studio Hours & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#d8cfc4] mb-4">
              Hours & Studio
            </h4>
            <p className="text-sm text-[#9a948a]">
              <strong className="text-[#ded9d0]">Monday – Sunday:</strong>
              <br />
              9:00 AM – 8:00 PM (Daily)
            </p>
            <p className="text-sm text-[#9a948a]">
              <strong className="text-[#ded9d0]">Walk-ins & Appointments:</strong>
              <br />
              Both welcome anytime
            </p>
            <div className="pt-2 text-xs text-[#8a847a] space-y-1">
              <p>📍 MET75 Salon Studio, City Center</p>
              <p>📧 support@salon.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#2d2925] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#736c64]">
          <p>© {new Date().getFullYear()} MET75 Salon Management. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Automated 30-Day Reminder Engine</span>
            <span>•</span>
            <span>Zero-Hassle Booking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

