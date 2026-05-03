import React from 'react';
import { Home, Inbox, Send, Package, Plus, Search, FileText, Camera, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import logoIpnu from 'figma:asset/bde25cb6a659b7414d1d129468dba2c65f9589ed.png';
import logoIppnu from 'figma:asset/b163ae915bad27a92607ddcc8024114d2a613bba.png';
import { ImageWithFallback } from './figma/ImageWithFallback';

import logoIpnu from 'figma:asset/bde25cb6a659b7414d1d129468dba2c65f9589ed.png';
import logoIppnu from 'figma:asset/b163ae915bad27a92607ddcc8024114d2a613bba.png';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-col h-screen bg-emerald-50/30 text-slate-900 font-sans relative overflow-hidden">
      {/* Translucent Background Logos */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03] z-0">
        <div className="absolute -top-10 -left-10 w-64 h-64 rotate-12">
          <ImageWithFallback src={logoIpnu} alt="" className="w-full h-full object-contain" />
        </div>
        <div className="absolute top-1/2 -right-20 w-80 h-80 -rotate-12">
          <ImageWithFallback src={logoIppnu} alt="" className="w-full h-full object-contain" />
        </div>
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-72 h-72 opacity-50">
          <ImageWithFallback src={logoIpnu} alt="" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Header with Gradient */}
      <header className="bg-gradient-to-r from-emerald-900 via-emerald-700 to-emerald-600 text-white p-4 shadow-lg flex justify-between items-center sticky top-0 z-20 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 border-2 border-emerald-500 shadow-sm z-10">
              <ImageWithFallback src={logoIpnu} alt="IPNU" className="w-full h-full object-contain" />
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 border-2 border-emerald-500 shadow-sm">
              <ImageWithFallback src={logoIppnu} alt="IPPNU" className="w-full h-full object-contain" />
            </div>
          </div>
          <div>
            <h1 className="font-black text-lg leading-tight uppercase tracking-tighter drop-shadow-sm">E-Arsip</h1>
            <p className="text-[9px] text-emerald-100/90 font-bold tracking-widest leading-none">PR IPNU IPPNU DESA CURUG</p>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
          <Search size={20} className="text-emerald-50" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 p-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-3 px-2 z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <NavButton 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
          icon={<Home size={24} />} 
          label="Beranda" 
        />
        <NavButton 
          active={activeTab === 'surat-masuk'} 
          onClick={() => setActiveTab('surat-masuk')} 
          icon={<Inbox size={24} />} 
          label="Masuk" 
        />
        <NavButton 
          active={activeTab === 'surat-keluar'} 
          onClick={() => setActiveTab('surat-keluar')} 
          icon={<Send size={24} />} 
          label="Keluar" 
        />
        <NavButton 
          active={activeTab === 'inventaris'} 
          onClick={() => setActiveTab('inventaris')} 
          icon={<Package size={24} />} 
          label="Barang" 
        />
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-emerald-700 font-semibold' : 'text-gray-400'}`}
  >
    {icon}
    <span className="text-[10px] uppercase tracking-wider">{label}</span>
  </button>
);
