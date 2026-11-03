import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function formatDate(date) {
  if (!date) return "Not set";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatDateTime(date) {
  if (!date) return "Never";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

const AVATAR_OPTIONS = ["🧔", "💇", "💈", "👑", "✂️", "🧑‍𦱁", "⚡", "✨"];
const STYLE_ICONS = ["✂️", "💈", "🌊", "🔥", "💼", "⚡", "🎯", "👑", "✨"];
const STYLE_CATEGORIES = [
  "Fades & Tapers",
  "Classic & Gentleman",
  "Textured & Modern",
  "Beard & Grooming",
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Active top-level tab: "customers" | "masters" | "hairstyles"
  const [activeTab, setActiveTab] = useState("customers");

  // Customers state
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [dates, setDates] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Customer filter state: "all" or "due"
  const [activeFilter, setActiveFilter] = useState("all");

  // Email action state
  const [emailLoading, setEmailLoading] = useState({});
  const [bulkLoading, setBulkLoading] = useState(false);

  // Custom email modal state
  const [modalUser, setModalUser] = useState(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [modalSending, setModalSending] = useState(false);

  // Masters state
  const [masters, setMasters] = useState([]);
  const [loadingMasters, setLoadingMasters] = useState(false);
  const [showAddMasterModal, setShowAddMasterModal] = useState(false);
  const [addingMaster, setAddingMaster] = useState(false);
  const [editingMaster, setEditingMaster] = useState(null);
  const [updatingMaster, setUpdatingMaster] = useState(false);
  const [masterToDelete, setMasterToDelete] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const [newMaster, setNewMaster] = useState({
    name: "",
    specialty: "",
    experience: "5+ Years",
    bio: "",
    phone: "",
    avatar: "🧔",
  });

  // Hairstyles & Cutting Style Profile state
  const [hairStyles, setHairStyles] = useState([]);
  const [loadingHairStyles, setLoadingHairStyles] = useState(false);
  const [styleSearch, setStyleSearch] = useState("");
  const [selectedStyleCategory, setSelectedStyleCategory] = useState("All");
  const [showAddStyleModal, setShowAddStyleModal] = useState(false);
  const [addingStyle, setAddingStyle] = useState(false);
  const [editingStyle, setEditingStyle] = useState(null);
  const [updatingStyle, setUpdatingStyle] = useState(false);
  const [styleToDelete, setStyleToDelete] = useState(null);

  // Full Screen Lightbox Viewer state
  const [fullscreenViewer, setFullscreenViewer] = useState(null);

  const [newStyle, setNewStyle] = useState({
    title: "",
    category: "Fades & Tapers",
    icon: "✂️",
    imageUrl: "",
    images: ["", "", ""],
    cycle: "3 - 4 Weeks",
    hairType: "Straight, Wavy, Thick",
    faceShape: "Oval, Square, Round",
    product: "Matte Clay / Pomade",
    description: "",
    stylingTips: "",
    masterProfile: "",
  });

  // Appointments state
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [appointmentStats, setAppointmentStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    completed: 0,
    declined: 0,
  });
  const [appointmentFilter, setAppointmentFilter] = useState("all");
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [actionLoadingAppt, setActionLoadingAppt] = useState({});
  const [appointmentToDecline, setAppointmentToDecline] = useState(null);
  const [declineReason, setDeclineReason] = useState("");
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  // Services & Amount state
  const [adminServices, setAdminServices] = useState([]);
  const [loadingAdminServices, setLoadingAdminServices] = useState(false);
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState("All");
  const [serviceSearchTerm, setServiceSearchTerm] = useState("");
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    title: "",
    category: "Hair Cutting",
    price: 150,
    originalPrice: "",
    duration: "20 mins",
    description: "",
    icon: "✂️",
    popularBadge: "",
    savings: "",
  });

  const loadUsers = useCallback(async () => {
    try {
      setError("");
      const { data } = await api.get("/admin/users");
      setUsers(data.users || []);
    } catch (err) {
      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        localStorage.removeItem("salonToken");
        localStorage.removeItem("salonUser");
        navigate("/login");
      } else {
        setError("Unable to load customers.");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const loadMasters = useCallback(async () => {
    setLoadingMasters(true);
    try {
      const { data } = await api.get("/admin/masters");
      setMasters(data.masters || []);
    } catch (err) {
      console.error("Failed to load masters:", err);
    } finally {
      setLoadingMasters(false);
    }
  }, []);

  const loadHairStyles = useCallback(async () => {
    setLoadingHairStyles(true);
    try {
      const { data } = await api.get("/admin/hairstyles");
      setHairStyles(data.hairStyles || []);
    } catch (err) {
      console.error("Failed to load hairstyles:", err);
    } finally {
      setLoadingHairStyles(false);
    }
  }, []);

  const loadAppointments = useCallback(async () => {
    setLoadingAppointments(true);
    try {
      const { data } = await api.get("/admin/appointments");
      setAppointments(data.appointments || []);
      if (data.stats) {
        setAppointmentStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load appointments:", err);
    } finally {
      setLoadingAppointments(false);
    }
  }, []);

  const loadAdminServices = useCallback(async () => {
    setLoadingAdminServices(true);
    try {
      const { data } = await api.get("/services");
      setAdminServices(data.services || []);
    } catch (err) {
      console.error("Failed to load services:", err);
    } finally {
      setLoadingAdminServices(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
    loadMasters();
    loadHairStyles();
    loadAppointments();
    loadAdminServices();
  }, [loadUsers, loadMasters, loadHairStyles, loadAppointments, loadAdminServices]);

  // Full screen keyboard navigation
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

  function openEditStyle(style) {
    const imgs =
      Array.isArray(style.images) && style.images.length > 0
        ? [...style.images]
        : style.imageUrl
        ? [style.imageUrl]
        : [];

    while (imgs.length < 3) {
      imgs.push("");
    }

    setEditingStyle({
      ...style,
      images: imgs,
    });
  }

  async function updateDate(userId) {
    setMessage("");
    setError("");

    const lastCuttingDate = dates[userId];

    if (!lastCuttingDate) {
      setError("Select a haircut date first.");
      return;
    }

    try {
      const { data } = await api.patch(
        `/admin/users/${userId}/cutting-date`,
        { lastCuttingDate }
      );

      setMessage(
        `${data.user.name}'s haircut date was updated successfully.`
      );

      setDates((previous) => {
        const next = { ...previous };
        delete next[userId];
        return next;
      });

      await loadUsers();
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not update the date."
      );
    }
  }

  // Quick 1-click send reminder to single customer
  async function handleSendReminder(user) {
    setMessage("");
    setError("");
    setEmailLoading((prev) => ({ ...prev, [user._id]: true }));

    try {
      const { data } = await api.post(`/admin/users/${user._id}/send-email`);
      setMessage(data.message || `Reminder email sent to ${user.email}.`);
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Could not send reminder email.");
    } finally {
      setEmailLoading((prev) => ({ ...prev, [user._id]: false }));
    }
  }

  // Bulk send reminder to all due customers
  async function handleBulkSend() {
    setMessage("");
    setError("");
    setBulkLoading(true);

    try {
      const { data } = await api.post("/admin/send-due-reminders");
      setMessage(data.message || "Bulk reminder dispatch completed.");
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to dispatch bulk reminders.");
    } finally {
      setBulkLoading(false);
    }
  }

  // Delete customer
  async function confirmDeleteCustomer() {
    if (!customerToDelete) return;

    setMessage("");
    setError("");

    try {
      const { data } = await api.delete(`/admin/users/${customerToDelete._id}`);
      setMessage(data.message || "Customer deleted successfully.");
      setCustomerToDelete(null);
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete customer.");
    }
  }

  // Add a new master
  async function handleCreateMaster(e) {
    e.preventDefault();
    if (!newMaster.name.trim() || !newMaster.specialty.trim()) {
      setError("Master name and specialty are required.");
      return;
    }

    setAddingMaster(true);
    setMessage("");
    setError("");

    try {
      const { data } = await api.post("/admin/masters", newMaster);
      setMessage(data.message || "Master added successfully.");
      setShowAddMasterModal(false);
      setNewMaster({
        name: "",
        specialty: "",
        experience: "5+ Years",
        bio: "",
        phone: "",
        avatar: "🧔",
      });
      await loadMasters();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add master.");
    } finally {
      setAddingMaster(false);
    }
  }

  // Update existing master
  async function handleUpdateMaster(e) {
    e.preventDefault();
    if (!editingMaster.name.trim() || !editingMaster.specialty.trim()) {
      setError("Master name and specialty are required.");
      return;
    }

    setUpdatingMaster(true);
    setMessage("");
    setError("");

    try {
      const { data } = await api.patch(
        `/admin/masters/${editingMaster._id}`,
        editingMaster
      );
      setMessage(data.message || "Master details updated successfully.");
      setEditingMaster(null);
      await loadMasters();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update master.");
    } finally {
      setUpdatingMaster(false);
    }
  }

  // Delete a master
  async function confirmDeleteMaster() {
    if (!masterToDelete) return;

    setMessage("");
    setError("");

    try {
      const { data } = await api.delete(`/admin/masters/${masterToDelete._id}`);
      setMessage(data.message || "Master deleted successfully.");
      setMasterToDelete(null);
      await loadMasters();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete master.");
    }
  }

  // Add a new hair style with 2-3 images
  async function handleCreateStyle(e) {
    e.preventDefault();
    if (!newStyle.title.trim()) {
      setError("Style title is required.");
      return;
    }

    setAddingStyle(true);
    setMessage("");
    setError("");

    const cleanImages = (newStyle.images || []).map((s) => s.trim()).filter(Boolean);

    try {
      const { data } = await api.post("/admin/hairstyles", {
        ...newStyle,
        images: cleanImages,
        imageUrl: cleanImages.length > 0 ? cleanImages[0] : newStyle.imageUrl,
      });

      setMessage(data.message || "Haircut style added successfully.");
      setShowAddStyleModal(false);
      setNewStyle({
        title: "",
        category: "Fades & Tapers",
        icon: "✂️",
        imageUrl: "",
        images: ["", "", ""],
        cycle: "3 - 4 Weeks",
        hairType: "Straight, Wavy, Thick",
        faceShape: "Oval, Square, Round",
        product: "Matte Clay / Pomade",
        description: "",
        stylingTips: "",
        masterProfile: "",
      });
      await loadHairStyles();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add hairstyle.");
    } finally {
      setAddingStyle(false);
    }
  }

  // Update existing hair style
  async function handleUpdateStyle(e) {
    e.preventDefault();
    if (!editingStyle.title.trim()) {
      setError("Style title is required.");
      return;
    }

    setUpdatingStyle(true);
    setMessage("");
    setError("");

    const cleanImages = (editingStyle.images || []).map((s) => s.trim()).filter(Boolean);

    try {
      const { data } = await api.patch(`/admin/hairstyles/${editingStyle._id}`, {
        ...editingStyle,
        images: cleanImages,
        imageUrl: cleanImages.length > 0 ? cleanImages[0] : editingStyle.imageUrl,
      });

      setMessage(data.message || "Haircut style updated successfully.");
      setEditingStyle(null);
      await loadHairStyles();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update hairstyle.");
    } finally {
      setUpdatingStyle(false);
    }
  }

  // Delete hair style
  async function confirmDeleteStyle() {
    if (!styleToDelete) return;

    setMessage("");
    setError("");

    try {
      const { data } = await api.delete(`/admin/hairstyles/${styleToDelete._id}`);
      setMessage(data.message || "Haircut style deleted successfully.");
      setStyleToDelete(null);
      await loadHairStyles();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete hairstyle.");
    }
  }

  // Open custom email compose modal
  function openCustomEmailModal(user) {
    setModalUser(user);
    setEmailSubject("Your next salon visit is due!");
    setEmailBody(
      `Hello ${user.name},\n\n` +
      `This is a friendly reminder from our salon that your next haircut is due!\n` +
      (user.lastCuttingDate
        ? `Your last haircut date was ${formatDate(user.lastCuttingDate)}.\n\n`
        : "\n") +
      `Please contact us to book your convenient time slot.\n\n` +
      `Thank you for choosing our salon!\nSalon Management Team`
    );
  }

  // Submit custom email from modal
  async function handleSendCustomEmail(event) {
    event.preventDefault();
    if (!modalUser) return;

    setModalSending(true);
    setMessage("");
    setError("");

    try {
      const { data } = await api.post(`/admin/users/${modalUser._id}/send-email`, {
        subject: emailSubject,
        message: emailBody,
      });

      setMessage(data.message || `Custom email sent to ${modalUser.email}!`);
      setModalUser(null);
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Could not send custom email.");
    } finally {
      setModalSending(false);
    }
  }

  function logout() {
    localStorage.removeItem("salonToken");
    localStorage.removeItem("salonUser");
    navigate("/");
  }

  const dueCustomers = users.filter(
    (user) =>
      user.nextReminderDate &&
      new Date(user.nextReminderDate) <= new Date()
  );

  const filteredUsers = users.filter((user) => {
    const matchesSearch = `${user.name} ${user.email}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const isDue =
      user.nextReminderDate &&
      new Date(user.nextReminderDate) <= new Date();

    if (activeFilter === "due") {
      return matchesSearch && isDue;
    }

    return matchesSearch;
  });

  async function handleAcceptAppointment(appt, updateDate = true) {
    setActionLoadingAppt((prev) => ({ ...prev, [appt._id]: true }));
    setError("");
    setMessage("");

    try {
      const { data } = await api.patch(
        `/admin/appointments/${appt._id}/status`,
        {
          status: "accepted",
          updateLastCuttingDate: updateDate,
        }
      );

      const formatted = new Date(appt.appointmentDate).toLocaleDateString(
        "en-IN",
        { day: "numeric", month: "short", year: "numeric" }
      );
      setMessage(
        `✓ Appointment for ${appt.userName} (${appt.service}) on ${formatted} at ${appt.timeSlot} ACCEPTED! Confirmation dispatched.`
      );
      await loadAppointments();
      await loadUsers();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to accept appointment."
      );
    } finally {
      setActionLoadingAppt((prev) => ({ ...prev, [appt._id]: false }));
    }
  }

  async function handleDeclineAppointment(appt, reason = "") {
    setActionLoadingAppt((prev) => ({ ...prev, [appt._id]: true }));
    setError("");
    setMessage("");

    try {
      await api.patch(`/admin/appointments/${appt._id}/status`, {
        status: "declined",
        adminNotes: reason,
      });

      setMessage(`Appointment for ${appt.userName} has been declined.`);
      setAppointmentToDecline(null);
      setDeclineReason("");
      await loadAppointments();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to decline appointment."
      );
    } finally {
      setActionLoadingAppt((prev) => ({ ...prev, [appt._id]: false }));
    }
  }

  async function handleCompleteAppointment(appt) {
    setActionLoadingAppt((prev) => ({ ...prev, [appt._id]: true }));
    setError("");
    setMessage("");

    try {
      await api.patch(`/admin/appointments/${appt._id}/status`, {
        status: "completed",
      });

      setMessage(
        `✓ Haircut session for ${appt.userName} marked as COMPLETED! Cutting date & reminder cycle updated.`
      );
      await loadAppointments();
      await loadUsers();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to complete appointment."
      );
    } finally {
      setActionLoadingAppt((prev) => ({ ...prev, [appt._id]: false }));
    }
  }

  async function handleDeleteAppointment(id) {
    setError("");
    setMessage("");

    try {
      await api.delete(`/admin/appointments/${id}`);
      setMessage("Appointment deleted successfully.");
      setAppointmentToDelete(null);
      await loadAppointments();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete appointment."
      );
    }
  }

  const filteredAppointments = appointments.filter((appt) => {
    const matchesFilter =
      appointmentFilter === "all" || appt.status === appointmentFilter;
    const matchesSearch =
      (appt.userName &&
        appt.userName.toLowerCase().includes(appointmentSearch.toLowerCase())) ||
      (appt.userEmail &&
        appt.userEmail.toLowerCase().includes(appointmentSearch.toLowerCase())) ||
      (appt.userPhone &&
        appt.userPhone.toLowerCase().includes(appointmentSearch.toLowerCase())) ||
      (appt.service &&
        appt.service.toLowerCase().includes(appointmentSearch.toLowerCase())) ||
      (appt.masterName &&
        appt.masterName.toLowerCase().includes(appointmentSearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  async function handleCreateService(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const { data } = await api.post("/admin/services", serviceForm);
      setMessage(data.message || `Service "${serviceForm.title}" added successfully!`);
      setShowAddServiceModal(false);
      setServiceForm({
        title: "",
        category: "Hair Cutting",
        price: 150,
        originalPrice: "",
        duration: "20 mins",
        description: "",
        icon: "✂️",
        popularBadge: "",
        savings: "",
      });
      await loadAdminServices();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create service.");
    }
  }

  async function handleUpdateService(e) {
    e.preventDefault();
    if (!editingService) return;
    setError("");
    setMessage("");

    try {
      const { data } = await api.patch(
        `/admin/services/${editingService._id}`,
        editingService
      );
      setMessage(data.message || `Service "${editingService.title}" updated!`);
      setEditingService(null);
      await loadAdminServices();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update service.");
    }
  }

  async function handleDeleteService(id) {
    setError("");
    setMessage("");

    try {
      const { data } = await api.delete(`/admin/services/${id}`);
      setMessage(data.message || "Service deleted.");
      setServiceToDelete(null);
      await loadAdminServices();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete service.");
    }
  }

  const filteredAdminServices = adminServices.filter((svc) => {
    const matchesCat =
      serviceCategoryFilter === "All" || svc.category === serviceCategoryFilter;
    const q = serviceSearchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      svc.title.toLowerCase().includes(q) ||
      svc.category.toLowerCase().includes(q) ||
      (svc.description && svc.description.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const filteredStyles = hairStyles.filter((style) => {
    const matchesCat =
      selectedStyleCategory === "All" || style.category === selectedStyleCategory;
    const matchesSearch =
      style.title.toLowerCase().includes(styleSearch.toLowerCase()) ||
      (style.description && style.description.toLowerCase().includes(styleSearch.toLowerCase())) ||
      (style.masterProfile && style.masterProfile.toLowerCase().includes(styleSearch.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#24231f] p-4 sm:p-8 md:p-10 max-w-7xl mx-auto flex flex-col justify-between">
      <div>
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e7e0d5]">
          <div className="flex items-center gap-3.5">
            <Link
              to="/"
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#66513e] to-[#392918] text-white flex items-center justify-center text-xl shadow-md hover:scale-105 transition-transform"
              title="Go to Website Home"
            >
              ✂️
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#8a7057]">
                  SALON MANAGEMENT SYSTEM
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#66513e] text-white">
                  ADMIN SUITE
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#24231f] mt-0.5">
                Admin Control Center
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-4 py-2.5 rounded-xl text-xs font-bold border border-[#ded9d0] bg-white hover:bg-[#f6f4ef] text-[#392918] transition shadow-2xs flex items-center gap-1.5"
            >
              <span>🌐</span>
              <span>View Live Website</span>
            </Link>
            <button
              className="px-4 py-2.5 rounded-xl text-xs font-bold border border-red-200 bg-white hover:bg-red-50 text-red-700 transition shadow-2xs cursor-pointer"
              onClick={logout}
            >
              Log out
            </button>
          </div>
        </header>

        {/* Global Alert Messages */}
        {message && (
          <p className="my-4 p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-sm border border-emerald-200 shadow-xs flex items-center justify-between">
            <span>✓ {message}</span>
            <button onClick={() => setMessage("")} className="text-emerald-600 hover:text-emerald-900 font-bold ml-4">✕</button>
          </p>
        )}
        {error && (
          <p className="my-4 p-4 rounded-2xl bg-red-50 text-red-700 text-sm border border-red-200 shadow-xs flex items-center justify-between">
            <span>⚠ {error}</span>
            <button onClick={() => setError("")} className="text-red-500 hover:text-red-800 font-bold ml-4">✕</button>
          </p>
        )}

        {/* Top-Level Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-3 my-6 pb-2 border-b border-[#e7e0d5]">
          <button
            onClick={() => setActiveTab("customers")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === "customers"
                ? "bg-[#66513e] text-white shadow-sm"
                : "bg-white border border-[#ded9d0] text-[#66513e] hover:bg-[#f6f4ef]"
            }`}
          >
            <span>👥</span>
            <span>Customers & Haircuts ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("masters")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === "masters"
                ? "bg-[#66513e] text-white shadow-sm"
                : "bg-white border border-[#ded9d0] text-[#66513e] hover:bg-[#f6f4ef]"
            }`}
          >
            <span>✂️</span>
            <span>Salon Masters / Stylists ({masters.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("hairstyles")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === "hairstyles"
                ? "bg-[#66513e] text-white shadow-sm"
                : "bg-white border border-[#ded9d0] text-[#66513e] hover:bg-[#f6f4ef]"
            }`}
          >
            <span>💈</span>
            <span>Haircut Styles & Designs ({hairStyles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("appointments")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === "appointments"
                ? "bg-[#66513e] text-white shadow-sm"
                : "bg-white border border-[#ded9d0] text-[#66513e] hover:bg-[#f6f4ef]"
            }`}
          >
            <span>📅</span>
            <span>Appointments ({appointments.length})</span>
            {appointmentStats.pending > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-black bg-amber-400 text-stone-900 animate-pulse">
                {appointmentStats.pending} PENDING
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("pricing")}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === "pricing"
                ? "bg-[#66513e] text-white shadow-sm"
                : "bg-white border border-[#ded9d0] text-[#66513e] hover:bg-[#f6f4ef]"
            }`}
          >
            <span>💰</span>
            <span>Rate Card & Amounts ({adminServices.length})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: CUSTOMERS & HAIRCUT REMINDERS                                      */}
        {/* ========================================================================= */}
        {activeTab === "customers" && (
          <div>
            {/* Clickable Stat Cards for Filtering */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <article
                onClick={() => setActiveFilter("all")}
                className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                  activeFilter === "all"
                    ? "bg-white border-[#66513e] ring-2 ring-[#66513e] shadow-md"
                    : "bg-white border-[#e7e0d5] hover:border-[#b9a38a] shadow-sm hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#8a847a]">
                    Total customers
                  </p>
                  {activeFilter === "all" ? (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#66513e] text-white">
                      Viewing All
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#8a847a] underline">Click to view</span>
                  )}
                </div>
                <h3 className="font-serif text-3xl font-bold text-[#24231f]">
                  {users.length}
                </h3>
                <p className="text-xs text-[#66513e] font-semibold mt-3">
                  {activeFilter === "all" ? "✓ Currently showing all customers" : "Click to view all customers →"}
                </p>
              </article>

              <article
                onClick={() => setActiveFilter("due")}
                className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                  activeFilter === "due"
                    ? "bg-[#fffcf7] border-amber-600 ring-2 ring-amber-600 shadow-md"
                    : "bg-white border-[#e7e0d5] hover:border-[#b9a38a] shadow-sm hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#8a847a]">
                    Due or overdue
                  </p>
                  {activeFilter === "due" ? (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-600 text-white">
                      Filtered: Due
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#8a847a] underline">Click to view</span>
                  )}
                </div>
                <h3 className="font-serif text-3xl font-bold text-[#24231f]">
                  {dueCustomers.length}
                </h3>
                <p className="text-xs text-amber-800 font-semibold mt-1">
                  {activeFilter === "due" ? "✓ Currently showing due customers only" : "Click to view due customers only →"}
                </p>
                {dueCustomers.length > 0 && (
                  <button
                    className="mt-3 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#66513e] hover:bg-[#4d3b2d] disabled:opacity-60 transition shadow-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBulkSend();
                    }}
                    disabled={bulkLoading}
                  >
                    {bulkLoading ? "Sending Reminders..." : `✉️ Send All ${dueCustomers.length} Due Reminders`}
                  </button>
                )}
              </article>

              <article
                onClick={() => setActiveTab("hairstyles")}
                className="bg-white border border-[#e7e0d5] hover:border-[#b9a38a] p-6 rounded-3xl shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#8a847a]">
                    Hair Designs Catalog
                  </p>
                  <span className="text-[10px] text-[#8a847a] underline">Manage Styles</span>
                </div>
                <h3 className="font-serif text-3xl font-bold text-[#24231f]">
                  {hairStyles.length} Styles
                </h3>
                <p className="text-xs text-[#66513e] font-semibold mt-3">
                  Click to add, edit, or delete hair designs →
                </p>
              </article>
            </section>

            <section className="bg-white border border-[#e7e0d5] rounded-3xl p-6 sm:p-8 shadow-sm overflow-hidden mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#f0ebe1]">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-serif text-2xl font-bold text-[#24231f]">Customers</h2>
                    {activeFilter === "due" && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                        Filtered: Due Only
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#8a847a] mt-0.5">
                    Update haircut dates, dispatch reminders, or manage client profiles.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Filter tabs */}
                  <div className="flex items-center bg-[#f6f4ef] p-1 rounded-xl border border-[#ded9d0]">
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        activeFilter === "all"
                          ? "bg-[#66513e] text-white shadow-xs"
                          : "text-[#66513e] hover:text-[#24231f]"
                      }`}
                      onClick={() => setActiveFilter("all")}
                    >
                      All ({users.length})
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        activeFilter === "due"
                          ? "bg-amber-600 text-white shadow-xs"
                          : "text-[#66513e] hover:text-[#24231f]"
                      }`}
                      onClick={() => setActiveFilter("due")}
                    >
                      Due ({dueCustomers.length})
                    </button>
                  </div>

                  {/* Search input */}
                  <input
                    className="px-4 py-2 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] placeholder-[#a8a196] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition w-full md:w-64"
                    placeholder="Search customers..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
              </div>

              {loading && (
                <p className="py-8 text-center font-serif text-[#66513e]">
                  Loading customers...
                </p>
              )}

              {!loading && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-[#e7e0d5] text-xs font-bold uppercase tracking-wider text-[#8a847a]">
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Last haircut</th>
                        <th className="py-3 px-4">Next due</th>
                        <th className="py-3 px-4">Set haircut date</th>
                        <th className="py-3 px-4">Reminder Status</th>
                        <th className="py-3 px-4">Email Actions</th>
                        <th className="py-3 px-4 text-right">Delete</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredUsers.map((user) => {
                        const isDue =
                          user.nextReminderDate &&
                          new Date(user.nextReminderDate) <= new Date();

                        return (
                          <tr key={user._id} className="border-b border-[#f3efe8] hover:bg-[#faf8f5] transition">
                            <td className="py-3.5 px-4">
                              <strong className="block text-[#24231f]">{user.name}</strong>
                              <span className="text-xs text-[#8a847a]">{user.email}</span>
                            </td>

                            <td className="py-3.5 px-4 text-[#392918]">{formatDate(user.lastCuttingDate)}</td>
                            <td className="py-3.5 px-4 text-[#392918]">{formatDate(user.nextReminderDate)}</td>

                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <input
                                  type="date"
                                  value={dates[user._id] || ""}
                                  max={new Date().toLocaleDateString("en-CA")}
                                  onChange={(event) =>
                                    setDates((previous) => ({
                                      ...previous,
                                      [user._id]: event.target.value,
                                    }))
                                  }
                                  className="px-2.5 py-1.5 rounded-lg border border-[#ded9d0] text-xs bg-white text-[#24231f]"
                                />
                                <button
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#66513e] hover:bg-[#4d3b2d] text-white transition shadow-xs"
                                  onClick={() => updateDate(user._id)}
                                >
                                  Save
                                </button>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              {user.lastReminderSentAt ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                  Sent: {formatDateTime(user.lastReminderSentAt)}
                                </span>
                              ) : isDue ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900">
                                  Due now
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                                  Scheduled
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <button
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#66513e] hover:bg-[#4d3b2d] text-white transition shadow-xs disabled:opacity-50"
                                  onClick={() => handleSendReminder(user)}
                                  disabled={emailLoading[user._id]}
                                  title="Send standard haircut reminder email immediately"
                                >
                                  {emailLoading[user._id] ? "Sending..." : "✉️ Reminder"}
                                </button>

                                <button
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#ded9d0] text-[#66513e] hover:bg-[#f6f4ef] transition"
                                  onClick={() => openCustomEmailModal(user)}
                                  title="Compose a custom subject & message for this customer"
                                >
                                  Custom
                                </button>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <button
                                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-800 border border-transparent hover:border-red-200 transition"
                                onClick={() => setCustomerToDelete(user)}
                                title="Delete this customer account"
                              >
                                🗑️ Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}

                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan="7" className="py-8 text-center text-sm text-[#8a847a]">
                            {activeFilter === "due" ? (
                              <div>
                                <p>No customers are currently due or overdue for a haircut.</p>
                                <button
                                  type="button"
                                  className="mt-3 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#66513e] border border-[#ded9d0] hover:bg-[#f6f4ef]"
                                  onClick={() => setActiveFilter("all")}
                                >
                                  View All Customers
                                </button>
                              </div>
                            ) : (
                              "No customers found matching your search."
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SALON MASTERS & STYLISTS MANAGEMENT                                */}
        {/* ========================================================================= */}
        {activeTab === "masters" && (
          <div>
            <section className="bg-white border border-[#e7e0d5] rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f0ebe1]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#8a7057]">
                    SALON ARTISANS & BARBERS
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#24231f] mt-1">
                    Master Stylists Directory
                  </h2>
                  <p className="text-sm text-[#6a665f] mt-1">
                    View, add, edit, and delete masters who cut hair at MET75 Salon.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddMasterModal(true)}
                  className="px-5 py-3 rounded-2xl font-bold text-sm text-white bg-[#66513e] hover:bg-[#4d3b2d] shadow-sm hover:shadow-md transition flex items-center gap-2 self-start sm:self-auto"
                >
                  <span className="text-base">➕</span>
                  <span>Add New Master</span>
                </button>
              </div>

              {loadingMasters && (
                <p className="py-12 text-center font-serif text-[#66513e]">
                  Loading salon masters...
                </p>
              )}

              {!loadingMasters && masters.length === 0 && (
                <div className="py-16 text-center">
                  <span className="text-4xl block mb-2">✂️</span>
                  <h3 className="font-serif text-xl font-bold text-[#24231f]">No Masters Added Yet</h3>
                  <p className="text-sm text-[#8a847a] mt-1 mb-4">Add your first master stylist or barber to showcase them in the salon.</p>
                  <button
                    onClick={() => setShowAddMasterModal(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#66513e] hover:bg-[#4d3b2d] transition"
                  >
                    Add Master Now
                  </button>
                </div>
              )}

              {!loadingMasters && masters.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                  {masters.map((master) => (
                    <article
                      key={master._id}
                      className="bg-[#faf8f5] border border-[#e7e0d5] rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="w-16 h-16 rounded-2xl bg-white border border-[#ded9d0] flex items-center justify-center text-3xl shadow-xs">
                            {master.avatar || "🧔"}
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              master.status === "on_leave"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {master.status === "on_leave" ? "On Leave" : "Active"}
                          </span>
                        </div>

                        <h3 className="font-serif text-xl font-bold text-[#24231f] mb-1">
                          {master.name}
                        </h3>
                        <p className="text-xs uppercase tracking-wider font-bold text-[#8a7057] mb-2">
                          {master.specialty}
                        </p>
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ece5dc] text-[#554231] mb-3">
                          ⏱ {master.experience || "5+ Years"}
                        </span>

                        <p className="text-xs text-[#6a665f] leading-relaxed mb-4">
                          {master.bio || "Experienced salon stylist dedicated to precision haircutting and modern grooming."}
                        </p>

                        {master.phone && (
                          <p className="text-xs text-[#8a847a] mb-4">
                            📞 Contact: <span className="font-semibold text-[#24231f]">{master.phone}</span>
                          </p>
                        )}
                      </div>

                      <div className="pt-4 border-t border-[#ded9d0] flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[#8a847a]">
                          Added: {formatDate(master.createdAt)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingMaster({ ...master })}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#66513e] hover:bg-[#e9e3d8] bg-[#f6f4ef] border border-[#ded9d0] transition flex items-center gap-1"
                          >
                            <span>✏️</span>
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setMasterToDelete(master)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-800 border border-red-200 transition"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: HAIRCUT STYLES & DESIGNS CATALOG                                   */}
        {/* ========================================================================= */}
        {activeTab === "hairstyles" && (
          <div>
            <section className="bg-white border border-[#e7e0d5] rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f0ebe1]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#8a7057]">
                    LOOKBOOK & DESIGNS
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#24231f] mt-1">
                    Haircut Styles & Cutting Profiles
                  </h2>
                  <p className="text-sm text-[#6a665f] mt-1">
                    Add haircut styles with 2-3 angle profile pictures, maintenance cycles, and master stylist profiles. Click any picture to view full screen!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddStyleModal(true)}
                  className="px-5 py-3 rounded-2xl font-bold text-sm text-white bg-[#66513e] hover:bg-[#4d3b2d] shadow-sm hover:shadow-md transition flex items-center gap-2 self-start sm:self-auto"
                >
                  <span className="text-base">➕</span>
                  <span>Add Cutting Style</span>
                </button>
              </div>

              {/* Filter pills and search */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 my-6">
                <div className="flex flex-wrap gap-2">
                  {["All", ...STYLE_CATEGORIES].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedStyleCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                        selectedStyleCategory === cat
                          ? "bg-[#66513e] text-white shadow-xs"
                          : "bg-[#f6f4ef] border border-[#ded9d0] text-[#66513e] hover:bg-[#ece5dc]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Search hair styles or stylists..."
                  value={styleSearch}
                  onChange={(e) => setStyleSearch(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] placeholder-[#a8a196] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition w-full md:w-64"
                />
              </div>

              {loadingHairStyles && (
                <p className="py-12 text-center font-serif text-[#66513e]">
                  Loading haircut styles...
                </p>
              )}

              {!loadingHairStyles && filteredStyles.length === 0 && (
                <div className="py-16 text-center">
                  <span className="text-4xl block mb-2">💈</span>
                  <h3 className="font-serif text-xl font-bold text-[#24231f]">No Haircut Styles Found</h3>
                  <p className="text-sm text-[#8a847a] mt-1 mb-4">Add your first cutting style or reset your search filters.</p>
                  <button
                    onClick={() => {
                      setSelectedStyleCategory("All");
                      setStyleSearch("");
                      setShowAddStyleModal(true);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#66513e] hover:bg-[#4d3b2d] transition"
                  >
                    Add Cutting Style Now
                  </button>
                </div>
              )}

              {!loadingHairStyles && filteredStyles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
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
                        className="bg-[#faf8f5] border border-[#e7e0d5] rounded-3xl overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow relative group"
                      >
                        <div>
                          {/* Visual Banner */}
                          <div
                            className="bg-[#f0ebe1] border-b border-[#e7e0d5] flex items-center justify-center relative min-h-[180px] overflow-hidden cursor-zoom-in"
                            onClick={() => openFullscreen(style, 0)}
                            title="Click to view full screen"
                          >
                            <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-white/90 backdrop-blur-xs border border-[#ded9d0] text-[#66513e]">
                              {style.category}
                            </span>

                            {styleImgs.length > 0 ? (
                              <div className="w-full h-48 relative overflow-hidden">
                                <img
                                  src={styleImgs[0]}
                                  alt={style.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="bg-black/75 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                                    <span>🔍</span> Click for Full Screen
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="text-5xl select-none py-6">{style.icon || "✂️"}</div>
                            )}

                            <span className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#66513e] text-white shadow-xs">
                              Cycle: {style.cycle}
                            </span>
                          </div>

                          {/* 2-3 Angle Thumbnails Strip */}
                          {styleImgs.length > 1 && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-[#ded9d0]">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a7057]">
                                {styleImgs.length} Angles:
                              </span>
                              <div className="flex items-center gap-2 flex-1">
                                {styleImgs.map((img, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => openFullscreen(style, idx)}
                                    className="w-8 h-8 rounded-lg overflow-hidden border border-[#ded9d0] hover:border-[#66513e] transition hover:scale-110 flex-shrink-0 cursor-zoom-in"
                                    title={`Angle ${idx + 1} - click for full screen`}
                                  >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                  </button>
                                ))}
                              </div>
                              <span className="text-[10px] text-[#66513e] font-semibold">🔍 Full Screen</span>
                            </div>
                          )}

                          <div className="p-6">
                            <h3 className="font-serif text-xl font-bold text-[#24231f] mb-1">
                              {style.title}
                            </h3>

                            {style.masterProfile && (
                              <p className="text-xs font-semibold text-[#8a7057] mb-3 flex items-center gap-1.5">
                                <span>⭐</span>
                                <span>Stylist Profile: <strong className="text-[#392918]">{style.masterProfile}</strong></span>
                              </p>
                            )}

                            <p className="text-xs text-[#6a665f] leading-relaxed mb-4 line-clamp-3">
                              {style.description || "Precision haircutting and grooming design tailored for modern aesthetics."}
                            </p>

                            <div className="space-y-1.5 pt-3 border-t border-[#ded9d0] text-xs">
                              <div className="flex justify-between">
                                <span className="text-[#8a847a]">Ideal Hair:</span>
                                <span className="font-semibold text-[#24231f]">{style.hairType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[#8a847a]">Face Shape:</span>
                                <span className="font-semibold text-[#24231f]">{style.faceShape}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[#8a847a]">Product:</span>
                                <span className="font-semibold text-[#24231f] truncate max-w-[150px]">{style.product}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-white border-t border-[#ded9d0] flex items-center justify-between">
                          <span className="text-[11px] text-[#8a847a]">
                            Updated: {formatDate(style.updatedAt || style.createdAt)}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditStyle(style)}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#66513e] hover:bg-[#e9e3d8] bg-[#f6f4ef] border border-[#ded9d0] transition flex items-center gap-1"
                            >
                              <span>✏️</span>
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setStyleToDelete(style)}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-800 border border-red-200 transition"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: APPOINTMENT REQUESTS & BOOKINGS                                    */}
        {/* ========================================================================= */}
        {activeTab === "appointments" && (
          <div>
            {/* Stat Cards for Appointments */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <article
                onClick={() => setAppointmentFilter("all")}
                className={`bg-white border p-6 rounded-3xl shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between ${
                  appointmentFilter === "all" ? "border-[#66513e] ring-2 ring-[#66513e]/20" : "border-[#e7e0d5]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#8a847a]">
                    Total Bookings
                  </p>
                  <span className="text-xl">📅</span>
                </div>
                <h3 className="font-serif text-3xl font-bold text-[#24231f]">
                  {appointmentStats.total || appointments.length}
                </h3>
                <p className="text-xs text-[#8a7057] mt-1 font-medium">
                  All customer requests & appointments
                </p>
              </article>

              <article
                onClick={() => setAppointmentFilter("pending")}
                className={`bg-white border p-6 rounded-3xl shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between ${
                  appointmentFilter === "pending"
                    ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20"
                    : "border-[#e7e0d5]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    Pending Requests
                  </p>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                </div>
                <h3 className="font-serif text-3xl font-bold text-amber-900">
                  {appointmentStats.pending || 0}
                </h3>
                <p className="text-xs text-amber-700 mt-1 font-medium">
                  {appointmentStats.pending > 0
                    ? "Requires salon acceptance"
                    : "No pending requests"}
                </p>
              </article>

              <article
                onClick={() => setAppointmentFilter("accepted")}
                className={`bg-white border p-6 rounded-3xl shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between ${
                  appointmentFilter === "accepted"
                    ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20"
                    : "border-[#e7e0d5]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Accepted & Confirmed
                  </p>
                  <span className="text-xl">✓</span>
                </div>
                <h3 className="font-serif text-3xl font-bold text-emerald-800">
                  {appointmentStats.accepted || 0}
                </h3>
                <p className="text-xs text-emerald-600 mt-1 font-medium">
                  Ready for client salon visits
                </p>
              </article>

              <article
                onClick={() => setAppointmentFilter("completed")}
                className={`bg-white border p-6 rounded-3xl shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between ${
                  appointmentFilter === "completed"
                    ? "border-[#66513e] ring-2 ring-[#66513e]/20"
                    : "border-[#e7e0d5]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#8a847a]">
                    Completed Visits
                  </p>
                  <span className="text-xl">✂️</span>
                </div>
                <h3 className="font-serif text-3xl font-bold text-[#24231f]">
                  {appointmentStats.completed || 0}
                </h3>
                <p className="text-xs text-[#8a7057] mt-1 font-medium">
                  Finished haircut sessions
                </p>
              </article>
            </section>

            {/* Filter and Search Bar */}
            <section className="bg-white border border-[#e7e0d5] rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#f0ebe1]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#8a7057]">
                    APPOINTMENT MANAGEMENT
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#24231f] mt-1">
                    Customer Appointment Requests
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={loadAppointments}
                    disabled={loadingAppointments}
                    className="px-4 py-2.5 rounded-xl border border-[#ded9d0] hover:bg-[#f6f4ef] text-xs font-bold text-[#66513e] transition flex items-center gap-1.5"
                    title="Refresh appointment list"
                  >
                    <span>↻</span>
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Status Filter Pills & Search */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 my-6">
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: "all", label: "All Requests", count: appointments.length },
                    { id: "pending", label: "Pending", count: appointmentStats.pending, highlight: true },
                    { id: "accepted", label: "Accepted", count: appointmentStats.accepted },
                    { id: "completed", label: "Completed", count: appointmentStats.completed },
                    { id: "declined", label: "Declined", count: appointmentStats.declined },
                  ].map((tab) => {
                    const isCurrent = appointmentFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setAppointmentFilter(tab.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                          isCurrent
                            ? "bg-[#66513e] text-white shadow-xs"
                            : tab.highlight && tab.count > 0
                            ? "bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200"
                            : "bg-[#f6f4ef] text-[#66513e] hover:bg-[#eae4d9] border border-[#e7e0d5]"
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                            isCurrent
                              ? "bg-white/20 text-white"
                              : "bg-white text-[#66513e] border border-[#ded9d0]"
                          }`}
                        >
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="w-full lg:w-80">
                  <input
                    type="text"
                    value={appointmentSearch}
                    onChange={(e) => setAppointmentSearch(e.target.value)}
                    placeholder="Search client, service, barber..."
                    className="w-full p-2.5 bg-[#faf8f5] border border-[#ded9d0] rounded-xl text-xs text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#66513e]"
                  />
                </div>
              </div>

              {/* Appointments List */}
              {loadingAppointments ? (
                <div className="py-16 text-center text-sm text-[#8a847a]">
                  Loading appointment requests...
                </div>
              ) : filteredAppointments.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[#f0ebe1] text-[#66513e] flex items-center justify-center text-2xl">
                    📅
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#24231f]">
                    No appointments match your filter
                  </h3>
                  <p className="text-xs text-[#8a847a]">
                    Try switching filters or clearing your search.
                  </p>
                  {appointmentFilter !== "all" && (
                    <button
                      onClick={() => {
                        setAppointmentFilter("all");
                        setAppointmentSearch("");
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#66513e] text-white hover:bg-[#524131] transition"
                    >
                      Show All Appointments
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAppointments.map((appt) => {
                    const isPending = appt.status === "pending";
                    const isAccepted = appt.status === "accepted";
                    const isCompleted = appt.status === "completed";
                    const isDeclined = appt.status === "declined";
                    const isCancelled = appt.status === "cancelled";
                    const isLoadingThis = Boolean(actionLoadingAppt[appt._id]);

                    return (
                      <article
                        key={appt._id}
                        className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                          isPending
                            ? "bg-amber-50/40 border-amber-300 shadow-xs ring-1 ring-amber-400/30"
                            : isAccepted
                            ? "bg-emerald-50/20 border-emerald-300 shadow-xs"
                            : "bg-[#faf8f5] border-[#e7e0d5] hover:border-[#ded9d0]"
                        }`}
                      >
                        {/* Top Meta Bar: Client info + Date/Time + Status Badge */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#ded9d0]/60">
                          {/* Client Info */}
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-[#66513e] text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-xs">
                              {appt.userName?.[0]?.toUpperCase() || "C"}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-serif text-lg font-bold text-[#24231f]">
                                  {appt.userName}
                                </h4>
                                {appt.userPhone && (
                                  <span className="text-xs font-mono font-medium text-[#66513e] bg-white px-2 py-0.5 rounded-md border border-[#ded9d0]">
                                    📞 {appt.userPhone}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#6a665f]">{appt.userEmail}</p>
                            </div>
                          </div>

                          {/* Date & Time Slot + Status */}
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="bg-white border border-[#ded9d0] px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#24231f] flex items-center gap-2 shadow-2xs">
                              <span>📅</span>
                              <span>
                                {new Date(appt.appointmentDate).toLocaleDateString("en-IN", {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                              <span className="text-[#8a847a]">•</span>
                              <span className="font-bold text-[#66513e]">⏰ {appt.timeSlot}</span>
                            </div>

                            {/* Status Badge */}
                            {isPending && (
                              <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5 shadow-2xs">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                <span>PENDING ACCEPTANCE</span>
                              </span>
                            )}

                            {isAccepted && (
                              <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
                                <span>✓</span>
                                <span>ACCEPTED & CONFIRMED</span>
                              </span>
                            )}

                            {isCompleted && (
                              <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-300">
                                COMPLETED
                              </span>
                            )}

                            {isDeclined && (
                              <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                                DECLINED
                              </span>
                            )}

                            {isCancelled && (
                              <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-zinc-100 text-zinc-600 border border-zinc-200">
                                CANCELLED BY USER
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Middle Details: Service / Haircut Style & Master Stylist */}
                        <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Service Details */}
                          <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#ded9d0]/70">
                            {appt.hairStyleImage ? (
                              <img
                                src={appt.hairStyleImage}
                                alt={appt.service}
                                className="w-14 h-14 rounded-xl object-cover border border-[#ded9d0] flex-shrink-0 cursor-pointer hover:opacity-90 transition"
                                onClick={() =>
                                  openFullscreen(
                                    {
                                      title: appt.service,
                                      category: "Client Request",
                                      masterProfile: appt.masterName,
                                      images: [appt.hairStyleImage],
                                    },
                                    0
                                  )
                                }
                                title="Click to view full screen"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-xl bg-[#f0ebe1] text-[#66513e] flex items-center justify-center text-xl flex-shrink-0 border border-[#ded9d0]">
                                ✂️
                              </div>
                            )}
                            <div>
                              <span className="text-[10px] uppercase font-bold text-[#8a7057] block">
                                Requested Service
                              </span>
                              <h5 className="font-serif font-bold text-[#24231f] text-base">
                                {appt.service}
                              </h5>
                              {appt.servicePrice && (
                                <p className="text-xs font-bold text-[#66513e]">
                                  Price: {appt.servicePrice}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Master Stylist Details */}
                          <div className="bg-white p-3.5 rounded-xl border border-[#ded9d0]/70 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-[#8a7057] block">
                                Preferred Master Barber
                              </span>
                              <p className="font-bold text-[#24231f] text-sm">
                                {appt.masterName || "Any Available Master Barber"}
                              </p>
                            </div>
                            {appt.user?.lastCuttingDate && (
                              <p className="text-[11px] text-[#8a847a] mt-1">
                                Client last cut:{" "}
                                <strong className="text-[#66513e]">
                                  {new Date(appt.user.lastCuttingDate).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </strong>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Customer Notes / Admin Feedback */}
                        {(appt.notes || appt.adminNotes) && (
                          <div className="mb-4 space-y-2">
                            {appt.notes && (
                              <div className="text-xs bg-white p-3 rounded-xl border border-[#ded9d0]/80">
                                <span className="font-bold text-[#66513e]">Client Instructions: </span>
                                <span className="text-[#392918] italic">"{appt.notes}"</span>
                              </div>
                            )}
                            {appt.adminNotes && (
                              <div className="text-xs bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-950">
                                <span className="font-bold">Salon Response: </span>
                                <span>{appt.adminNotes}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Actions Toolbar */}
                        <div className="pt-3 border-t border-[#ded9d0]/60 flex flex-wrap items-center justify-between gap-3">
                          <div className="text-[11px] text-[#8a847a]">
                            Requested on{" "}
                            {new Date(appt.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>

                          <div className="flex flex-wrap items-center gap-2.5">
                            {/* ACCEPT BUTTON: ONE-CLICK ACCEPT FOR PENDING */}
                            {isPending && (
                              <button
                                type="button"
                                disabled={isLoadingThis}
                                onClick={() => handleAcceptAppointment(appt, true)}
                                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm transition flex items-center gap-2 disabled:opacity-50"
                              >
                                {isLoadingThis ? (
                                  <span>Accepting...</span>
                                ) : (
                                  <>
                                    <span className="text-sm">✓</span>
                                    <span>Accept Appointment</span>
                                  </>
                                )}
                              </button>
                            )}

                            {/* DECLINE BUTTON */}
                            {isPending && (
                              <button
                                type="button"
                                disabled={isLoadingThis}
                                onClick={() => {
                                  setAppointmentToDecline(appt);
                                  setDeclineReason("");
                                }}
                                className="px-4 py-2.5 rounded-xl font-bold text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
                              >
                                ✕ Decline
                              </button>
                            )}

                            {/* MARK COMPLETED BUTTON FOR ACCEPTED */}
                            {isAccepted && (
                              <>
                                <button
                                  type="button"
                                  disabled={isLoadingThis}
                                  onClick={() => handleCompleteAppointment(appt)}
                                  className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-[#66513e] hover:bg-[#524131] transition shadow-xs flex items-center gap-1.5"
                                >
                                  <span>✂️</span>
                                  <span>Mark as Completed</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAppointmentToDecline(appt);
                                    setDeclineReason("Cancelled by salon request.");
                                  }}
                                  className="px-3 py-2 rounded-xl font-bold text-xs text-stone-600 hover:text-stone-900 border border-[#ded9d0] hover:bg-[#f6f4ef] transition"
                                >
                                  Cancel Booking
                                </button>
                              </>
                            )}

                            {/* DELETE APPOINTMENT */}
                            <button
                              type="button"
                              onClick={() => setAppointmentToDelete(appt)}
                              className="px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-800 border border-red-200 transition"
                              title="Delete appointment record"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SALON SERVICES & AMOUNT RATE CARD                                  */}
        {/* ========================================================================= */}
        {activeTab === "pricing" && (
          <div>
            {/* Stat Cards for Services & Amounts */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <article
                onClick={() => setServiceCategoryFilter("All")}
                className={`bg-white border p-6 rounded-3xl shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between ${
                  serviceCategoryFilter === "All"
                    ? "border-[#66513e] ring-2 ring-[#66513e]/20"
                    : "border-[#e7e0d5]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#8a847a]">
                    Total Services
                  </p>
                  <span className="text-xl">💰</span>
                </div>
                <h3 className="font-serif text-3xl font-bold text-[#24231f]">
                  {adminServices.length}
                </h3>
                <p className="text-xs text-[#8a7057] mt-1 font-medium">
                  Active salon rate card items
                </p>
              </article>

              <article
                onClick={() => setServiceCategoryFilter("Hair Cutting")}
                className={`bg-white border p-6 rounded-3xl shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between ${
                  serviceCategoryFilter === "Hair Cutting"
                    ? "border-[#66513e] ring-2 ring-[#66513e]/20 bg-amber-50/10"
                    : "border-[#e7e0d5]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#8a847a]">
                    Hair Cutting
                  </p>
                  <span className="text-xl">✂️</span>
                </div>
                <h3 className="font-serif text-3xl font-bold text-[#24231f]">
                  {adminServices.filter((s) => s.category === "Hair Cutting").length}
                </h3>
                <p className="text-xs text-[#8a7057] mt-1 font-medium">
                  Haircuts, fades & trims
                </p>
              </article>

              <article
                onClick={() => setServiceCategoryFilter("Shaving & Beard")}
                className={`bg-white border p-6 rounded-3xl shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between ${
                  serviceCategoryFilter === "Shaving & Beard"
                    ? "border-[#66513e] ring-2 ring-[#66513e]/20 bg-amber-50/10"
                    : "border-[#e7e0d5]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#8a847a]">
                    Shaving & Beard
                  </p>
                  <span className="text-xl">🪒</span>
                </div>
                <h3 className="font-serif text-3xl font-bold text-[#24231f]">
                  {adminServices.filter((s) => s.category === "Shaving & Beard").length}
                </h3>
                <p className="text-xs text-[#8a7057] mt-1 font-medium">
                  Razor shaves, beard fades & lines
                </p>
              </article>

              <article
                onClick={() => setServiceCategoryFilter("Super Saver Combos")}
                className={`bg-white border p-6 rounded-3xl shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between ${
                  serviceCategoryFilter === "Super Saver Combos"
                    ? "border-emerald-600 ring-2 ring-emerald-600/20 bg-emerald-50/20"
                    : "border-[#e7e0d5]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Saver Combos
                  </p>
                  <span className="text-xl">🎁</span>
                </div>
                <h3 className="font-serif text-3xl font-bold text-emerald-800">
                  {adminServices.filter((s) => s.category === "Super Saver Combos").length}
                </h3>
                <p className="text-xs text-emerald-600 mt-1 font-medium">
                  Cutting + Shaving packages
                </p>
              </article>
            </section>

            {/* Filter and Services Section */}
            <section className="bg-white border border-[#e7e0d5] rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f0ebe1]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#8a7057]">
                    RATE CARD & MENU MANAGEMENT
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#24231f] mt-1">
                    Salon Services & Amount Rates
                  </h2>
                  <p className="text-sm text-[#6a665f] mt-1">
                    Add new services, update pricing amounts, and manage client rate card.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(true)}
                  className="px-5 py-3 rounded-2xl font-bold text-sm text-white bg-[#66513e] hover:bg-[#4d3b2d] shadow-sm hover:shadow-md transition flex items-center gap-2 self-start sm:self-auto"
                >
                  <span>+</span>
                  <span>Add New Service / Price</span>
                </button>
              </div>

              {/* Category Pills & Search */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 my-6">
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    "All",
                    "Hair Cutting",
                    "Shaving & Beard",
                    "Head Massage & Spa",
                    "Face Care & D-Tan",
                    "Hair & Beard Color",
                    "Super Saver Combos",
                  ].map((cat) => {
                    const isSelected = serviceCategoryFilter === cat;
                    const count =
                      cat === "All"
                        ? adminServices.length
                        : adminServices.filter((s) => s.category === cat).length;

                    return (
                      <button
                        key={cat}
                        onClick={() => setServiceCategoryFilter(cat)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-[#66513e] text-white shadow-xs"
                            : "bg-[#f6f4ef] text-[#66513e] hover:bg-[#eae4d9] border border-[#e7e0d5]"
                        }`}
                      >
                        <span>{cat}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-white text-[#66513e] border border-[#ded9d0]"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="w-full lg:w-72">
                  <input
                    type="text"
                    value={serviceSearchTerm}
                    onChange={(e) => setServiceSearchTerm(e.target.value)}
                    placeholder="Search service name, price..."
                    className="w-full p-2.5 bg-[#faf8f5] border border-[#ded9d0] rounded-xl text-xs text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#66513e]"
                  />
                </div>
              </div>

              {/* Services Table */}
              {loadingAdminServices ? (
                <div className="py-16 text-center text-sm text-[#8a847a]">
                  Loading salon services & amounts...
                </div>
              ) : filteredAdminServices.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[#f0ebe1] text-[#66513e] flex items-center justify-center text-2xl">
                    ✂️
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#24231f]">
                    No services found
                  </h3>
                  <p className="text-xs text-[#8a847a]">
                    Try switching category filters or search terms.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#ded9d0] text-[#8a7057] uppercase font-bold text-[11px]">
                        <th className="py-3 px-4">Service</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Duration</th>
                        <th className="py-3 px-4 text-right">Amount (₹)</th>
                        <th className="py-3 px-4">Badges</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0ebe1]">
                      {filteredAdminServices.map((svc) => (
                        <tr key={svc._id} className="hover:bg-[#faf8f5] transition">
                          <td className="py-3.5 px-4 font-bold text-[#24231f]">
                            <div className="flex items-center gap-2.5">
                              <span className="text-lg">{svc.icon || "✂️"}</span>
                              <div>
                                <p className="font-serif font-bold text-sm text-[#24231f]">
                                  {svc.title}
                                </p>
                                {svc.description && (
                                  <p className="text-[11px] text-[#6a665f] line-clamp-1 max-w-sm">
                                    {svc.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-[#66513e] font-semibold">
                            {svc.category}
                          </td>
                          <td className="py-3.5 px-4 text-[#8a847a]">
                            {svc.duration || "20 mins"}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span className="font-serif text-base font-bold text-[#24231f]">
                              ₹{svc.price}
                            </span>
                            {svc.originalPrice && (
                              <span className="text-[11px] text-[#8a847a] line-through ml-1.5">
                                ₹{svc.originalPrice}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {svc.popularBadge && (
                                <span className="text-[9px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                                  {svc.popularBadge}
                                </span>
                              )}
                              {svc.savings && (
                                <span className="text-[9px] font-black px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-full border border-emerald-300">
                                  {svc.savings}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingService(svc)}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#66513e] hover:bg-[#f6f4ef] border border-[#ded9d0] transition"
                                title="Edit amount & details"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => setServiceToDelete(svc)}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition"
                                title="Delete service"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW MASTER                                                     */}
      {/* ========================================================================= */}
      {showAddMasterModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowAddMasterModal(false)}
        >
          <div
            className="bg-white rounded-3xl border border-[#ded9d0] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#8a7057] mb-1">
                  NEW SALON ARTISAN
                </p>
                <h2 className="font-serif text-2xl font-bold text-[#24231f]">
                  Add Master Stylist
                </h2>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg border border-[#ded9d0] text-xs font-semibold text-[#6a665f] hover:bg-[#f6f4ef]"
                onClick={() => setShowAddMasterModal(false)}
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateMaster}>
              {/* Avatar Selector */}
              <label className="block text-xs font-semibold text-[#24231f] mb-1.5">
                Choose Avatar / Icon
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {AVATAR_OPTIONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewMaster({ ...newMaster, avatar: icon })}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition border ${
                      newMaster.avatar === icon
                        ? "bg-[#66513e] border-[#4d3b2d] shadow-sm scale-105"
                        : "bg-[#faf8f5] border-[#ded9d0] hover:bg-[#f0ebe1]"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>

              {/* Master Name */}
              <label htmlFor="masterName" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                Master Full Name *
              </label>
              <input
                id="masterName"
                type="text"
                placeholder="e.g. Vikram Mehta"
                value={newMaster.name}
                onChange={(e) => setNewMaster({ ...newMaster, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition mb-4"
              />

              {/* Specialty */}
              <label htmlFor="masterSpecialty" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                Specialty / Title *
              </label>
              <input
                id="masterSpecialty"
                type="text"
                placeholder="e.g. Head Barber, Scissor Architect, Fade Specialist"
                value={newMaster.specialty}
                onChange={(e) => setNewMaster({ ...newMaster, specialty: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition mb-4"
              />

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label htmlFor="masterExperience" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                    Experience
                  </label>
                  <input
                    id="masterExperience"
                    type="text"
                    placeholder="e.g. 8+ Years"
                    value={newMaster.experience}
                    onChange={(e) => setNewMaster({ ...newMaster, experience: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition"
                  />
                </div>

                <div>
                  <label htmlFor="masterPhone" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                    Phone / Contact (optional)
                  </label>
                  <input
                    id="masterPhone"
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    value={newMaster.phone}
                    onChange={(e) => setNewMaster({ ...newMaster, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition"
                  />
                </div>
              </div>

              {/* Bio */}
              <label htmlFor="masterBio" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                Bio & Styling Techniques
              </label>
              <textarea
                id="masterBio"
                rows={3}
                placeholder="Brief summary of their haircut styling craft, certifications, and experience..."
                value={newMaster.bio}
                onChange={(e) => setNewMaster({ ...newMaster, bio: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition mb-6"
              />

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ded9d0]">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-sm font-semibold border border-[#ded9d0] text-[#66513e] hover:bg-[#f6f4ef]"
                  onClick={() => setShowAddMasterModal(false)}
                >
                  Cancel
                </button>
                <button
                  disabled={addingMaster}
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#66513e] hover:bg-[#4d3b2d] text-white transition shadow-sm disabled:opacity-60"
                >
                  {addingMaster ? "Adding..." : "Add Master"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT MASTER DETAILS                                                */}
      {/* ========================================================================= */}
      {editingMaster && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditingMaster(null)}
        >
          <div
            className="bg-white rounded-3xl border border-[#ded9d0] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#8a7057] mb-1">
                  UPDATE SALON ARTISAN
                </p>
                <h2 className="font-serif text-2xl font-bold text-[#24231f]">
                  Edit Master Details
                </h2>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg border border-[#ded9d0] text-xs font-semibold text-[#6a665f] hover:bg-[#f6f4ef]"
                onClick={() => setEditingMaster(null)}
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleUpdateMaster}>
              {/* Avatar Selector */}
              <label className="block text-xs font-semibold text-[#24231f] mb-1.5">
                Choose Avatar / Icon
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {AVATAR_OPTIONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setEditingMaster({ ...editingMaster, avatar: icon })}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition border ${
                      editingMaster.avatar === icon
                        ? "bg-[#66513e] border-[#4d3b2d] shadow-sm scale-105"
                        : "bg-[#faf8f5] border-[#ded9d0] hover:bg-[#f0ebe1]"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>

              {/* Master Name */}
              <label htmlFor="editMasterName" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                Master Full Name *
              </label>
              <input
                id="editMasterName"
                type="text"
                value={editingMaster.name}
                onChange={(e) => setEditingMaster({ ...editingMaster, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition mb-4"
              />

              {/* Specialty */}
              <label htmlFor="editMasterSpecialty" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                Specialty / Title *
              </label>
              <input
                id="editMasterSpecialty"
                type="text"
                value={editingMaster.specialty}
                onChange={(e) => setEditingMaster({ ...editingMaster, specialty: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition mb-4"
              />

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label htmlFor="editMasterExperience" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                    Experience
                  </label>
                  <input
                    id="editMasterExperience"
                    type="text"
                    value={editingMaster.experience || ""}
                    onChange={(e) => setEditingMaster({ ...editingMaster, experience: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition"
                  />
                </div>

                <div>
                  <label htmlFor="editMasterStatus" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                    Status
                  </label>
                  <select
                    id="editMasterStatus"
                    value={editingMaster.status || "active"}
                    onChange={(e) => setEditingMaster({ ...editingMaster, status: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition"
                  >
                    <option value="active">Active</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
              </div>

              {/* Contact Phone */}
              <label htmlFor="editMasterPhone" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                Phone / Contact (optional)
              </label>
              <input
                id="editMasterPhone"
                type="text"
                value={editingMaster.phone || ""}
                onChange={(e) => setEditingMaster({ ...editingMaster, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition mb-4"
              />

              {/* Bio */}
              <label htmlFor="editMasterBio" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                Bio & Styling Techniques
              </label>
              <textarea
                id="editMasterBio"
                rows={3}
                value={editingMaster.bio || ""}
                onChange={(e) => setEditingMaster({ ...editingMaster, bio: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition mb-6"
              />

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ded9d0]">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-sm font-semibold border border-[#ded9d0] text-[#66513e] hover:bg-[#f6f4ef]"
                  onClick={() => setEditingMaster(null)}
                >
                  Cancel
                </button>
                <button
                  disabled={updatingMaster}
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#66513e] hover:bg-[#4d3b2d] text-white transition shadow-sm disabled:opacity-60"
                >
                  {updatingMaster ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW HAIRCUT STYLE (WITH 2-3 PROFILE PICTURES)                  */}
      {/* ========================================================================= */}
      {showAddStyleModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowAddStyleModal(false)}
        >
          <div
            className="bg-white rounded-3xl border border-[#ded9d0] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#8a7057] mb-1">
                  NEW LOOKBOOK ENTRY
                </p>
                <h2 className="font-serif text-2xl font-bold text-[#24231f]">
                  Add Haircut Style & Profile Photos
                </h2>
                <p className="text-xs text-[#8a847a]">Provide 2-3 photo angles for customers to view in full screen.</p>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg border border-[#ded9d0] text-xs font-semibold text-[#6a665f] hover:bg-[#f6f4ef]"
                onClick={() => setShowAddStyleModal(false)}
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateStyle}>
              {/* Icon Selector */}
              <label className="block text-xs font-semibold text-[#24231f] mb-1.5">
                Style Icon / Badge
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {STYLE_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewStyle({ ...newStyle, icon })}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition border ${
                      newStyle.icon === icon
                        ? "bg-[#66513e] border-[#4d3b2d] shadow-sm scale-105"
                        : "bg-[#faf8f5] border-[#ded9d0] hover:bg-[#f0ebe1]"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>

              {/* Title */}
              <label htmlFor="styleTitle" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                Haircut Style Name *
              </label>
              <input
                id="styleTitle"
                type="text"
                placeholder="e.g. Modern Textured Taper Fade"
                value={newStyle.title}
                onChange={(e) => setNewStyle({ ...newStyle, title: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition mb-4"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="styleCategory" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                    Category *
                  </label>
                  <select
                    id="styleCategory"
                    value={newStyle.category}
                    onChange={(e) => setNewStyle({ ...newStyle, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition"
                  >
                    {STYLE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="styleMasterProfile" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                    Assigned Master Profile
                  </label>
                  <input
                    id="styleMasterProfile"
                    type="text"
                    list="mastersList"
                    placeholder="e.g. Vikram Mehta (Head Barber)"
                    value={newStyle.masterProfile}
                    onChange={(e) => setNewStyle({ ...newStyle, masterProfile: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition"
                  />
                  <datalist id="mastersList">
                    {masters.map((m) => (
                      <option key={m._id} value={`${m.name} (${m.specialty})`} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* 2-3 Profile Pictures Section */}
              <div className="p-4 bg-[#faf8f5] rounded-2xl border border-[#e7e0d5] mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#66513e] mb-1">
                  📸 Profile Pictures (2-3 Angles for Full Screen Display)
                </p>
                <p className="text-[11px] text-[#8a7057] mb-3">
                  Enter image URLs for Front, Side, and Back/Detail angles.
                </p>

                {[0, 1, 2].map((idx) => (
                  <div key={idx} className="flex items-center gap-3 mb-2.5">
                    <span className="text-xs font-bold text-[#8a7057] w-18">
                      {idx === 0 ? "Angle 1 (Main):" : idx === 1 ? "Angle 2 (Side):" : "Angle 3 (Back):"}
                    </span>
                    <input
                      type="url"
                      placeholder={`https://... photo URL ${idx + 1}`}
                      value={newStyle.images[idx] || ""}
                      onChange={(e) => {
                        const nextImgs = [...newStyle.images];
                        nextImgs[idx] = e.target.value;
                        setNewStyle({ ...newStyle, images: nextImgs });
                      }}
                      className="flex-1 px-3 py-2 rounded-xl border border-[#ded9d0] bg-white text-xs text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a]"
                    />
                    {newStyle.images[idx] && (
                      <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#ded9d0] flex-shrink-0 bg-white">
                        <img
                          src={newStyle.images[idx]}
                          alt="preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="styleCycle" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                    Maintenance Cycle
                  </label>
                  <input
                    id="styleCycle"
                    type="text"
                    placeholder="e.g. 3 - 4 Weeks"
                    value={newStyle.cycle}
                    onChange={(e) => setNewStyle({ ...newStyle, cycle: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition"
                  />
                </div>

                <div>
                  <label htmlFor="styleProduct" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                    Recommended Product
                  </label>
                  <input
                    id="styleProduct"
                    type="text"
                    placeholder="e.g. Matte Clay / Sea Salt Spray"
                    value={newStyle.product}
                    onChange={(e) => setNewStyle({ ...newStyle, product: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="styleHairType" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                    Ideal Hair Type
                  </label>
                  <input
                    id="styleHairType"
                    type="text"
                    placeholder="e.g. Straight, Wavy, Thick"
                    value={newStyle.hairType}
                    onChange={(e) => setNewStyle({ ...newStyle, hairType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition"
                  />
                </div>

                <div>
                  <label htmlFor="styleFaceShape" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                    Ideal Face Shapes
                  </label>
                  <input
                    id="styleFaceShape"
                    type="text"
                    placeholder="e.g. Oval, Square, Round"
                    value={newStyle.faceShape}
                    onChange={(e) => setNewStyle({ ...newStyle, faceShape: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition"
                  />
                </div>
              </div>

              {/* Description */}
              <label htmlFor="styleDesc" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                Style Description
              </label>
              <textarea
                id="styleDesc"
                rows={2}
                placeholder="High contrast modern fade tapering into scissor-cut natural textured volume..."
                value={newStyle.description}
                onChange={(e) => setNewStyle({ ...newStyle, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition mb-4"
              />

              {/* Styling Tips */}
              <label htmlFor="styleTips" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                Barber's Styling Advice
              </label>
              <textarea
                id="styleTips"
                rows={2}
                placeholder="Towel dry hair, apply a dime-sized amount of matte paste, and pinch forward for movement..."
                value={newStyle.stylingTips}
                onChange={(e) => setNewStyle({ ...newStyle, stylingTips: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition mb-6"
              />

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ded9d0]">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-sm font-semibold border border-[#ded9d0] text-[#66513e] hover:bg-[#f6f4ef]"
                  onClick={() => setShowAddStyleModal(false)}
                >
                  Cancel
                </button>
                <button
                  disabled={addingStyle}
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#66513e] hover:bg-[#4d3b2d] text-white transition shadow-sm disabled:opacity-60"
                >
                  {addingStyle ? "Adding Style..." : "Add Cutting Style"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT HAIRCUT STYLE (WITH 2-3 PROFILE PICTURES)                     */}
      {/* ========================================================================= */}
      {editingStyle && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditingStyle(null)}
        >
          <div
            className="bg-white rounded-3xl border border-[#ded9d0] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#8a7057] mb-1">
                  UPDATE CUTTING PROFILE
                </p>
                <h2 className="font-serif text-2xl font-bold text-[#24231f]">
                  Edit Haircut Style & Photos
                </h2>
                <p className="text-xs text-[#8a847a]">Update style specs and manage 2-3 profile photo angles.</p>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg border border-[#ded9d0] text-xs font-semibold text-[#6a665f] hover:bg-[#f6f4ef]"
                onClick={() => setEditingStyle(null)}
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleUpdateStyle}>
              {/* Icon Selector */}
              <label className="block text-xs font-semibold text-[#24231f] mb-1.5">
                Style Icon / Badge
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {STYLE_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setEditingStyle({ ...editingStyle, icon })}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition border ${
                      editingStyle.icon === icon
                        ? "bg-[#66513e] border-[#4d3b2d] shadow-sm scale-105"
                        : "bg-[#faf8f5] border-[#ded9d0] hover:bg-[#f0ebe1]"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>

              {/* Title */}
              <label htmlFor="editStyleTitle" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                Haircut Style Name *
              </label>
              <input
                id="editStyleTitle"
                type="text"
                value={editingStyle.title}
                onChange={(e) => setEditingStyle({ ...editingStyle, title: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition mb-4"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="editStyleCategory" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                    Category *
                  </label>
                  <select
                    id="editStyleCategory"
                    value={editingStyle.category}
                    onChange={(e) => setEditingStyle({ ...editingStyle, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition"
                  >
                    {STYLE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="editStyleMasterProfile" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                    Assigned Master Profile
                  </label>
                  <input
                    id="editStyleMasterProfile"
                    type="text"
                    list="mastersListEdit"
                    placeholder="e.g. Vikram Mehta (Head Barber)"
                    value={editingStyle.masterProfile || ""}
                    onChange={(e) => setEditingStyle({ ...editingStyle, masterProfile: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition"
                  />
                  <datalist id="mastersListEdit">
                    {masters.map((m) => (
                      <option key={m._id} value={`${m.name} (${m.specialty})`} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* 2-3 Profile Pictures Section */}
              <div className="p-4 bg-[#faf8f5] rounded-2xl border border-[#e7e0d5] mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#66513e] mb-1">
                  📸 Profile Pictures (2-3 Angles for Full Screen Display)
                </p>
                <p className="text-[11px] text-[#8a7057] mb-3">
                  Enter image URLs for Front, Side, and Back/Detail angles.
                </p>

                {[0, 1, 2].map((idx) => (
                  <div key={idx} className="flex items-center gap-3 mb-2.5">
                    <span className="text-xs font-bold text-[#8a7057] w-18">
                      {idx === 0 ? "Angle 1 (Main):" : idx === 1 ? "Angle 2 (Side):" : "Angle 3 (Back):"}
                    </span>
                    <input
                      type="url"
                      placeholder={`https://... photo URL ${idx + 1}`}
                      value={(editingStyle.images && editingStyle.images[idx]) || ""}
                      onChange={(e) => {
                        const nextImgs = [...(editingStyle.images || ["", "", ""])];
                        nextImgs[idx] = e.target.value;
                        setEditingStyle({ ...editingStyle, images: nextImgs });
                      }}
                      className="flex-1 px-3 py-2 rounded-xl border border-[#ded9d0] bg-white text-xs text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a]"
                    />
                    {editingStyle.images && editingStyle.images[idx] && (
                      <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#ded9d0] flex-shrink-0 bg-white">
                        <img
                          src={editingStyle.images[idx]}
                          alt="preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="editStyleCycle" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                    Maintenance Cycle
                  </label>
                  <input
                    id="editStyleCycle"
                    type="text"
                    value={editingStyle.cycle || ""}
                    onChange={(e) => setEditingStyle({ ...editingStyle, cycle: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition"
                  />
                </div>

                <div>
                  <label htmlFor="editStyleProduct" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                    Recommended Product
                  </label>
                  <input
                    id="editStyleProduct"
                    type="text"
                    value={editingStyle.product || ""}
                    onChange={(e) => setEditingStyle({ ...editingStyle, product: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="editStyleHairType" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                    Ideal Hair Type
                  </label>
                  <input
                    id="editStyleHairType"
                    type="text"
                    value={editingStyle.hairType || ""}
                    onChange={(e) => setEditingStyle({ ...editingStyle, hairType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition"
                  />
                </div>

                <div>
                  <label htmlFor="editStyleFaceShape" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                    Ideal Face Shapes
                  </label>
                  <input
                    id="editStyleFaceShape"
                    type="text"
                    value={editingStyle.faceShape || ""}
                    onChange={(e) => setEditingStyle({ ...editingStyle, faceShape: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition"
                  />
                </div>
              </div>

              {/* Description */}
              <label htmlFor="editStyleDesc" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                Style Description
              </label>
              <textarea
                id="editStyleDesc"
                rows={2}
                value={editingStyle.description || ""}
                onChange={(e) => setEditingStyle({ ...editingStyle, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition mb-4"
              />

              {/* Styling Tips */}
              <label htmlFor="editStyleTips" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                Barber's Styling Advice
              </label>
              <textarea
                id="editStyleTips"
                rows={2}
                value={editingStyle.stylingTips || ""}
                onChange={(e) => setEditingStyle({ ...editingStyle, stylingTips: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition mb-6"
              />

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ded9d0]">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-sm font-semibold border border-[#ded9d0] text-[#66513e] hover:bg-[#f6f4ef]"
                  onClick={() => setEditingStyle(null)}
                >
                  Cancel
                </button>
                <button
                  disabled={updatingStyle}
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#66513e] hover:bg-[#4d3b2d] text-white transition shadow-sm disabled:opacity-60"
                >
                  {updatingStyle ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE HAIRCUT STYLE CONFIRMATION                                  */}
      {/* ========================================================================= */}
      {styleToDelete && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setStyleToDelete(null)}
        >
          <div
            className="bg-white rounded-3xl border border-[#ded9d0] max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl mx-auto mb-4">
              🗑️
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#24231f] mb-2">
              Delete Haircut Style?
            </h3>
            <p className="text-sm text-[#6a665f] mb-6">
              Are you sure you want to remove <strong>{styleToDelete.title}</strong> from the styles catalog?
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-[#ded9d0] text-[#66513e] hover:bg-[#f6f4ef]"
                onClick={() => setStyleToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm transition"
                onClick={confirmDeleteStyle}
              >
                Yes, Delete Style
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
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 select-none"
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

      {/* ========================================================================= */}
      {/* MODAL: DELETE MASTER CONFIRMATION                                         */}
      {/* ========================================================================= */}
      {masterToDelete && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setMasterToDelete(null)}
        >
          <div
            className="bg-white rounded-3xl border border-[#ded9d0] max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl mx-auto mb-4">
              🗑️
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#24231f] mb-2">
              Delete Master?
            </h3>
            <p className="text-sm text-[#6a665f] mb-6">
              Are you sure you want to remove <strong>{masterToDelete.name}</strong> ({masterToDelete.specialty}) from the master list? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-[#ded9d0] text-[#66513e] hover:bg-[#f6f4ef]"
                onClick={() => setMasterToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm transition"
                onClick={confirmDeleteMaster}
              >
                Yes, Delete Master
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE CUSTOMER CONFIRMATION                                       */}
      {/* ========================================================================= */}
      {customerToDelete && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setCustomerToDelete(null)}
        >
          <div
            className="bg-white rounded-3xl border border-[#ded9d0] max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl mx-auto mb-4">
              ⚠️
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#24231f] mb-2">
              Delete Customer?
            </h3>
            <p className="text-sm text-[#6a665f] mb-6">
              Are you sure you want to delete customer <strong>{customerToDelete.name}</strong> ({customerToDelete.email})?
              Their haircut history and reminder schedule will be permanently deleted.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-[#ded9d0] text-[#66513e] hover:bg-[#f6f4ef]"
                onClick={() => setCustomerToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm transition"
                onClick={confirmDeleteCustomer}
              >
                Yes, Delete Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CUSTOM EMAIL DISPATCH                                              */}
      {/* ========================================================================= */}
      {modalUser && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setModalUser(null)}
        >
          <div
            className="bg-white rounded-3xl border border-[#ded9d0] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-[#8a7057] mb-1">
              MANUAL EMAIL DISPATCH
            </p>
            <h2 className="font-serif text-2xl font-bold text-[#24231f] mb-1">
              Compose Email
            </h2>
            <p className="text-xs text-[#8a847a] mb-6">
              Recipient: <strong className="text-[#24231f]">{modalUser.name}</strong> ({modalUser.email})
            </p>

            <form onSubmit={handleSendCustomEmail}>
              <label htmlFor="emailSubject" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                Subject
              </label>
              <input
                id="emailSubject"
                type="text"
                value={emailSubject}
                onChange={(event) => setEmailSubject(event.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition mb-4"
              />

              <label htmlFor="emailBody" className="block text-xs font-semibold text-[#24231f] mb-1.5">
                Message
              </label>
              <textarea
                id="emailBody"
                rows={7}
                value={emailBody}
                onChange={(event) => setEmailBody(event.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#ded9d0] bg-white text-sm text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#b9a38a] transition mb-6"
              />

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ded9d0]">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-sm font-semibold border border-[#ded9d0] text-[#66513e] hover:bg-[#f6f4ef]"
                  onClick={() => setModalUser(null)}
                >
                  Cancel
                </button>
                <button
                  disabled={modalSending}
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#66513e] hover:bg-[#4d3b2d] text-white transition shadow-sm disabled:opacity-60"
                >
                  {modalSending ? "Dispatching..." : "Send Email Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DECLINE APPOINTMENT REASON                                         */}
      {/* ========================================================================= */}
      {appointmentToDecline && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setAppointmentToDecline(null)}
        >
          <div
            className="bg-white rounded-3xl border border-[#ded9d0] max-w-md w-full p-6 sm:p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-2xl font-bold text-[#24231f] mb-2">
              Decline Appointment Request
            </h3>
            <p className="text-sm text-[#6a665f] mb-4">
              Decline appointment for <strong className="text-[#24231f]">{appointmentToDecline.userName}</strong> ({appointmentToDecline.service}).
            </p>

            <label className="block text-xs font-bold uppercase tracking-wider text-[#66513e] mb-1.5">
              Reason / Salon Note (Sent to client)
            </label>
            <textarea
              rows={3}
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="e.g. Master stylist unavailable at this slot. Please choose another time."
              className="w-full p-3 bg-[#faf8f5] border border-[#ded9d0] rounded-xl text-xs text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#66513e] mb-4"
            />

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#ded9d0]">
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#ded9d0] text-[#66513e] hover:bg-[#f6f4ef]"
                onClick={() => setAppointmentToDecline(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition"
                onClick={() => handleDeclineAppointment(appointmentToDecline, declineReason)}
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE APPOINTMENT CONFIRMATION                                    */}
      {/* ========================================================================= */}
      {appointmentToDelete && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setAppointmentToDelete(null)}
        >
          <div
            className="bg-white rounded-3xl border border-[#ded9d0] max-w-md w-full p-6 sm:p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-2xl font-bold text-red-700 mb-2">
              Delete Appointment Record?
            </h3>
            <p className="text-sm text-[#4a463f] mb-6 leading-relaxed">
              Are you sure you want to delete the appointment for{" "}
              <strong className="text-[#24231f]">{appointmentToDelete.userName}</strong> (
              {appointmentToDelete.service}) on{" "}
              {new Date(appointmentToDelete.appointmentDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              ? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#ded9d0]">
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#ded9d0] text-[#66513e] hover:bg-[#f6f4ef]"
                onClick={() => setAppointmentToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition"
                onClick={() => handleDeleteAppointment(appointmentToDelete._id)}
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW SERVICE / RATE                                             */}
      {/* ========================================================================= */}
      {showAddServiceModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowAddServiceModal(false)}
        >
          <div
            className="bg-white rounded-3xl border border-[#ded9d0] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#ded9d0] mb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a7057]">
                  RATE CARD CREATION
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#24231f]">
                  Add New Salon Service / Amount
                </h3>
              </div>
              <button
                onClick={() => setShowAddServiceModal(false)}
                className="w-8 h-8 rounded-full bg-[#f6f4ef] text-[#66513e] flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#66513e] uppercase mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={serviceForm.title}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, title: e.target.value })
                  }
                  placeholder="e.g. Classic Hair Cutting, Clean Shave (Saving)"
                  className="w-full p-3 bg-[#faf8f5] border border-[#ded9d0] rounded-xl text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#66513e]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#66513e] uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, category: e.target.value })
                    }
                    className="w-full p-3 bg-[#faf8f5] border border-[#ded9d0] rounded-xl text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#66513e]"
                  >
                    <option value="Hair Cutting">Hair Cutting</option>
                    <option value="Shaving & Beard">Shaving & Beard</option>
                    <option value="Head Massage & Spa">Head Massage & Spa</option>
                    <option value="Face Care & D-Tan">Face Care & D-Tan</option>
                    <option value="Hair & Beard Color">Hair & Beard Color</option>
                    <option value="Super Saver Combos">Super Saver Combos</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#66513e] uppercase mb-1">
                    Icon Emoji
                  </label>
                  <input
                    type="text"
                    value={serviceForm.icon}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, icon: e.target.value })
                    }
                    placeholder="✂️, 🪒, 💆‍♂️, ✨, 🎨, 🎁"
                    className="w-full p-3 bg-[#faf8f5] border border-[#ded9d0] rounded-xl text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#66513e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-[#66513e] uppercase mb-1">
                    Price Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={serviceForm.price}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, price: e.target.value })
                    }
                    placeholder="150"
                    className="w-full p-3 bg-[#faf8f5] border border-[#ded9d0] rounded-xl text-[#24231f] font-bold focus:outline-none focus:ring-2 focus:ring-[#66513e]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#66513e] uppercase mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={serviceForm.originalPrice}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, originalPrice: e.target.value })
                    }
                    placeholder="180"
                    className="w-full p-3 bg-[#faf8f5] border border-[#ded9d0] rounded-xl text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#66513e]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#66513e] uppercase mb-1">
                    Est. Duration
                  </label>
                  <input
                    type="text"
                    value={serviceForm.duration}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, duration: e.target.value })
                    }
                    placeholder="25 mins"
                    className="w-full p-3 bg-[#faf8f5] border border-[#ded9d0] rounded-xl text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#66513e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#66513e] uppercase mb-1">
                    Popularity Badge
                  </label>
                  <input
                    type="text"
                    value={serviceForm.popularBadge}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, popularBadge: e.target.value })
                    }
                    placeholder="e.g. Daily Classic, Bestseller"
                    className="w-full p-3 bg-[#faf8f5] border border-[#ded9d0] rounded-xl text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#66513e]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#66513e] uppercase mb-1">
                    Savings Note
                  </label>
                  <input
                    type="text"
                    value={serviceForm.savings}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, savings: e.target.value })
                    }
                    placeholder="e.g. Save ₹50"
                    className="w-full p-3 bg-[#faf8f5] border border-[#ded9d0] rounded-xl text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#66513e]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#66513e] uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={serviceForm.description}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, description: e.target.value })
                  }
                  placeholder="Details of what is included in this service..."
                  className="w-full p-3 bg-[#faf8f5] border border-[#ded9d0] rounded-xl text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#66513e]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ded9d0]">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#ded9d0] text-[#66513e] font-semibold hover:bg-[#f6f4ef]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#66513e] hover:bg-[#524131] text-white font-bold shadow-xs transition"
                >
                  Save Service to Rate Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT SERVICE / AMOUNT                                              */}
      {/* ========================================================================= */}
      {editingService && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setEditingService(null)}
        >
          <div
            className="bg-white rounded-3xl border border-[#ded9d0] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#ded9d0] mb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a7057]">
                  UPDATE RATE & AMOUNT
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#24231f]">
                  Edit Service Details
                </h3>
              </div>
              <button
                onClick={() => setEditingService(null)}
                className="w-8 h-8 rounded-full bg-[#f6f4ef] text-[#66513e] flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateService} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#66513e] uppercase mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) =>
                    setEditingService({ ...editingService, title: e.target.value })
                  }
                  className="w-full p-3 bg-[#faf8f5] border border-[#ded9d0] rounded-xl text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#66513e]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#66513e] uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={editingService.category}
                    onChange={(e) =>
                      setEditingService({ ...editingService, category: e.target.value })
                    }
                    className="w-full p-3 bg-[#faf8f5] border border-[#ded9d0] rounded-xl text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#66513e]"
                  >
                    <option value="Hair Cutting">Hair Cutting</option>
                    <option value="Shaving & Beard">Shaving & Beard</option>
                    <option value="Head Massage & Spa">Head Massage & Spa</option>
                    <option value="Face Care & D-Tan">Face Care & D-Tan</option>
                    <option value="Hair & Beard Color">Hair & Beard Color</option>
                    <option value="Super Saver Combos">Super Saver Combos</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#66513e] uppercase mb-1">
                    Icon Emoji
                  </label>
                  <input
                    type="text"
                    value={editingService.icon || "✂️"}
                    onChange={(e) =>
                      setEditingService({ ...editingService, icon: e.target.value })
                    }
                    className="w-full p-3 bg-[#faf8f5] border border-[#ded9d0] rounded-xl text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#66513e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-[#66513e] uppercase mb-1">
                    Price Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editingService.price}
                    onChange={(e) =>
                      setEditingService({ ...editingService, price: e.target.value })
                    }
                    className="w-full p-3 bg-[#faf8f5] border border-[#ded9d0] rounded-xl text-[#24231f] font-bold focus:outline-none focus:ring-2 focus:ring-[#66513e]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#66513e] uppercase mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingService.originalPrice || ""}
                    onChange={(e) =>
                      setEditingService({ ...editingService, originalPrice: e.target.value })
                    }
                    className="w-full p-3 bg-[#faf8f5] border border-[#ded9d0] rounded-xl text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#66513e]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#66513e] uppercase mb-1">
                    Est. Duration
                  </label>
                  <input
                    type="text"
                    value={editingService.duration || ""}
                    onChange={(e) =>
                      setEditingService({ ...editingService, duration: e.target.value })
                    }
                    className="w-full p-3 bg-[#faf8f5] border border-[#ded9d0] rounded-xl text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#66513e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#66513e] uppercase mb-1">
                    Popularity Badge
                  </label>
                  <input
                    type="text"
                    value={editingService.popularBadge || ""}
                    onChange={(e) =>
                      setEditingService({ ...editingService, popularBadge: e.target.value })
                    }
                    className="w-full p-3 bg-[#faf8f5] border border-[#ded9d0] rounded-xl text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#66513e]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#66513e] uppercase mb-1">
                    Savings Note
                  </label>
                  <input
                    type="text"
                    value={editingService.savings || ""}
                    onChange={(e) =>
                      setEditingService({ ...editingService, savings: e.target.value })
                    }
                    className="w-full p-3 bg-[#faf8f5] border border-[#ded9d0] rounded-xl text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#66513e]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#66513e] uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={editingService.description || ""}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                  className="w-full p-3 bg-[#faf8f5] border border-[#ded9d0] rounded-xl text-[#24231f] focus:outline-none focus:ring-2 focus:ring-[#66513e]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ded9d0]">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#ded9d0] text-[#66513e] font-semibold hover:bg-[#f6f4ef]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#66513e] hover:bg-[#524131] text-white font-bold shadow-xs transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE SERVICE CONFIRMATION                                        */}
      {/* ========================================================================= */}
      {serviceToDelete && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setServiceToDelete(null)}
        >
          <div
            className="bg-white rounded-3xl border border-[#ded9d0] max-w-md w-full p-6 sm:p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-2xl font-bold text-red-700 mb-2">
              Delete Service from Rate Card?
            </h3>
            <p className="text-sm text-[#4a463f] mb-6 leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-[#24231f]">{serviceToDelete.title}</strong> (
              ₹{serviceToDelete.price})? It will no longer appear on the public amount page.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#ded9d0]">
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#ded9d0] text-[#66513e] hover:bg-[#f6f4ef]"
                onClick={() => setServiceToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition"
                onClick={() => handleDeleteService(serviceToDelete._id)}
              >
                Yes, Delete Service
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
