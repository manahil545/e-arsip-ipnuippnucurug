import React, { useState } from 'react';
import { Camera, Upload, X, Save, FileText, Calendar, User, Tag, Package } from 'lucide-react';

import logoIpnu from 'figma:asset/bde25cb6a659b7414d1d129468dba2c65f9589ed.png';
import logoIppnu from 'figma:asset/b163ae915bad27a92607ddcc8024114d2a613bba.png';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ArchiveFormProps {
  type: 'masuk' | 'keluar' | 'inventaris';
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const ArchiveForm: React.FC<ArchiveFormProps> = ({ type, onClose, onSubmit }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('ipnu');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const title = {
    masuk: 'Surat Masuk Baru',
    keluar: 'Surat Keluar Baru',
    inventaris: 'Tambah Inventaris'
  }[type];

  return (
    <div className="bg-gradient-to-b from-white to-emerald-50 rounded-t-[32px] p-6 shadow-2xl max-h-[90vh] overflow-y-auto border-t border-emerald-100 relative">
      {/* Decorative background logo */}
      <div className="absolute top-20 right-0 w-64 h-64 opacity-[0.02] pointer-events-none">
        <ImageWithFallback src={logoIpnu} alt="" className="w-full h-full object-contain rotate-12" />
      </div>

      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-1">
            <div className="w-6 h-6">
              <ImageWithFallback src={logoIpnu} alt="IPNU" className="w-full h-full object-contain" />
            </div>
            <div className="w-6 h-6">
              <ImageWithFallback src={logoIppnu} alt="IPPNU" className="w-full h-full object-contain" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        </div>
        <button onClick={onClose} className="p-2 bg-gray-100 rounded-full">
          <X size={20} />
        </button>
      </div>

      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSubmit({}); }}>
        {/* Category Selector for Letters */}
        {type !== 'inventaris' && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Tag size={12} /> Kategori Surat
            </label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-white"
            >
              <option value="ipnu">Surat IPNU</option>
              <option value="ippnu">Surat IPPNU</option>
              <option value="bersama">Surat Bersama (IPNU IPPNU)</option>
            </select>
          </div>
        )}

        {/* Index Selector for IPNU/IPPNU */}
        {type !== 'inventaris' && (selectedCategory === 'ipnu' || selectedCategory === 'ippnu') && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Tag size={12} /> Indeks Surat
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['A', 'B', 'C'].map((idx) => (
                <label key={idx} className="relative cursor-pointer">
                  <input type="radio" name="index_surat" value={idx} className="peer hidden" defaultChecked={idx === 'A'} />
                  <div className="py-2.5 text-center rounded-xl border-2 border-gray-100 peer-checked:border-emerald-600 peer-checked:bg-emerald-50 text-gray-400 peer-checked:text-emerald-700 font-bold transition-all">
                    Indeks {idx}
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Title/Subject */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <FileText size={12} /> {type === 'inventaris' ? 'Nama Barang' : 'Perihal Surat'}
          </label>
          <input 
            type="text" 
            placeholder={type === 'inventaris' ? 'Contoh: Bendera IPNU' : 'Contoh: Undangan Lakmud'}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Date */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Calendar size={12} /> Tanggal
            </label>
            <input 
              type="date" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>
          {/* Code/Number */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Tag size={12} /> {type === 'inventaris' ? 'Jumlah' : 'No. Surat'}
            </label>
            <input 
              type={type === 'inventaris' ? 'number' : 'text'} 
              placeholder={type === 'inventaris' ? '0' : '001/A/...'}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Sender/Recipient / Condition */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <User size={12} /> {type === 'masuk' ? 'Pengirim' : type === 'keluar' ? 'Tujuan' : 'Kondisi Saat Ini'}
          </label>
          <input 
            type="text" 
            placeholder={type === 'inventaris' ? 'Contoh: Baik / Perlu Perbaikan' : 'Contoh: PR IPNU IPPNU Desa Curug...'}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        {/* Description/Keterangan for Incoming Letters */}
        {type === 'masuk' && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <FileText size={12} /> Keterangan Tambahan
            </label>
            <textarea 
              placeholder="Contoh: Barangkali menghadiri, disposisi ketua, dll."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all min-h-[80px]"
            />
          </div>
        )}

        {/* Additional Inventory Fields */}
        {type === 'inventaris' && (
          <>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Package size={12} /> Lokasi Penyimpanan
              </label>
              <input 
                type="text" 
                placeholder="Contoh: Lemari Sekretariat / Gudang"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <User size={12} /> Dipinjam Oleh
                </label>
                <input 
                  type="text" 
                  placeholder="Nama peminjam"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <Calendar size={12} /> Tanggal Pinjam
                </label>
                <input 
                  type="date" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
            </div>
          </>
        )}

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Foto / Dokumen</label>
          <div className="flex gap-4">
            <label className="flex-1 h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <>
                  <Camera className="text-gray-400" size={32} />
                  <span className="text-xs text-gray-400">Ambil Foto</span>
                </>
              )}
            </label>
            <label className="flex-1 h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
              <Upload className="text-gray-400" size={32} />
              <span className="text-xs text-gray-400">Pilih File</span>
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-emerald-800 to-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 active:scale-[0.96] transition-all border-b-4 border-emerald-900/20"
        >
          <Save size={20} /> Simpan Data
        </button>
      </form>
    </div>
  );
};
