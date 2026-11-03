import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const TIME_SLOTS = [
  "09:30 AM",
  "10:30 AM",
  "11:30 AM",
  "01:00 PM",
  "02:15 PM",
  "03:30 PM",
  "04:45 PM",
  "06:00 PM",
  "07:15 PM",
];

export default function AppointmentModal({
  isOpen,
  onClose,
  initialHairStyle = null,
  initialMaster = null,
  onSuccess = () => {},
}) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  const [hairStyles, setHairStyles] = useState([]);
  const [masters, setMasters] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Form states
  const [selectedStyleId, setSelectedStyleId] = useState("");
  const [customService, setCustomService] = useState("");
  const [selectedMasterId, setSelectedMasterId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("10:30 AM");
  const [userPhone, setUserPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState(null);

  // Get current user from storage
  useEffect(() => {
    if (!isOpen) return;

    try {
      const rawUser = localStorage.getItem("salonUser");
      if (rawUser) {
        setCurrentUser(JSON.parse(rawUser));
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    }
  }, [isOpen]);

  // Load available hairstyles and masters
  useEffect(() => {
    if (!isOpen) return;

    setLoadingOptions(true);
    Promise.allSettled([api.get("/hairstyles"), api.get("/masters")])
      .then(([stylesRes, mastersRes]) => {
        if (stylesRes.status === "fulfilled" && stylesRes.value.data?.hairStyles) {
          setHairStyles(stylesRes.value.data.hairStyles);
        }
        if (mastersRes.status === "fulfilled" && mastersRes.value.data?.masters) {
          setMasters(mastersRes.value.data.masters);
        }
      })
      .finally(() => setLoadingOptions(false));

    // Set today as default min date
    const today = new Date().toISOString().split("T")[0];
    setAppointmentDate(today);
    setErrorMessage("");
    setSuccessData(null);
  }, [isOpen]);

  // Prepopulate if initialHairStyle or initialMaster was provided
  useEffect(() => {
    if (initialHairStyle) {
      setSelectedStyleId(initialHairStyle._id || "custom");
      if (initialHairStyle.title) {
        setCustomService(initialHairStyle.title);
      }
      if (initialHairStyle.masterProfile?.name) {
        const found = masters.find(
          (m) =>
            m.name?.toLowerCase() ===
            initialHairStyle.masterProfile.name.toLowerCase()
        );
        if (found) {
          setSelectedMasterId(found._id);
        }
      }
    }
    if (initialMaster) {
      setSelectedMasterId(initialMaster._id || "");
    }
  }, [initialHairStyle, initialMaster, masters]);

  if (!isOpen) return null;

  // Selected style object
  const activeStyle = hairStyles.find((s) => s._id === selectedStyleId);
  const activeMaster = masters.find((m) => m._id === selectedMasterId);

  const finalServiceName =
    selectedStyleId && selectedStyleId !== "custom"
      ? activeStyle?.title || "Salon Haircut"
      : customService.trim() || "Classic Haircut & Styling";

  const finalServicePrice = activeStyle?.price || "₹350";
  const finalStyleImage = activeStyle?.images?.[0] || activeStyle?.imageUrl || "";
  const finalMasterName = activeMaster?.name || "Any Available Master Barber";

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    if (!currentUser) {
      setErrorMessage("Please log in to submit your appointment request.");
      return;
    }

    if (!finalServiceName) {
      setErrorMessage("Please select or enter a haircut style / service.");
      return;
    }

    if (!appointmentDate) {
      setErrorMessage("Please choose a preferred appointment date.");
      return;
    }

    if (!selectedTimeSlot) {
      setErrorMessage("Please select a time slot.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        service: finalServiceName,
        servicePrice: finalServicePrice,
        hairStyleId: activeStyle?._id || null,
        hairStyleImage: finalStyleImage,
        masterId: activeMaster?._id || null,
        masterName: finalMasterName,
        appointmentDate,
        timeSlot: selectedTimeSlot,
        userPhone: userPhone.trim(),
        notes: notes.trim(),
      };

      const { data } = await api.post("/appointments", payload);
      setSuccessData(data.appointment || payload);
      onSuccess(data.appointment || payload);
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message || "Failed to submit appointment request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div
        className="bg-[#faf8f5] text-[#24231f] w-full max-w-2xl rounded-3xl border border-[#ded9d0] shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-[#f0ebe1] px-6 sm:px-8 py-5 border-b border-[#ded9d0] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#8a7057] block">
              BOOKING & RESERVATION
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#24231f]">
              Request Salon Appointment
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#66513e] flex items-center justify-center transition shadow-xs text-lg font-bold"
            title="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Not Logged In Notice */}
        {!currentUser ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center text-3xl">
              ✂️
            </div>
            <div>
              <h4 className="font-serif text-xl font-bold text-[#24231f]">
                Please Sign In to Request an Appointment
              </h4>
              <p className="text-sm text-[#6a665f] mt-1 max-w-md mx-auto">
                Sign in to your account so you can track your request status, receive acceptance confirmations, and view your haircut schedule.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  navigate("/login");
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#66513e] hover:bg-[#524131] text-white font-bold text-sm shadow-md transition"
              >
                Sign In to Continue
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate("/register");
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-[#ded9d0] hover:bg-[#f6f4ef] text-[#66513e] font-bold text-sm transition shadow-xs"
              >
                Create Free Account
              </button>
            </div>
          </div>
        ) : successData ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 text-emerald-700 border-2 border-emerald-300 flex items-center justify-center text-4xl shadow-sm">
              ✓
            </div>
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                Status: Pending Salon Acceptance
              </span>
              <h4 className="font-serif text-2xl font-bold text-[#24231f] mt-3">
                Appointment Requested!
              </h4>
              <p className="text-sm text-[#6a665f] mt-1 max-w-lg mx-auto leading-relaxed">
                Thank you, <strong>{currentUser.name}</strong>! Your haircut request for{" "}
                <strong>{successData.service}</strong> has been sent to our salon team.
                The admin will review and accept your appointment shortly.
              </p>
            </div>

            {/* Appointment Recap Card */}
            <div className="bg-white border border-[#ded9d0] rounded-2xl p-5 text-left max-w-md mx-auto shadow-xs space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#8a847a]">Service:</span>
                <span className="font-bold text-[#24231f]">{successData.service}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#8a847a]">Master Stylist:</span>
                <span className="font-semibold text-[#66513e]">
                  {successData.masterName || "Any Available Master"}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#8a847a]">Date & Time:</span>
                <span className="font-semibold text-[#24231f]">
                  {new Date(successData.appointmentDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  at {successData.timeSlot}
                </span>
              </div>
              {successData.userPhone && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#8a847a]">Contact Phone:</span>
                  <span className="font-mono text-xs">{successData.userPhone}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  navigate("/dashboard");
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#66513e] hover:bg-[#524131] text-white font-bold text-sm shadow-md transition"
              >
                View in My Schedule & Dashboard
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-[#ded9d0] hover:bg-[#f6f4ef] text-[#66513e] font-bold text-sm transition shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-sm border border-red-200">
                {errorMessage}
              </div>
            )}

            {/* Customer greeting info */}
            <div className="bg-[#f0ebe1] p-4 rounded-2xl border border-[#e2dacd] flex items-center justify-between">
              <div>
                <p className="text-xs text-[#8a7057] uppercase font-bold tracking-wider">
                  Booking As
                </p>
                <p className="font-bold text-[#24231f] text-base">{currentUser.name}</p>
                <p className="text-xs text-[#6a665f]">{currentUser.email}</p>
              </div>
              <span className="text-xs px-3 py-1 bg-white rounded-full font-semibold border border-[#ded9d0] text-[#66513e]">
                Verified Account
              </span>
            </div>

            {/* Haircut Style / Service Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#66513e] mb-2">
                1. Select Haircut Style / Service
              </label>
              <select
                value={selectedStyleId}
                onChange={(e) => {
                  setSelectedStyleId(e.target.value);
                  if (e.target.value !== "custom") {
                    const found = hairStyles.find((s) => s._id === e.target.value);
                    if (found?.masterProfile?.name) {
                      const m = masters.find(
                        (mst) =>
                          mst.name.toLowerCase() ===
                          found.masterProfile.name.toLowerCase()
                      );
                      if (m) setSelectedMasterId(m._id);
                    }
                  }
                }}
                className="w-full p-3.5 bg-white border border-[#ded9d0] rounded-xl text-sm font-semibold text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#66513e]"
              >
                <option value="">-- Choose from Lookbook Hair Designs --</option>
                {hairStyles.map((style) => (
                  <option key={style._id} value={style._id}>
                    {style.title} • {style.category} ({style.price || "₹350"})
                  </option>
                ))}
                <option value="custom">Other / Custom Service or Trimming</option>
              </select>

              {/* If custom is selected or no catalog item chosen */}
              {selectedStyleId === "custom" && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={customService}
                    onChange={(e) => setCustomService(e.target.value)}
                    placeholder="e.g. Skin Fade + Beard Trim & Styling"
                    className="w-full p-3 bg-white border border-[#ded9d0] rounded-xl text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#66513e]"
                  />
                </div>
              )}

              {/* Selected Style Preview Card */}
              {activeStyle && (
                <div className="mt-3 p-3 bg-white border border-[#e7e0d5] rounded-2xl flex items-center gap-3">
                  <img
                    src={activeStyle.images?.[0] || activeStyle.imageUrl}
                    alt={activeStyle.title}
                    className="w-16 h-16 rounded-xl object-cover border border-[#ded9d0]"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-sm text-[#24231f] truncate">
                      {activeStyle.title}
                    </h5>
                    <p className="text-xs text-[#8a7057] capitalize">
                      Category: {activeStyle.category} • Est. Duration: {activeStyle.duration || "35 mins"}
                    </p>
                    <p className="text-xs font-bold text-[#66513e] mt-0.5">
                      Estimated Price: {activeStyle.price || "₹350"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Master Barber Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#66513e] mb-2">
                2. Preferred Master Barber / Stylist
              </label>
              <select
                value={selectedMasterId}
                onChange={(e) => setSelectedMasterId(e.target.value)}
                className="w-full p-3.5 bg-white border border-[#ded9d0] rounded-xl text-sm font-semibold text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#66513e]"
              >
                <option value="">Any Available Master Stylist</option>
                {masters.map((master) => (
                  <option key={master._id} value={master._id}>
                    {master.name} — {master.specialty || "Master Barber"} ({master.experience || "5+ Years"})
                  </option>
                ))}
              </select>

              {activeMaster && (
                <div className="mt-2.5 p-3 bg-white border border-[#ded9d0] rounded-2xl flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#f0e7dc] flex items-center justify-center text-2xl border-2 border-[#66513e]/20 flex-shrink-0">
                    {activeMaster.avatar || "🧔"}
                  </div>
                  <div>
                    <h6 className="font-bold text-sm text-[#24231f]">
                      {activeMaster.name}
                    </h6>
                    <p className="text-xs text-[#8a7057]">
                      {activeMaster.specialty} • {activeMaster.experience || "5+ Years Exp"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Date Picker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#66513e] mb-2">
                  3. Select Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full p-3 bg-white border border-[#ded9d0] rounded-xl text-sm font-semibold text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#66513e]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#66513e] mb-2">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-3 bg-white border border-[#ded9d0] rounded-xl text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#66513e]"
                />
              </div>
            </div>

            {/* Time Slot Grid */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#66513e] mb-2">
                4. Select Time Slot
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = selectedTimeSlot === slot;
                  return (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-2.5 rounded-xl text-xs font-bold transition border ${
                        isSelected
                          ? "bg-[#66513e] text-white border-[#66513e] shadow-sm scale-102"
                          : "bg-white text-[#4a463f] border-[#ded9d0] hover:bg-[#f6f4ef]"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes / Special Instructions */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#66513e] mb-2">
                Special Requests or Notes (Optional)
              </label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Skin sensitive on neck, keep beard outline sharp, etc."
                className="w-full p-3 bg-white border border-[#ded9d0] rounded-xl text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#66513e]"
              ></textarea>
            </div>

            {/* Booking Summary Box */}
            <div className="bg-[#f0ebe1] p-4 rounded-2xl border border-[#e2dacd] text-xs text-[#4a463f] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-bold text-[#24231f] text-sm">
                  {finalServiceName}
                </p>
                <p>
                  With <strong className="text-[#66513e]">{finalMasterName}</strong> on{" "}
                  <strong>{appointmentDate}</strong> at <strong>{selectedTimeSlot}</strong>
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[#8a7057] block">
                  Estimated Price
                </span>
                <span className="font-serif text-lg font-bold text-[#66513e]">
                  {finalServicePrice}
                </span>
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-[#ded9d0]">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#ded9d0] text-sm font-semibold text-[#66513e] hover:bg-[#f6f4ef] transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#66513e] hover:bg-[#524131] text-white text-sm font-bold shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="animate-spin text-lg">↻</span>
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <span>Request Appointment</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

