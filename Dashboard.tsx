import React from 'react';
import { FileText, Inbox, Send, Package, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoIpnu from 'figma:asset/bde25cb6a659b7414d1d129468dba2c65f9589ed.png';
import logoIppnu from 'figma:asset/b163ae915bad27a92607ddcc8024114d2a613bba.png';

export const Dashboard = () => {
  const stats = [
    { label: 'Surat Masuk', value: '124', icon: <Inbox className="text-blue-500" />, color: 'bg-blue-50' },
    { label: 'Surat Keluar', value: '89', icon: <Send className="text-emerald-500" />, color: 'bg-emerald-50' },
    { label: 'Inventaris', value: '42', icon: <Package className="text-amber-500" />, color: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6 relative z-10">
      {/* Welcome Card with Deep Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-600 p-6 text-white shadow-xl shadow-emerald-900/20 border border-white/10">
        {/* Transparent Logo in Card */}
        <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 rotate-12 pointer-events-none">
          <ImageWithFallback src={logoIpnu} alt="" className="w-full h-full object-contain" />
        </div>
        
        <div className="relative z-10 flex justify-between items-start">
          <div className="max-w-[75%]">
            <h2 className="text-xl font-black mb-1 tracking-tight">Selamat Datang!</h2>
            <p className="text-emerald-50/80 text-xs font-medium leading-relaxed">Kelola administrasi PR IPNU IPPNU Desa Curug dengan lebih modern dan profesional.</p>
          </div>
          <div className="flex gap-1.5">
            <div className="w-9 h-9 bg-white/20 backdrop-blur-xl rounded-xl p-1.5 border border-white/30 shadow-inner">
               <ImageWithFallback src={logoIpnu} alt="IPNU" className="w-full h-full object-contain" />
            </div>
            <div className="w-9 h-9 bg-white/20 backdrop-blur-xl rounded-xl p-1.5 border border-white/30 shadow-inner">
               <ImageWithFallback src={logoIppnu} alt="IPPNU" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2">
          <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest">
            Tahun Khidmat 2024-2026
          </div>
        </div>
      </div>

      {/* Quick Stats with Subtle Gradients */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, idx) => (
          <div key={idx} className={`${stat.color} p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm border border-emerald-100/50`}>
            <div className="mb-2 p-2 bg-white rounded-xl shadow-sm border border-emerald-50">
              {stat.icon}
            </div>
            <span className="text-[10px] text-emerald-800/60 font-black uppercase tracking-tighter mb-1">{stat.label}</span>
            <span className="text-xl font-black text-emerald-950">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800">Aktivitas Terkini</h3>
          <button className="text-emerald-700 text-xs font-semibold">Lihat Semua</button>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                <ImageWithFallback 
                  src={`https://images.unsplash.com/photo-1762627105132-f6ed848a23bf?auto=format&fit=crop&q=80&w=100`} 
                  alt="Doc"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-800">Undangan Rapat PR</h4>
                <p className="text-xs text-gray-500">Surat Masuk • 2 jam yang lalu</p>
              </div>
              <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                Baru
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
