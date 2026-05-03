import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  MailPlus,
  MailMinus,
  Package,
  User,
  Plus,
  Search,
  FileText,
  ChevronRight,
  Camera,
  LogOut,
  ChevronLeft,
  Loader2,
  Trash2,
  Home,
  Send,
  Lock,
  Mail,
  Box,
  Edit,
  FileType,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { createClient } from "@supabase/supabase-js";
import {
  projectId,
  publicAnonKey,
} from "./utils/supabase/info";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";

// --- Assets ---
import logoIpnu from "figma:asset/fd6953a403ad5ce7032190b3e96c17b487d082c5.png";
import logoIppnu from "figma:asset/844c7115cb9de569f378bdcb9c670e10c9f5009a.png";

// --- Supabase Config ---
const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
);
const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-a73e5047`;

// --- Components ---

const Button = ({
  children,
  onClick,
  className = "",
  variant = "primary",
  icon: Icon,
  loading = false,
  disabled = false,
  type = "button",
}: any) => {
  const base =
    "flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50 cursor-pointer";
  const variants: any = {
    primary:
      "bg-gradient-to-r from-[#008F4C] via-[#22A45D] to-[#77B634] text-white shadow-lg shadow-green-900/20",
    secondary:
      "bg-white text-[#008F4C] border border-gray-100 shadow-sm",
    danger: "bg-red-500 text-white",
    ghost: "bg-transparent text-gray-600",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        Icon && <Icon className="w-5 h-5" />
      )}
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }: any) => (
  <div
    className={`bg-white/80 backdrop-blur-sm rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 ${className}`}
  >
    {children}
  </div>
);

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  options,
}: any) => (
  <div className="flex flex-col gap-1.5 mb-4">
    {label && (
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
        {label}
      </label>
    )}
    {options ? (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#008F4C] focus:border-transparent outline-none transition-all appearance-none"
      >
        <option value="">Pilih {label}</option>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#008F4C] focus:border-transparent outline-none transition-all"
      />
    )}
  </div>
);

// --- Pages ---

const DashboardPage = ({ stats, recentActivity }: any) => (
  <div className="space-y-6 relative z-1">
    {/* Hero Card with Logos */}
    <div className="relative overflow-hidden bg-gradient-to-br from-[#0D5B3B] via-[#006B38] to-[#008F4C] rounded-[2rem] p-6 text-white shadow-xl">
      {/* Decorative Elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>

      {/* Logo badges in top right */}
      <div className="absolute top-4 right-4 flex gap-0">
        <div className="w-10 h-10 bg-white/15 backdrop-blur-md rounded-l-xl p-2 border border-white/20 shadow-lg">
          <img
            src={logoIpnu}
            alt="IPNU"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="w-10 h-10 bg-white/15 backdrop-blur-md rounded-r-xl p-2 border border-white/20 shadow-lg">
          <img
            src={logoIppnu}
            alt="IPPNU"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Large watermark logos */}
      <div className="absolute bottom-0 right-0 opacity-10 overflow-hidden pointer-events-none">
        <img
          src={logoIpnu}
          alt=""
          className="w-48 h-48 rotate-12 translate-x-8 translate-y-8"
        />
      </div>
      <div className="absolute bottom-0 left-0 opacity-8 overflow-hidden pointer-events-none">
        <img
          src={logoIppnu}
          alt=""
          className="w-40 h-40 -rotate-12 -translate-x-6 translate-y-6"
        />
      </div>

      <div className="relative z-10">
        <h2 className="text-2xl font-black mb-2 leading-tight">
          Selamat Datang!
        </h2>
        <p className="text-white/80 text-sm font-medium leading-relaxed">
          Kelola administrasi PR IPNU IPPNU Desa
          <br />
          Curug dengan lebih modern dan profesional.
        </p>
      </div>
    </div>

    {/* Stats Cards with Colors */}
    <div className="grid grid-cols-3 gap-3">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-100 p-5 text-center">
        <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-2xl flex items-center justify-center">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">
          Surat Masuk
        </p>
        <p className="text-3xl font-black text-blue-700">
          {stats?.masuk || 0}
        </p>
      </Card>

      <Card className="bg-gradient-to-br from-teal-50 to-teal-100/50 border-teal-100 p-5 text-center">
        <div className="w-12 h-12 mx-auto mb-3 bg-teal-100 rounded-2xl flex items-center justify-center">
          <Send className="w-6 h-6 text-teal-600" />
        </div>
        <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wider mb-1">
          Surat Keluar
        </p>
        <p className="text-3xl font-black text-teal-700">
          {stats?.keluar || 0}
        </p>
      </Card>

      <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-100 p-5 text-center">
        <div className="w-12 h-12 mx-auto mb-3 bg-amber-100 rounded-2xl flex items-center justify-center">
          <Box className="w-6 h-6 text-amber-600" />
        </div>
        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">
          Inventaris
        </p>
        <p className="text-3xl font-black text-amber-700">
          {stats?.inventaris || 0}
        </p>
      </Card>
    </div>

    {/* Aktivitas Terkini Section */}
    <div className="pt-4">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-lg font-black text-gray-800">
          Aktivitas Terkini
        </h3>
        <button className="text-xs font-bold text-[#008F4C] uppercase tracking-wider hover:underline">
          Lihat Semua
        </button>
      </div>

      <div className="space-y-3">
        {recentActivity.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-[#008F4C] to-[#14B8A6] rounded-2xl flex items-center justify-center opacity-20">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm font-bold text-gray-400">
              Belum ada aktivitas
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Data akan muncul setelah ada input arsip
            </p>
          </Card>
        ) : (
          recentActivity.map((item: any, index: number) => {
            const isNew = index === 0;
            const timeAgo = item.timestamp
              ? getTimeAgo(item.timestamp)
              : "Baru saja";

            return (
              <Card
                key={item.id}
                className="flex items-center gap-4 p-4 hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  {item.file_url ? (
                    <ImageWithFallback
                      src={item.file_url}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#008F4C] to-[#14B8A6] flex items-center justify-center">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 mb-1 leading-tight line-clamp-1">
                    {item.perihal ||
                      item.nama_barang ||
                      "Dokumen Baru"}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">
                    {item.type === "masuk"
                      ? "Surat Masuk"
                      : item.type === "keluar"
                        ? "Surat Keluar"
                        : "Inventaris"}{" "}
                    • {timeAgo}
                  </p>
                </div>
                {isNew && (
                  <div className="flex-shrink-0">
                    <span className="text-[10px] font-black uppercase px-3 py-1.5 bg-gradient-to-r from-[#008F4C] to-[#14B8A6] text-white rounded-lg shadow-sm">
                      Baru
                    </span>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  </div>
);

const DataList = ({
  type,
  items,
  onAdd,
  onDelete,
  onEdit,
}: any) => {
  const [search, setSearch] = useState("");

  const filtered = items.filter((item: any) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase()),
    ),
  );

  return (
    <div className="space-y-4 relative z-1 pb-10">
      <div className="flex items-center justify-between mb-6 px-1">
        <div>
          <h2 className="text-2xl font-black text-gray-800 capitalize leading-tight">
            {type === "masuk"
              ? "Surat Masuk"
              : type === "keluar"
                ? "Surat Keluar"
                : "Inventaris"}
          </h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Manajemen Arsip
          </p>
        </div>
        <button
          onClick={onAdd}
          className="w-12 h-12 rounded-2xl bg-[#008F4C] text-white flex items-center justify-center shadow-lg shadow-green-900/20 active:scale-90 transition-all"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="text-gray-400 w-5 h-5 group-focus-within:text-[#008F4C] transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Cari arsip atau barang..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white focus:ring-4 focus:ring-green-500/10 focus:border-[#008F4C] outline-none transition-all shadow-sm"
        />
      </div>

      <div className="space-y-4 mt-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center opacity-40">
              <Search className="w-10 h-10" />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              Data Tidak Ditemukan
            </p>
          </div>
        ) : (
          filtered.map((item: any) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={item.id}
            >
              <Card className="relative overflow-hidden group">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${
                          item.klasifikasi === "IPNU"
                            ? "bg-blue-600 text-white shadow-sm"
                            : item.klasifikasi === "IPPNU"
                              ? "bg-[#008F4C] text-white shadow-sm"
                              : "bg-gray-800 text-white shadow-sm"
                        }`}
                      >
                        {item.klasifikasi} - {item.indeks}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {item.tanggal}
                      </span>
                    </div>
                    <h4 className="font-black text-lg text-gray-800 leading-tight mb-1">
                      {item.perihal || item.nama_barang}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                      <p className="line-clamp-1">
                        {type === "inventaris"
                          ? `Lokasi: ${item.lokasi}`
                          : `${item.pengirim || item.tujuan}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(item.id)}
                      className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {item.file_url && (
                  <div className="mt-4 overflow-hidden rounded-2xl aspect-video bg-gray-100 border border-gray-100">
                    <ImageWithFallback
                      src={item.file_url}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

const FormPage = ({
  type,
  onSave,
  onCancel,
  initialData,
}: any) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({
    tanggal: new Date().toISOString().split("T")[0],
    klasifikasi: "",
    indeks: "",
    perihal: "",
    pengirim: "",
    tujuan: "",
    keterangan: "",
    nama_barang: "",
    jumlah: "",
    lokasi: "",
    status: "Tersedia",
    file_url: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch(`${SERVER_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: fd,
      });
      const data = await res.json();
      if (data.url) {
        setFormData({ ...formData, file_url: data.url });
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Gagal mengunggah file");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <div className="pb-20 relative z-1">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onCancel}
          className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 shadow-sm active:scale-90 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-xl font-black text-gray-800 leading-tight">
            Input {type === "inventaris" ? "Baru" : "Arsip"}
          </h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Formulir Digital
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Card className="p-6">
          {type !== "inventaris" ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Klasifikasi"
                  options={[
                    { label: "IPNU", value: "IPNU" },
                    { label: "IPPNU", value: "IPPNU" },
                    { label: "Bersama", value: "Bersama" },
                  ]}
                  value={formData.klasifikasi}
                  onChange={(v: string) =>
                    setFormData({ ...formData, klasifikasi: v })
                  }
                />
                <Input
                  label="Indeks"
                  options={[
                    { label: "A (Internal)", value: "A" },
                    { label: "B (Eksternal)", value: "B" },
                    { label: "C (Lainnya)", value: "C" },
                  ]}
                  value={formData.indeks}
                  onChange={(v: string) =>
                    setFormData({ ...formData, indeks: v })
                  }
                />
              </div>
              <Input
                label="Tanggal Surat"
                type="date"
                value={formData.tanggal}
                onChange={(v: string) =>
                  setFormData({ ...formData, tanggal: v })
                }
              />
              <Input
                label={
                  type === "masuk"
                    ? "Pengirim (Asal)"
                    : "Tujuan (Penerima)"
                }
                value={
                  type === "masuk"
                    ? formData.pengirim
                    : formData.tujuan
                }
                onChange={(v: string) =>
                  setFormData({
                    ...formData,
                    [type === "masuk" ? "pengirim" : "tujuan"]:
                      v,
                  })
                }
                placeholder="Contoh: PAC IPNU IPPNU Kec. Tirto"
              />
              <Input
                label="Perihal / Judul"
                value={formData.perihal}
                onChange={(v: string) =>
                  setFormData({ ...formData, perihal: v })
                }
                placeholder="Contoh: Undangan Raker"
              />
              {type === "masuk" && (
                <Input
                  label="Keterangan Tambahan"
                  value={formData.keterangan}
                  onChange={(v: string) =>
                    setFormData({ ...formData, keterangan: v })
                  }
                  placeholder="Opsional..."
                />
              )}
            </>
          ) : (
            <>
              <Input
                label="Nama Barang"
                value={formData.nama_barang}
                onChange={(v: string) =>
                  setFormData({ ...formData, nama_barang: v })
                }
                placeholder="Contoh: Bendera Pataka"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Jumlah"
                  type="number"
                  value={formData.jumlah}
                  onChange={(v: string) =>
                    setFormData({ ...formData, jumlah: v })
                  }
                  placeholder="0"
                />
                <Input
                  label="Status"
                  options={[
                    { label: "Tersedia", value: "Tersedia" },
                    { label: "Dipinjam", value: "Dipinjam" },
                    { label: "Rusak", value: "Rusak" },
                  ]}
                  value={formData.status}
                  onChange={(v: string) =>
                    setFormData({ ...formData, status: v })
                  }
                />
              </div>
              <Input
                label="Lokasi Penyimpanan"
                value={formData.lokasi}
                onChange={(v: string) =>
                  setFormData({ ...formData, lokasi: v })
                }
                placeholder="Contoh: Sekretariat"
              />
            </>
          )}
        </Card>

        <Card className="p-6">
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1 mb-3 block">
            Unggah Dokumentasi
          </label>
          <div className="relative border-4 border-dashed border-gray-100 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-3 bg-gray-50/50 text-gray-400 group hover:bg-green-50/50 hover:border-green-100 transition-all cursor-pointer">
            {formData.file_url ? (
              <div className="absolute inset-0 p-3">
                <ImageWithFallback
                  src={formData.file_url}
                  className="w-full h-full object-cover rounded-[1.5rem] shadow-lg"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, file_url: "" })
                  }
                  className="absolute top-6 right-6 bg-red-500 text-white p-2.5 rounded-full shadow-xl active:scale-90"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm text-[#008F4C]">
                  {loading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    <Camera className="w-8 h-8" />
                  )}
                </div>
                <div className="text-center">
                  <span className="text-xs font-black uppercase tracking-widest block mb-1">
                    Ambil Foto / File
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium italic">
                    JPG, PNG, PDF (Maks 10MB)
                  </span>
                </div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*,application/pdf"
                />
              </>
            )}
          </div>
        </Card>

        <Button
          type="submit"
          loading={loading}
          className="w-full py-5 rounded-[2rem] shadow-xl shadow-green-900/30"
        >
          Simpan Data
        </Button>
      </form>
    </div>
  );
};

