import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import AppointmentModal from "../components/AppointmentModal";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function formatDate(date) {
  if (!date) return "Not set";

  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("salonUser");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [error, setError] = useState("");

  // Appointments state
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const loadAppointments = useCallback(async () => {
    setLoadingAppointments(true);
    try {
      const { data } = await api.get("/appointments/my");
      setAppointments(data.appointments || []);
    } catch (err) {
      console.warn("Could not load appointments:", err);
    } finally {
      setLoadingAppointments(false);
    }
  }, []);

  useEffect(() => {
    async function initUserDashboard() {
      try {
        const { data } = await api.get("/auth/me");
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("salonUser", JSON.stringify(data.user));
        }
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("salonToken");
          localStorage.removeItem("salonUser");
          navigate("/login");
          return;
        }
        console.warn("Could not refresh profile from server:", err);
      }
      loadAppointments();
    }

    initUserDashboard();
  }, [navigate, loadAppointments]);

  function logout() {
    localStorage.removeItem("salonToken");
    localStorage.removeItem("salonUser");
    navigate("/");
  }

  async function handleCancelAppointment(id) {
    if (!window.confirm("Are you sure you want to cancel this appointment request?")) {
      return;
    }

    setCancellingId(id);
    try {
      await api.patch(`/appointments/${id}/cancel`);
      setActionMessage("Appointment cancelled successfully.");
      await loadAppointments();
      setTimeout(() => setActionMessage(""), 4000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel appointment.");
    } finally {
      setCancellingId(null);
    }
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-[#f6f4ef]">
        <p className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">
          {error}
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <p className="font-serif text-lg font-bold text-[#66513e]">
          Loading your dashboard...
        </p>
      </main>
    );
  }

  const pendingCount = appointments.filter((a) => a.status === "pending").length;
  const acceptedCount = appointments.filter((a) => a.status === "accepted").length;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#24231f] flex flex-col justify-between">
      <Navbar onOpenBooking={() => setIsBookingModalOpen(true)} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-1 w-full">
      <div>
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e7e0d5]">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#8a7057]">
              CLIENT PORTAL & SCHEDULE
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#24231f] mt-1">
              My Profile & Appointments
            </h1>
          </div>
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="px-5 py-3 rounded-2xl text-sm font-bold bg-[#66513e] hover:bg-[#4d3b2d] text-white transition shadow-md flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <span>+</span>
            <span>Request Appointment</span>
          </button>
        </div>

        {/* Action Message Toast */}
        {actionMessage && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-sm border border-emerald-200 flex items-center justify-between shadow-xs">
            <span>✓ {actionMessage}</span>
            <button
              onClick={() => setActionMessage("")}
              className="text-emerald-700 font-bold ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* Welcome Banner */}
        <section className="my-6 bg-white border border-[#e7e0d5] p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#8a7057] mb-1">
              YOUR PERSONAL SALON SPACE
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#24231f] mb-1">
              Hello, {user.name}!
            </h2>
            <p className="text-sm text-[#6a665f]">
              Book haircut appointments, track acceptance from salon masters, and view reminders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-[#66513e] hover:bg-[#4d3b2d] text-white font-bold text-sm shadow-md transition flex items-center gap-2"
            >
              <span>📅</span>
              <span>Book / Request Appointment</span>
            </button>
            <button
              onClick={() => navigate("/hair-designs")}
              className="px-4 py-3 rounded-2xl bg-white border border-[#ded9d0] hover:bg-[#f6f4ef] text-[#66513e] font-bold text-sm transition shadow-xs"
            >
              Browse Hair Designs
            </button>
          </div>
        </section>

        {/* Haircut Schedule Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <article className="bg-white border border-[#e7e0d5] p-6 rounded-3xl shadow-sm flex flex-col justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-[#8a847a] mb-2">
              Last haircut
            </p>
            <h3 className="font-serif text-2xl font-bold text-[#24231f]">
              {formatDate(user.lastCuttingDate)}
            </h3>
          </article>

          <article className="bg-white border border-[#e7e0d5] p-6 rounded-3xl shadow-sm flex flex-col justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-[#8a847a] mb-2">
              Next haircut due
            </p>
            <h3 className="font-serif text-2xl font-bold text-[#24231f]">
              {formatDate(user.nextReminderDate)}
            </h3>
          </article>

          <article className="bg-white border border-[#e7e0d5] p-6 rounded-3xl shadow-sm flex flex-col justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-[#8a847a] mb-2">
              Active Bookings
            </p>
            <div className="flex items-center gap-2">
              {pendingCount > 0 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  {pendingCount} Pending
                </span>
              )}
              {acceptedCount > 0 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {acceptedCount} Confirmed
                </span>
              )}
              {pendingCount === 0 && acceptedCount === 0 && (
                <span className="text-sm text-[#8a847a] font-medium">None currently</span>
              )}
            </div>
          </article>
        </section>

        {/* ========================================================================= */}
        {/* APPOINTMENTS & BOOKINGS SECTION                                           */}
        {/* ========================================================================= */}
        <section className="bg-white border border-[#e7e0d5] rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f0ebe1]">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#8a7057]">
                YOUR APPOINTMENT REQUESTS
              </p>
              <h3 className="font-serif text-2xl font-bold text-[#24231f] mt-1">
                Haircut Bookings & Status
              </h3>
            </div>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#66513e] hover:bg-[#524131] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>+</span>
              <span>New Appointment</span>
            </button>
          </div>

          {loadingAppointments ? (
            <div className="p-10 text-center text-sm text-[#8a847a]">
              Loading your appointments...
            </div>
          ) : appointments.length === 0 ? (
            <div className="p-10 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#f0ebe1] text-[#66513e] flex items-center justify-center text-2xl font-serif">
                ✂️
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-[#24231f]">
                  No Appointments Booked Yet
                </h4>
                <p className="text-xs text-[#6a665f] mt-1 max-w-sm mx-auto">
                  Pick your favorite haircut style and schedule a session with our master barbers.
                </p>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#66513e] hover:bg-[#524131] text-white text-xs font-bold shadow-xs transition"
              >
                Request an Appointment Now
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#f0ebe1] mt-2">
              {appointments.map((appt) => {
                const isPending = appt.status === "pending";
                const isAccepted = appt.status === "accepted";
                const isCompleted = appt.status === "completed";
                const isDeclined = appt.status === "declined";
                const isCancelled = appt.status === "cancelled";

                return (
                  <article
                    key={appt._id}
                    className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-5 transition hover:bg-[#fcfbfa] px-3 -mx-3 rounded-2xl"
                  >
                    {/* Left: Service Image & Details */}
                    <div className="flex items-start gap-4 flex-1">
                      {appt.hairStyleImage ? (
                        <img
                          src={appt.hairStyleImage}
                          alt={appt.service}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-[#ded9d0] flex-shrink-0 shadow-xs"
                        />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#f0ebe1] text-[#66513e] flex items-center justify-center text-2xl flex-shrink-0 border border-[#ded9d0]">
                          ✂️
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-serif text-lg font-bold text-[#24231f]">
                            {appt.service}
                          </h4>
                          {appt.servicePrice && (
                            <span className="text-xs font-bold text-[#66513e] bg-[#f0ebe1] px-2 py-0.5 rounded-md">
                              {appt.servicePrice}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#6a665f] flex items-center gap-2">
                          <span>Master Stylist:</span>
                          <strong className="text-[#392918]">
                            {appt.masterName || "Any Available Master"}
                          </strong>
                        </p>

                        <p className="text-xs font-semibold text-[#24231f] flex items-center gap-1.5">
                          <span>📅</span>
                          <span>
                            {new Date(appt.appointmentDate).toLocaleDateString("en-IN", {
                              weekday: "short",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                          <span className="text-[#8a847a]">•</span>
                          <span>⏰ {appt.timeSlot}</span>
                        </p>

                        {appt.notes && (
                          <p className="text-xs text-[#736e65] italic bg-[#faf8f5] p-2 rounded-lg border border-[#ded9d0]/60 max-w-lg">
                            "{appt.notes}"
                          </p>
                        )}

                        {appt.adminNotes && (
                          <p className="text-xs text-[#66513e] bg-amber-50 p-2 rounded-lg border border-amber-200 font-medium max-w-lg">
                            <strong>Salon Message:</strong> {appt.adminNotes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Status Pill & Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3">
                      {isPending && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                          <span>Pending Acceptance</span>
                        </span>
                      )}

                      {isAccepted && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5 shadow-xs">
                          <span>✓</span>
                          <span>Accepted & Confirmed</span>
                        </span>
                      )}

                      {isCompleted && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-300">
                          Visit Completed
                        </span>
                      )}

                      {isDeclined && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                          Declined
                        </span>
                      )}

                      {isCancelled && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-100 text-zinc-600 border border-zinc-200">
                          Cancelled
                        </span>
                      )}

                      {/* Cancel action for pending or accepted appointments */}
                      {(isPending || isAccepted) && (
                        <button
                          type="button"
                          onClick={() => handleCancelAppointment(appt._id)}
                          disabled={cancellingId === appt._id}
                          className="text-xs text-red-600 hover:text-red-800 hover:underline font-semibold disabled:opacity-50"
                        >
                          {cancellingId === appt._id ? "Cancelling..." : "Cancel Booking"}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Salon Note info card */}
        <section className="bg-[#f0ebe1] border border-[#e2dacd] p-6 sm:p-8 rounded-3xl">
          <h2 className="font-serif text-xl font-bold text-[#24231f] mb-2">
            Stay Looking Your Best
          </h2>
          <p className="text-sm text-[#4a463f] leading-relaxed mb-4">
            Your appointment requests are reviewed by our master barbers. Once accepted, you will receive an automated confirmation email.
          </p>
          <p className="text-xs font-mono font-medium text-[#66513e]">
            Account Email: {user.email}
          </p>
        </section>
      </div>

      {/* Booking Modal */}
        <AppointmentModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onSuccess={() => {
            loadAppointments();
          }}
        />
      </main>

      <Footer />
    </div>
  );
}
