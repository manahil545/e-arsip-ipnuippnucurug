import React, { useState } from 'react';
import { Search, Filter, FileText, Calendar, MoreVertical, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoIpnu from 'figma:asset/bde25cb6a659b7414d1d129468dba2c65f9589ed.png';

interface ArchiveListProps {
  type: 'masuk' | 'keluar' | 'inventaris';
}

export const ArchiveList: React.FC<ArchiveListProps> = ({ type }) => {
  const [search, setSearch] = useState('');

  const [category, setCategory] = useState<'ipnu' | 'ippnu' | 'bersama'>('ipnu');

  const items = [
    { id: 1, title: 'Undangan Konancab', code: '042/PR/A/7354/X/2023', date: '2023-10-12', person: 'PAC IPNU IPPNU', cat: 'bersama', index: '-', note: 'Wajib hadir 2 delegasi' },
    { id: 2, title: 'Permohonan Delegasi', code: '043/PR/B/7354/X/2023', date: '2023-10-15', person: 'PR IPNU IPPNU Desa Curug', cat: 'ipnu', index: 'B', note: 'Sudah di disposisi' },
    { id: 3, title: 'Surat Keterangan Pengesahan', code: '044/PR/A/7354/X/2023', date: '2023-10-20', person: 'PAC IPNU IPPNU', cat: 'ippnu', index: 'A', note: 'Arsip fisik di lemari' },
  ];

  const inventoryItems = [
    { id: 1, title: 'Bendera IPNU', code: '12 Pcs', date: 'Kondisi Baik', person: 'Lemari A', location: 'Gudang Lt. 1', borrower: '-', borrowDate: '-' },
    { id: 2, title: 'Stempel Organisasi', code: '2 Pcs', date: 'Kondisi Baik', person: 'Sekretariat', location: 'Meja Admin', borrower: 'Rekan Ahmad', borrowDate: '2024-02-10' },
    { id: 3, title: 'Seragam Batik', code: '50 Pcs', date: '30 Baik, 20 Lama', person: 'Gudang', location: 'Lemari B', borrower: '-', borrowDate: '-' },
  ];

  const filteredItems = type === 'inventaris' 
    ? inventoryItems 
    : items.filter(item => item.cat === category);

  return (
    <div className="space-y-4 pb-20 relative z-10">
      {/* Category Tabs for Letters */}
      {type !== 'inventaris' && (
        <div className="flex bg-emerald-100/50 backdrop-blur-md p-1.5 rounded-2xl gap-1 border border-emerald-200/50 shadow-inner">
          {(['ipnu', 'ippnu', 'bersama'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${
                category === cat 
                  ? 'bg-gradient-to-r from-emerald-800 to-emerald-600 text-white shadow-md' 
                  : 'text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari arsip..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="p-2 bg-white border border-gray-100 rounded-xl shadow-sm text-gray-500">
          <Filter size={20} />
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredItems.map((item: any) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={item.id} 
            className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-emerald-50 flex gap-4 relative overflow-hidden group active:scale-[0.98] transition-transform"
          >
            {/* Subtle background logo for each item */}
            <div className="absolute -bottom-2 -right-2 w-16 h-16 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity">
               <ImageWithFallback src={logoIpnu} alt="" className="w-full h-full object-contain" />
            </div>

            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
              type === 'masuk' ? 'bg-blue-50 text-blue-600' : 
              type === 'keluar' ? 'bg-emerald-50 text-emerald-600' : 
              'bg-amber-50 text-amber-600'
            }`}>
              {type === 'inventaris' ? <Plus size={24} /> : <FileText size={24} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <h4 className="font-bold text-slate-800 truncate">{item.title}</h4>
                {item.index && item.index !== '-' && (
                  <span className="shrink-0 bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded font-black border border-emerald-200">
                    IND- {item.index}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">{item.code}</p>
              
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-gray-500 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {item.date}
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-gray-300"></div> {item.person}
                </span>
                {item.note && (
                  <span className="w-full text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded border border-blue-100/50 italic text-[10px] mt-1 block">
                    Ket: {item.note}
                  </span>
                )}
                {type === 'inventaris' && (
                  <>
                    <span className="w-full text-emerald-600 font-semibold mt-1">
                      Lokasi: {item.location}
                    </span>
                    {item.borrower !== '-' && (
                      <span className="w-full text-red-500 bg-red-50 px-2 py-0.5 rounded text-[10px]">
                        Dipinjam: {item.borrower} ({item.borrowDate})
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
            <button className="self-start p-1 text-gray-400">
              <MoreVertical size={20} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