// --- Auth ---

const LoginPage = ({ onLogin }: any) => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (user === "admin" && pass === "curug2026") {
        onLogin(true);
      } else {
        alert("Login gagal! Gunakan admin/curug2026");
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D4F1E3] via-[#E8F5EE] to-[#F0F9F4] flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="w-full max-w-sm relative z-10">
        {/* Logo Section */}
        <div className="flex justify-center gap-0 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-white rounded-l-[2rem] p-3 flex items-center justify-center shadow-lg"
          >
            <img
              src={logoIpnu}
              alt="IPNU"
              className="w-full h-full object-contain"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-20 h-20 bg-white rounded-r-[2rem] p-3 flex items-center justify-center shadow-lg"
          >
            <img
              src={logoIppnu}
              alt="IPPNU"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-800 mb-2 tracking-tight">
            E-ARSIP
          </h1>
          <p className="text-[#008F4C] font-bold text-sm uppercase tracking-wider">
            DESA CURUG
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white border-0 shadow-xl p-8 rounded-[2rem]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#008F4C]" />
                  <input
                    type="text"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    placeholder="Masukkan username"
                    className="w-full pl-12 pr-4 py-4 bg-[#F0F9F4] border-0 rounded-2xl focus:ring-2 focus:ring-[#008F4C] outline-none transition-all text-gray-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#008F4C]" />
                  <input
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-[#F0F9F4] border-0 rounded-2xl focus:ring-2 focus:ring-[#008F4C] outline-none transition-all text-gray-700"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#006B38] hover:bg-[#005830] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-lg"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "MASUK SEKARANG"
                )}
                {!loading && (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
            </form>
          </Card>
        </motion.div>

        <p className="text-center text-gray-400 text-[10px] font-medium uppercase tracking-wider mt-8">
          PIMPINAN RANTING IPNU IPPNU
          <br />
          DESA CURUG © 2026
        </p>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(
    null,
  );
  const [data, setData] = useState<any>({
    masuk: [],
    keluar: [],
    inventaris: [],
  });
  const [stats, setStats] = useState({
    masuk: 0,
    keluar: 0,
    inventaris: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any>([]);

  useEffect(() => {
    const saved = localStorage.getItem("isLoggedIn");
    if (saved === "true") setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
      fetchStats();
      fetchRecentActivity();
    }
  }, [isLoggedIn, view]);

  const fetchData = async () => {
    const types = ["masuk", "keluar", "inventaris"];
    const newData: any = { ...data };
    for (const type of types) {
      try {
        const res = await fetch(`${SERVER_URL}/data/${type}`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        });
        newData[type] = await res.json();
      } catch (err) {
        console.error(`Failed to fetch ${type}`, err);
      }
    }
    setData(newData);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/stats`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      setStats(await res.json());
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/recent-activity`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });

      if (!res.ok) {
        // If endpoint returns error, try to build from local data
        const allData = [
          ...data.masuk.map((item: any) => ({
            ...item,
            type: "masuk",
          })),
          ...data.keluar.map((item: any) => ({
            ...item,
            type: "keluar",
          })),
          ...data.inventaris.map((item: any) => ({
            ...item,
            type: "inventaris",
          })),
        ];

        const recent = allData
          .sort((a, b) => {
            const dateA = new Date(a.timestamp || 0).getTime();
            const dateB = new Date(b.timestamp || 0).getTime();
            return dateB - dateA;
          })
          .slice(0, 5);

        setRecentActivity(recent);
        return;
      }

      const text = await res.text();
      if (!text || text.trim() === "") {
        setRecentActivity([]);
        return;
      }

      try {
        const responseData = JSON.parse(text);
        setRecentActivity(responseData || []);
      } catch (parseError) {
        console.warn(
          "Failed to parse recent activity:",
          parseError,
        );
        setRecentActivity([]);
      }
    } catch (err) {
      console.error("Failed to fetch recent activity", err);
      // Fallback: use local data
      const allData = [
        ...data.masuk.map((item: any) => ({
          ...item,
          type: "masuk",
        })),
        ...data.keluar.map((item: any) => ({
          ...item,
          type: "keluar",
        })),
        ...data.inventaris.map((item: any) => ({
          ...item,
          type: "inventaris",
        })),
      ];

      const recent = allData
        .sort((a, b) => {
          const dateA = new Date(a.timestamp || 0).getTime();
          const dateB = new Date(b.timestamp || 0).getTime();
          return dateB - dateA;
        })
        .slice(0, 5);

      setRecentActivity(recent);
    }
  };

  const handleLogin = (val: boolean) => {
    setIsLoggedIn(val);
    if (val) localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    if (confirm("Keluar dari aplikasi?")) {
      setIsLoggedIn(false);
      localStorage.removeItem("isLoggedIn");
    }
  };

  const handleSave = async (formData: any) => {
    try {
      const url = editingId
        ? `${SERVER_URL}/data/${view}/${editingId}`
        : `${SERVER_URL}/data/${view}`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsAdding(false);
        setEditingId(null);
        fetchData();
        fetchStats();
        fetchRecentActivity();
      }
    } catch (err) {
      alert("Gagal menyimpan data");
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Apakah anda yakin ingin menghapus data ini secara permanen?",
      )
    )
      return;
    try {
      const res = await fetch(
        `${SERVER_URL}/data/${view}/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        },
      );
      if (res.ok) {
        fetchData();
        fetchStats();
        fetchRecentActivity();
      }
    } catch (err) {
      alert("Gagal menghapus data");
    }
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsAdding(true);
  };

  if (!isLoggedIn) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-32 text-gray-800 font-sans selection:bg-green-100 selection:text-green-900 overflow-x-hidden relative">
      {/* Background Watermark Logos */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center z-0 overflow-hidden">
        <img
          src={logoIpnu}
          className="w-[120%] max-w-none grayscale absolute -rotate-12 translate-x-[-20%] translate-y-[-20%]"
          alt=""
        />
        <img
          src={logoIppnu}
          className="w-[120%] max-w-none grayscale absolute rotate-12 translate-x-[20%] translate-y-[20%]"
          alt=""
        />
      </div>

      {/* Green Header */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-[#006B38] to-[#008F4C] px-6 py-5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md p-2 border border-white/30">
              <img
                src={logoIpnu}
                alt="IPNU"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md p-2 border border-white/30">
              <img
                src={logoIppnu}
                alt="IPPNU"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div>
            <h1 className="font-black text-lg leading-none text-white">
              E-ARSIP
            </h1>
            <p className="text-[10px] text-white/80 font-bold tracking-wide uppercase">
              PR IPNU IPPNU DESA CURUG
            </p>
          </div>
        </div>
        <button className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white active:scale-90 transition-all">
          <Search className="w-5 h-5" />
        </button>
      </header>

      <main className="p-6 max-w-lg mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {isAdding ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
              }}
            >
              <FormPage
                type={view}
                onSave={handleSave}
                onCancel={() => {
                  setIsAdding(false);
                  setEditingId(null);
                }}
                initialData={
                  editingId
                    ? data[view]?.find(
                        (i: any) => i.id === editingId,
                      )
                    : null
                }
              />
            </motion.div>
          ) : (
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
              }}
            >
              {view === "dashboard" && (
                <DashboardPage
                  stats={stats}
                  recentActivity={recentActivity}
                />
              )}
              {view === "masuk" && (
                <DataList
                  type="masuk"
                  items={data.masuk}
                  onAdd={() => setIsAdding(true)}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              )}
              {view === "keluar" && (
                <DataList
                  type="keluar"
                  items={data.keluar}
                  onAdd={() => setIsAdding(true)}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              )}
              {view === "inventaris" && (
                <DataList
                  type="inventaris"
                  items={data.inventaris}
                  onAdd={() => setIsAdding(true)}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modern Bottom Nav */}
      <nav className="fixed bottom-6 left-6 right-6 h-20 bg-[#1A1A1A]/90 backdrop-blur-2xl rounded-[2.5rem] flex justify-around items-center z-40 shadow-2xl shadow-black/20 px-4 border border-white/10">
        <NavButton
          active={view === "dashboard" && !isAdding}
          onClick={() => {
            setView("dashboard");
            setIsAdding(false);
          }}
          icon={LayoutDashboard}
          label="Home"
        />
        <NavButton
          active={view === "masuk" && !isAdding}
          onClick={() => {
            setView("masuk");
            setIsAdding(false);
          }}
          icon={MailPlus}
          label="Masuk"
        />
        <NavButton
          active={view === "keluar" && !isAdding}
          onClick={() => {
            setView("keluar");
            setIsAdding(false);
          }}
          icon={MailMinus}
          label="Keluar"
        />
        <NavButton
          active={view === "inventaris" && !isAdding}
          onClick={() => {
            setView("inventaris");
            setIsAdding(false);
          }}
          icon={Package}
          label="Barang"
        />
      </nav>
    </div>
  );
}

const NavButton = ({
  active,
  onClick,
  icon: Icon,
  label,
}: any) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all flex-1 py-2 ${active ? "" : "opacity-50"}`}
  >
    <div
      className={`p-2.5 rounded-2xl transition-all duration-300 ${active ? "bg-gradient-to-br from-[#008F4C] to-[#77B634]" : ""}`}
    >
      <Icon
        className={`w-6 h-6 ${active ? "text-white" : "text-gray-400"}`}
      />
    </div>
    <span
      className={`text-[9px] font-bold uppercase tracking-wide ${active ? "text-white" : "text-gray-500"}`}
    >
      {label}
    </span>
  </button>
);

// --- Helper Functions ---

const getTimeAgo = (timestamp: string) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diff = now.getTime() - time.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} hari yang lalu`;
  if (hours > 0) return `${hours} jam yang lalu`;
  if (minutes > 0) return `${minutes} menit yang lalu`;
  return "Baru saja";
};